import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../../services/firebase';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

const BarberContext = createContext();

export function BarberProvider({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [barber, setBarber] = useState(null);
    const [currentPage, setCurrentPage] = useState('schedule');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Dados do barbeiro
    const [appointments, setAppointments] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [earnings, setEarnings] = useState({
        today: 0,
        week: 0,
        month: 0,
        commission: 0
    });
    const [services, setServices] = useState([]);
    const [settings, setSettings] = useState(null);

    // ============================================
    // AUTENTICAÇÃO
    // ============================================
    const login = async (email, password) => {
        try {
            // Buscar colaborador por email
            const q = query(
                collection(db, 'collaborators'),
                where('email', '==', email.toLowerCase()),
                where('active', '==', true)
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return { success: false, message: 'Colaborador não encontrado' };
            }

            const collaboratorDoc = snapshot.docs[0];
            const collaboratorData = { id: collaboratorDoc.id, ...collaboratorDoc.data() };

            // Verificar senha (em produção, usar bcrypt ou similar)
            if (collaboratorData.password !== password) {
                return { success: false, message: 'Senha incorreta' };
            }

            // Login bem-sucedido
            setBarber(collaboratorData);
            setIsAuthenticated(true);
            localStorage.setItem('barber_session', JSON.stringify({
                id: collaboratorData.id,
                loginTime: new Date().toISOString()
            }));

            // Atualizar último login
            await updateDoc(doc(db, 'collaborators', collaboratorData.id), {
                lastLogin: serverTimestamp()
            });

            return { success: true };
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, message: 'Erro ao fazer login' };
        }
    };

    const logout = () => {
        setBarber(null);
        setIsAuthenticated(false);
        setAppointments([]);
        setBlocks([]);
        localStorage.removeItem('barber_session');
        setCurrentPage('login');
    };

    const checkSession = async () => {
        try {
            const session = localStorage.getItem('barber_session');
            if (!session) {
                setIsLoading(false);
                return;
            }

            const { id, loginTime } = JSON.parse(session);

            // Verificar se a sessão não expirou (24h)
            const loginDate = new Date(loginTime);
            const now = new Date();
            const hoursDiff = (now - loginDate) / (1000 * 60 * 60);

            if (hoursDiff > 24) {
                logout();
                setIsLoading(false);
                return;
            }

            // Buscar dados do colaborador
            const docRef = doc(db, 'collaborators', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().active) {
                setBarber({ id: docSnap.id, ...docSnap.data() });
                setIsAuthenticated(true);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Erro ao verificar sessão:', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    // ============================================
    // CARREGAR DADOS
    // ============================================
    const loadBarberData = useCallback(async () => {
        if (!barber?.id) return;

        try {
            // Carregar agendamentos do barbeiro
            const today = new Date().toISOString().split('T')[0];
            const appointmentsQuery = query(
                collection(db, 'appointments'),
                where('barberId', '==', barber.id),
                orderBy('date', 'desc')
            );
            const appointmentsSnap = await getDocs(appointmentsQuery);
            const appointmentsData = appointmentsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAppointments(appointmentsData);

            // Carregar bloqueios
            const blocksQuery = query(
                collection(db, 'scheduleBlocks'),
                where('collaboratorId', '==', barber.id),
                orderBy('startDate', 'desc')
            );
            const blocksSnap = await getDocs(blocksQuery);
            setBlocks(blocksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // Carregar serviços
            const servicesSnap = await getDocs(collection(db, 'services'));
            setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // Carregar configurações
            const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
            if (settingsDoc.exists()) {
                setSettings(settingsDoc.data());
            }

            // Calcular ganhos
            calculateEarnings(appointmentsData);

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }, [barber?.id]);

    const calculateEarnings = (appointmentsData) => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const completed = appointmentsData.filter(apt => apt.status === 'completed');

        const todayEarnings = completed
            .filter(apt => apt.date === today)
            .reduce((sum, apt) => sum + (apt.price || 0), 0);

        const weekEarnings = completed
            .filter(apt => new Date(apt.date) >= startOfWeek)
            .reduce((sum, apt) => sum + (apt.price || 0), 0);

        const monthEarnings = completed
            .filter(apt => new Date(apt.date) >= startOfMonth)
            .reduce((sum, apt) => sum + (apt.price || 0), 0);

        // Calcular comissão (usando comissão padrão do barbeiro)
        const commissionRate = barber?.commissions?.default || 50;
        const commission = (monthEarnings * commissionRate) / 100;

        setEarnings({
            today: todayEarnings,
            week: weekEarnings,
            month: monthEarnings,
            commission
        });
    };

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (isAuthenticated && barber) {
            loadBarberData();
        }
    }, [isAuthenticated, barber?.id, loadBarberData]);

    // ============================================
    // AGENDAMENTOS
    // ============================================
    const updateAppointmentStatus = async (appointmentId, status) => {
        try {
            await updateDoc(doc(db, 'appointments', appointmentId), {
                status,
                updatedAt: serverTimestamp()
            });
            setAppointments(prev => prev.map(apt =>
                apt.id === appointmentId ? { ...apt, status } : apt
            ));
            return true;
        } catch (error) {
            console.error('Erro ao atualizar agendamento:', error);
            return false;
        }
    };

    const startService = async (appointmentId) => {
        try {
            await updateDoc(doc(db, 'appointments', appointmentId), {
                status: 'in_progress',
                startedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            setAppointments(prev => prev.map(apt =>
                apt.id === appointmentId ? { ...apt, status: 'in_progress' } : apt
            ));
            return true;
        } catch (error) {
            console.error('Erro ao iniciar atendimento:', error);
            return false;
        }
    };

    const completeService = async (appointmentId) => {
        try {
            await updateDoc(doc(db, 'appointments', appointmentId), {
                status: 'completed',
                completedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            setAppointments(prev => prev.map(apt =>
                apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
            ));
            // Recalcular ganhos
            loadBarberData();
            return true;
        } catch (error) {
            console.error('Erro ao concluir atendimento:', error);
            return false;
        }
    };

    // ============================================
    // BLOQUEIOS
    // ============================================
    const addBlock = async (blockData) => {
        try {
            const docRef = await addDoc(collection(db, 'scheduleBlocks'), {
                ...blockData,
                collaboratorId: barber.id,
                collaboratorName: barber.name,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            setBlocks(prev => [...prev, { id: docRef.id, ...blockData, status: 'pending' }]);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Erro ao criar bloqueio:', error);
            return { success: false, message: error.message };
        }
    };

    const removeBlock = async (blockId) => {
        try {
            await deleteDoc(doc(db, 'scheduleBlocks', blockId));
            setBlocks(prev => prev.filter(b => b.id !== blockId));
            return true;
        } catch (error) {
            console.error('Erro ao remover bloqueio:', error);
            return false;
        }
    };

    // ============================================
    // PERFIL
    // ============================================
    const updateProfile = async (profileData) => {
        try {
            await updateDoc(doc(db, 'collaborators', barber.id), {
                ...profileData,
                updatedAt: serverTimestamp()
            });
            setBarber(prev => ({ ...prev, ...profileData }));
            return true;
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            return false;
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        if (barber.password !== currentPassword) {
            return { success: false, message: 'Senha atual incorreta' };
        }

        try {
            await updateDoc(doc(db, 'collaborators', barber.id), {
                password: newPassword,
                updatedAt: serverTimestamp()
            });
            setBarber(prev => ({ ...prev, password: newPassword }));
            return { success: true };
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            return { success: false, message: error.message };
        }
    };

    // ============================================
    // CONTEXT VALUE
    // ============================================
    const value = {
        // Estado
        isLoading,
        isAuthenticated,
        barber,
        currentPage,
        setCurrentPage,
        sidebarOpen,
        setSidebarOpen,

        // Auth
        login,
        logout,

        // Dados
        appointments,
        blocks,
        earnings,
        services,
        settings,

        // Ações agendamentos
        updateAppointmentStatus,
        startService,
        completeService,
        refreshData: loadBarberData,

        // Ações bloqueios
        addBlock,
        removeBlock,

        // Ações perfil
        updateProfile,
        changePassword
    };

    return (
        <BarberContext.Provider value={value}>
            {children}
        </BarberContext.Provider>
    );
}

export function useBarber() {
    const context = useContext(BarberContext);
    if (!context) {
        throw new Error('useBarber must be used within a BarberProvider');
    }
    return context;
}
