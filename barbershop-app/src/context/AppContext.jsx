import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../services/firebase';
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

const AppContext = createContext();

export function AppProvider({ children }) {
    // Estados de dados do Firestore
    const [units, setUnits] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [services, setServices] = useState([]);
    const [plans, setPlans] = useState([]);
    const [settings, setSettings] = useState(null);

    // Estado do usuário
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        profilePic: '',
        referralCode: '',
        referralCredits: 0,
        referralsMade: 0,
        redeemedGoals: [],
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userSubscription, setUserSubscription] = useState(null);

    // Agendamentos e pagamentos
    const [appointments, setAppointments] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);

    // Formas de pagamento
    const [paymentMethods, setPaymentMethodsState] = useState([]);

    // Notificações
    const [notifications, setNotificationsState] = useState({
        appointments: true,
        promotions: true,
        reminders: true,
        news: false,
    });

    // Horários disponíveis
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    ];

    // Metas de indicação
    const referralGoals = [
        { count: 3, reward: '1 Corte Grátis', icon: 'fa-scissors' },
        { count: 5, reward: 'Barba Grátis', icon: 'fa-face-grin-beam' },
        { count: 10, reward: 'Corte + Barba Grátis', icon: 'fa-crown' },
        { count: 15, reward: 'Kit Premium VS', icon: 'fa-gift' },
    ];

    // Estados de UI
    const [currentView, setCurrentView] = useState('agendar');
    const [activeModal, setActiveModal] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // ============================================
    // CARREGAR DADOS DO FIRESTORE
    // ============================================
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Carregar unidades
            const unitsSnap = await getDocs(query(collection(db, 'units'), orderBy('name')));
            const unitsData = unitsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUnits(unitsData);

            // Carregar barbeiros/colaboradores para o cliente
            const barbersSnap = await getDocs(query(collection(db, 'collaborators'), where('active', '==', true)));
            const barbersData = barbersSnap.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    role: data.role === 'barber' ? 'Barbeiro' : data.role,
                    image: data.image,
                    unitIds: data.unitId ? [data.unitId] : [],
                    ...data
                };
            });
            setBarbers(barbersData);

            // Carregar serviços
            const servicesSnap = await getDocs(query(collection(db, 'services'), orderBy('name')));
            const servicesData = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setServices(servicesData);

            // Carregar planos
            const plansSnap = await getDocs(query(collection(db, 'plans'), orderBy('price')));
            const plansData = plansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPlans(plansData);

            // Carregar configurações
            const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
            if (settingsDoc.exists()) {
                setSettings(settingsDoc.data());
            }

            // Verificar sessão do usuário
            checkUserSession();

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Verificar sessão do usuário no localStorage
    const checkUserSession = () => {
        const session = localStorage.getItem('user_session');
        if (session) {
            try {
                const userData = JSON.parse(session);
                setUserInfo(userData);
                setIsLoggedIn(true);
                loadUserData(userData.id);
            } catch (e) {
                console.error('Erro ao restaurar sessão:', e);
            }
        }
    };

    // Carregar dados específicos do usuário
    const loadUserData = async (userId) => {
        if (!userId) return;

        try {
            // Carregar agendamentos do usuário
            const appointmentsSnap = await getDocs(
                query(collection(db, 'appointments'), where('userId', '==', userId), orderBy('date', 'desc'))
            );
            setAppointments(appointmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ============================================
    // AUTENTICAÇÃO
    // ============================================
    const login = async (userData) => {
        setUserInfo(userData);
        setIsLoggedIn(true);
        localStorage.setItem('user_session', JSON.stringify(userData));
        await loadUserData(userData.id);
    };

    const logout = () => {
        setUserInfo({
            name: '',
            email: '',
            phone: '',
            birthdate: '',
            profilePic: '',
            referralCode: '',
            referralCredits: 0,
            referralsMade: 0,
            redeemedGoals: [],
        });
        setIsLoggedIn(false);
        setAppointments([]);
        setPaymentHistory([]);
        localStorage.removeItem('user_session');
    };

    // ============================================
    // ATUALIZAR DADOS DO USUÁRIO
    // ============================================
    const updateUserInfo = (updates) => {
        setUserInfo(prev => ({ ...prev, ...updates }));
        // Salvar no localStorage
        const updated = { ...userInfo, ...updates };
        localStorage.setItem('user_session', JSON.stringify(updated));
    };

    const updateSubscription = (updates) => {
        setUserSubscription(prev => ({ ...prev, ...updates }));
    };

    const updateNotifications = (key, value) => {
        setNotificationsState(prev => ({ ...prev, [key]: value }));
    };

    // ============================================
    // AGENDAMENTOS
    // ============================================
    const addAppointment = async (appointment) => {
        try {
            const newAppointment = {
                ...appointment,
                userId: userInfo.id,
                status: 'confirmed',
                rating: null,
                createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, 'appointments'), newAppointment);
            const created = { ...newAppointment, id: docRef.id };
            setAppointments(prev => [created, ...prev]);
            return created;
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            return null;
        }
    };

    const updateAppointment = async (id, updates) => {
        try {
            await updateDoc(doc(db, 'appointments', id), {
                ...updates,
                updatedAt: serverTimestamp()
            });
            setAppointments(prev =>
                prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
            );
        } catch (error) {
            console.error('Erro ao atualizar agendamento:', error);
        }
    };

    const cancelAppointment = (id) => {
        updateAppointment(id, { status: 'cancelled' });
    };

    const rateAppointment = (id, rating) => {
        updateAppointment(id, { rating });
    };

    // ============================================
    // MODAL
    // ============================================
    const openModal = (modalName, data = null) => {
        setActiveModal(modalName);
        setModalData(data);
    };

    const closeModal = () => {
        setActiveModal(null);
        setModalData(null);
    };

    // ============================================
    // FORMAS DE PAGAMENTO
    // ============================================
    const addPaymentMethod = (method) => {
        setPaymentMethodsState(prev => [...prev, { ...method, id: Date.now() }]);
    };

    const removePaymentMethod = (id) => {
        setPaymentMethodsState(prev => prev.filter(m => m.id !== id));
    };

    const setDefaultPaymentMethod = (id) => {
        setPaymentMethodsState(prev =>
            prev.map(m => ({ ...m, isDefault: m.id === id }))
        );
    };

    // ============================================
    // INDICAÇÕES
    // ============================================
    const addReferralCredit = () => {
        setUserInfo(prev => ({
            ...prev,
            referralCredits: prev.referralCredits + 1,
            referralsMade: prev.referralsMade + 1,
        }));
    };

    const useReferralCredit = () => {
        if (userInfo.referralCredits > 0) {
            setUserInfo(prev => ({
                ...prev,
                referralCredits: prev.referralCredits - 1,
            }));
            return true;
        }
        return false;
    };

    const redeemReferralGoal = (goalIndex) => {
        if (!userInfo.redeemedGoals.includes(goalIndex)) {
            setUserInfo(prev => ({
                ...prev,
                redeemedGoals: [...prev.redeemedGoals, goalIndex],
            }));
        }
    };

    // ============================================
    // HELPERS
    // ============================================
    const getUnitById = (id) => units.find(u => u.id === id);
    const getBarberById = (id) => barbers.find(b => b.id === id);
    const getServiceById = (id) => services.find(s => s.id === id);
    const getPlanById = (id) => plans.find(p => p.id === id);
    const getBarbersByUnit = (unitId) => barbers.filter(b =>
        b.unitIds?.includes(unitId) || b.unitId === unitId
    );

    // ============================================
    // CONTEXT VALUE
    // ============================================
    const value = {
        // Dados do Firestore
        units,
        barbers,
        services,
        plans,
        settings,
        timeSlots,
        referralGoals,

        // Dados do usuário
        userInfo,
        isLoggedIn,
        userSubscription,
        appointments,
        paymentHistory,
        paymentMethods,
        notifications,

        // UI State
        currentView,
        setCurrentView,
        activeModal,
        modalData,
        isLoading,
        setIsLoading,

        // Auth
        login,
        logout,

        // User Actions
        updateUserInfo,
        updateSubscription,
        updateNotifications,

        // Appointment Actions
        addAppointment,
        updateAppointment,
        cancelAppointment,
        rateAppointment,

        // Modal Actions
        openModal,
        closeModal,

        // Payment Actions
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,

        // Referral Actions
        addReferralCredit,
        useReferralCredit,
        redeemReferralGoal,

        // Helpers
        getUnitById,
        getBarberById,
        getServiceById,
        getPlanById,
        getBarbersByUnit,

        // Refresh
        refreshData: loadData,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

export default AppContext;
