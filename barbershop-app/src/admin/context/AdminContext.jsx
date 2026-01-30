import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as firestoreService from '../../services/firestoreService';

const AdminContext = createContext();

export function AdminProvider({ children }) {
    const [isAdminLoading, setIsAdminLoading] = useState(true);
    const [adminUser, setAdminUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Estados de dados
    const [metrics, setMetrics] = useState({
        todayAppointments: 0,
        weeklyRevenue: 0,
        activeClients: 0,
        pendingAppointments: 0,
        monthlyGrowth: 0,
        planSubscribers: 0,
    });
    const [appointments, setAppointments] = useState([]);
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [units, setUnits] = useState([]);
    const [plans, setPlans] = useState([]);
    const [settings, setSettings] = useState(null);

    // Estados de loading individuais
    const [loadingStates, setLoadingStates] = useState({
        appointments: false,
        clients: false,
        services: false,
        barbers: false,
        units: false,
        plans: false,
        settings: false,
    });

    // Função para atualizar loading de uma entidade
    const setEntityLoading = (entity, loading) => {
        setLoadingStates(prev => ({ ...prev, [entity]: loading }));
    };

    // ============================================
    // CARREGAR DADOS INICIAIS
    // ============================================
    const loadAllData = useCallback(async () => {
        setIsAdminLoading(true);
        try {
            const [
                settingsData,
                servicesData,
                barbersData,
                unitsData,
                plansData,
                clientsData,
                appointmentsData,
                metricsData
            ] = await Promise.all([
                firestoreService.getSettings(),
                firestoreService.getServices(),
                firestoreService.getBarbers(),
                firestoreService.getUnits(),
                firestoreService.getPlans(),
                firestoreService.getUsers(),
                firestoreService.getAppointments({ limit: 100 }),
                firestoreService.getMetrics()
            ]);

            setSettings(settingsData);
            setServices(servicesData);
            setBarbers(barbersData);
            setUnits(unitsData);
            setPlans(plansData);
            setClients(clientsData);
            setAppointments(appointmentsData);
            setMetrics(metricsData);
            setAdminUser({ name: 'Admin', email: 'admin@vsbarbearia.com' });
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setIsAdminLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    // ============================================
    // SETTINGS / CONFIGURAÇÕES
    // ============================================
    const saveSettings = async (newSettings) => {
        setEntityLoading('settings', true);
        const success = await firestoreService.updateSettings(newSettings);
        if (success) {
            setSettings(prev => ({ ...prev, ...newSettings }));
        }
        setEntityLoading('settings', false);
        return success;
    };

    // ============================================
    // APPOINTMENTS / AGENDAMENTOS
    // ============================================
    const refreshAppointments = async () => {
        setEntityLoading('appointments', true);
        const data = await firestoreService.getAppointments({ limit: 100 });
        setAppointments(data);
        setEntityLoading('appointments', false);
    };

    const updateAppointmentStatus = async (id, status) => {
        const success = await firestoreService.updateAppointmentStatus(id, status);
        if (success) {
            setAppointments(prev => prev.map(apt =>
                apt.id === id ? { ...apt, status } : apt
            ));
            // Atualizar métricas
            const metricsData = await firestoreService.getMetrics();
            setMetrics(metricsData);
        }
        return success;
    };

    // ============================================
    // CLIENTS / CLIENTES
    // ============================================
    const refreshClients = async () => {
        setEntityLoading('clients', true);
        const data = await firestoreService.getUsers();
        setClients(data);
        setEntityLoading('clients', false);
    };

    const updateClient = async (clientId, clientData) => {
        const success = await firestoreService.updateUser(clientId, clientData);
        if (success) {
            setClients(prev => prev.map(c =>
                c.id === clientId ? { ...c, ...clientData } : c
            ));
        }
        return success;
    };

    const addClientCashback = async (clientId, amount) => {
        const success = await firestoreService.addCashback(clientId, amount);
        if (success) {
            setClients(prev => prev.map(c =>
                c.id === clientId ? { ...c, cashback: (c.cashback || 0) + amount } : c
            ));
        }
        return success;
    };

    const addClientReferralCredit = async (clientId) => {
        const success = await firestoreService.addReferralCredit(clientId);
        if (success) {
            setClients(prev => prev.map(c =>
                c.id === clientId ? { ...c, referralCredits: (c.referralCredits || 0) + 1 } : c
            ));
        }
        return success;
    };

    const exportClients = () => {
        firestoreService.exportClientsToCSV(clients);
    };

    // ============================================
    // SERVICES / SERVIÇOS
    // ============================================
    const addService = async (serviceData) => {
        setEntityLoading('services', true);
        const id = await firestoreService.addService(serviceData);
        if (id) {
            setServices(prev => [...prev, { id, ...serviceData, active: true }]);
        }
        setEntityLoading('services', false);
        return id;
    };

    const updateService = async (id, serviceData) => {
        const success = await firestoreService.updateService(id, serviceData);
        if (success) {
            setServices(prev => prev.map(s => s.id === id ? { ...s, ...serviceData } : s));
        }
        return success;
    };

    const deleteService = async (id) => {
        const success = await firestoreService.deleteService(id);
        if (success) {
            setServices(prev => prev.filter(s => s.id !== id));
        }
        return success;
    };

    // ============================================
    // BARBERS / BARBEIROS
    // ============================================
    const addBarber = async (barberData) => {
        setEntityLoading('barbers', true);
        const id = await firestoreService.addBarber(barberData);
        if (id) {
            setBarbers(prev => [...prev, { id, ...barberData, active: true, rating: 0, totalServices: 0 }]);
        }
        setEntityLoading('barbers', false);
        return id;
    };

    const updateBarber = async (id, barberData) => {
        const success = await firestoreService.updateBarber(id, barberData);
        if (success) {
            setBarbers(prev => prev.map(b => b.id === id ? { ...b, ...barberData } : b));
        }
        return success;
    };

    const deleteBarber = async (id) => {
        const success = await firestoreService.deleteBarber(id);
        if (success) {
            setBarbers(prev => prev.filter(b => b.id !== id));
        }
        return success;
    };

    // ============================================
    // UNITS / UNIDADES
    // ============================================
    const addUnit = async (unitData) => {
        setEntityLoading('units', true);
        const id = await firestoreService.addUnit(unitData);
        if (id) {
            setUnits(prev => [...prev, { id, ...unitData, active: true }]);
        }
        setEntityLoading('units', false);
        return id;
    };

    const updateUnit = async (id, unitData) => {
        const success = await firestoreService.updateUnit(id, unitData);
        if (success) {
            setUnits(prev => prev.map(u => u.id === id ? { ...u, ...unitData } : u));
        }
        return success;
    };

    // ============================================
    // PLANS / PLANOS
    // ============================================
    const addPlan = async (planData) => {
        setEntityLoading('plans', true);
        const id = await firestoreService.addPlan(planData);
        if (id) {
            setPlans(prev => [...prev, { id, ...planData, subscribers: 0 }]);
        }
        setEntityLoading('plans', false);
        return id;
    };

    const updatePlan = async (id, planData) => {
        const success = await firestoreService.updatePlan(id, planData);
        if (success) {
            setPlans(prev => prev.map(p => p.id === id ? { ...p, ...planData } : p));
        }
        return success;
    };

    const deletePlan = async (id) => {
        const success = await firestoreService.deletePlan(id);
        if (success) {
            setPlans(prev => prev.filter(p => p.id !== id));
        }
        return success;
    };

    // ============================================
    // SEED DATABASE
    // ============================================
    const seedDatabase = async () => {
        const result = await firestoreService.seedDatabase();
        if (result.success) {
            await loadAllData();
        }
        return result;
    };

    // ============================================
    // CONTEXT VALUE
    // ============================================
    const value = {
        // Estado
        isAdminLoading,
        adminUser,
        currentPage,
        setCurrentPage,
        sidebarOpen,
        setSidebarOpen,
        loadingStates,

        // Dados
        metrics,
        appointments,
        clients,
        services,
        barbers,
        units,
        plans,
        settings,

        // Configurações
        saveSettings,

        // Agendamentos
        refreshAppointments,
        updateAppointmentStatus,

        // Clientes
        refreshClients,
        updateClient,
        addClientCashback,
        addClientReferralCredit,
        exportClients,

        // Serviços
        addService,
        updateService,
        deleteService,

        // Barbeiros
        addBarber,
        updateBarber,
        deleteBarber,

        // Unidades
        addUnit,
        updateUnit,

        // Planos
        addPlan,
        updatePlan,
        deletePlan,

        // Utilitários
        seedDatabase,
        refreshData: loadAllData,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
