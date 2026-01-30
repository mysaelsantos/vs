import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Dados simulados baseados no HTML original
const initialData = {
    // Informações do usuário
    userInfo: {
        name: 'MARCOS FELIPE',
        email: 'marcos@email.com',
        phone: '(11) 98765-4321',
        birthdate: '01/01/1990',
        profilePic: 'https://i.pravatar.cc/150?img=8',
        referralCode: 'MARCOS2024',
        referralCredits: 2,
        referralsMade: 5,
        redeemedGoals: [0, 1],
    },

    // Estado de autenticação
    isLoggedIn: false,

    // Assinatura do usuário
    userSubscription: {
        plan: 'Plano Mensal',
        status: 'Ativo',
        nextBillingDate: '15/02/2024',
        usedServices: 2,
        totalServices: 4,
        coveredServices: [1, 2],
        planId: 'mensal',
    },

    // Unidades
    units: [
        {
            id: 1,
            name: 'VS Barbearia - Centro',
            address: 'Rua Principal, 123 - Centro',
            image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
            mapsUrl: 'https://maps.google.com',
        },
        {
            id: 2,
            name: 'VS Barbearia - Shopping',
            address: 'Av. Shopping, 456 - Piso L1',
            image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
            mapsUrl: 'https://maps.google.com',
        },
        {
            id: 3,
            name: 'VS Barbearia - Jardins',
            address: 'Rua Jardim, 789 - Jardins',
            image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400',
            mapsUrl: 'https://maps.google.com',
        },
    ],

    // Barbeiros
    barbers: [
        {
            id: 1,
            name: 'Carlos Silva',
            role: 'Barbeiro Master',
            image: 'https://i.pravatar.cc/150?img=12',
            unitIds: [1, 2],
        },
        {
            id: 2,
            name: 'Pedro Santos',
            role: 'Barbeiro Profissional',
            image: 'https://i.pravatar.cc/150?img=33',
            unitIds: [1, 3],
        },
        {
            id: 3,
            name: 'Lucas Oliveira',
            role: 'Barbeiro Júnior',
            image: 'https://i.pravatar.cc/150?img=53',
            unitIds: [2, 3],
        },
        {
            id: 4,
            name: 'Roberto Costa',
            role: 'Barbeiro Master',
            image: 'https://i.pravatar.cc/150?img=15',
            unitIds: [1, 2, 3],
        },
    ],

    // Serviços
    services: [
        {
            id: 1,
            name: 'Corte de Cabelo',
            price: 45.00,
            promoPrice: 35.00,
            duration: '30 min',
            icon: 'fa-scissors',
        },
        {
            id: 2,
            name: 'Barba',
            price: 35.00,
            promoPrice: 25.00,
            duration: '20 min',
            icon: 'fa-face-grin-beam',
        },
        {
            id: 3,
            name: 'Corte + Barba',
            price: 70.00,
            promoPrice: 55.00,
            duration: '50 min',
            icon: 'fa-user-tie',
        },
        {
            id: 4,
            name: 'Degradê',
            price: 55.00,
            promoPrice: null,
            duration: '40 min',
            icon: 'fa-palette',
        },
        {
            id: 5,
            name: 'Pigmentação',
            price: 80.00,
            promoPrice: null,
            duration: '45 min',
            icon: 'fa-brush',
        },
        {
            id: 6,
            name: 'Sobrancelha',
            price: 20.00,
            promoPrice: 15.00,
            duration: '15 min',
            icon: 'fa-eye',
        },
    ],

    // Planos
    plans: [
        {
            id: 'mensal',
            title: 'Plano Mensal',
            price: 89.90,
            period: '/mês',
            popular: false,
            features: [
                '4 cortes por mês',
                'Agendamento prioritário',
                'Desconto em produtos',
                'Bebida grátis',
            ],
            coveredServices: [1, 2],
        },
        {
            id: 'trimestral',
            title: 'Plano Trimestral',
            price: 79.90,
            period: '/mês',
            popular: true,
            features: [
                '4 cortes por mês',
                'Agendamento prioritário',
                '20% off em produtos',
                'Bebida grátis',
                '1 barba grátis/mês',
            ],
            coveredServices: [1, 2, 3],
        },
        {
            id: 'anual',
            title: 'Plano Anual',
            price: 69.90,
            period: '/mês',
            popular: false,
            features: [
                '4 cortes por mês',
                'Agendamento VIP',
                '30% off em produtos',
                'Bebida premium grátis',
                '2 barbas grátis/mês',
                'Presente de aniversário',
            ],
            coveredServices: [1, 2, 3, 6],
        },
    ],

    // Horários disponíveis
    timeSlots: [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    ],

    // Metas de indicação
    referralGoals: [
        { count: 3, reward: '1 Corte Grátis', icon: 'fa-scissors' },
        { count: 5, reward: 'Barba Grátis', icon: 'fa-face-grin-beam' },
        { count: 10, reward: 'Corte + Barba Grátis', icon: 'fa-crown' },
        { count: 15, reward: 'Kit Premium VS', icon: 'fa-gift' },
    ],

    // Formas de pagamento
    paymentMethods: [
        {
            id: 1,
            type: 'credit',
            brand: 'Mastercard',
            last4: '4532',
            expiry: '12/26',
            isDefault: true,
        },
        {
            id: 2,
            type: 'pix',
            key: 'marcos@email.com',
            keyType: 'E-mail',
            isDefault: false,
        },
    ],

    // Configurações de notificações
    notifications: {
        appointments: true,
        promotions: true,
        reminders: true,
        news: false,
    },
};

// Agendamentos de exemplo
const sampleAppointments = [
    {
        id: 1,
        unitId: 1,
        barberId: 1,
        serviceId: 1,
        date: '2024-02-20',
        time: '10:00',
        status: 'confirmed',
        price: 45.00,
        usedInPlan: false,
        rating: null,
    },
    {
        id: 2,
        unitId: 2,
        barberId: 2,
        serviceId: 3,
        date: '2024-02-10',
        time: '14:30',
        status: 'completed',
        price: 70.00,
        usedInPlan: true,
        rating: 5,
    },
    {
        id: 3,
        unitId: 1,
        barberId: 4,
        serviceId: 2,
        date: '2024-01-25',
        time: '11:00',
        status: 'completed',
        price: 35.00,
        usedInPlan: true,
        rating: 4,
    },
    {
        id: 4,
        unitId: 3,
        barberId: 3,
        serviceId: 4,
        date: '2024-01-15',
        time: '16:00',
        status: 'cancelled',
        price: 55.00,
        usedInPlan: false,
        rating: null,
    },
];

// Histórico de pagamentos
const samplePaymentHistory = [
    {
        id: 1,
        description: 'Plano Mensal - Janeiro',
        amount: 89.90,
        date: '15/01/2024',
        status: 'paid',
        method: 'Mastercard •••• 4532',
    },
    {
        id: 2,
        description: 'Corte + Barba',
        amount: 70.00,
        date: '10/01/2024',
        status: 'paid',
        method: 'PIX',
    },
    {
        id: 3,
        description: 'Plano Mensal - Dezembro',
        amount: 89.90,
        date: '15/12/2023',
        status: 'paid',
        method: 'Mastercard •••• 4532',
    },
];

export function AppProvider({ children }) {
    const [data, setData] = useState(initialData);
    const [appointments, setAppointments] = useState(sampleAppointments);
    const [paymentHistory, setPaymentHistory] = useState(samplePaymentHistory);
    const [currentView, setCurrentView] = useState('agendar');
    const [activeModal, setActiveModal] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Simular carregamento inicial
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Atualizar dados do usuário
    const updateUserInfo = (updates) => {
        setData(prev => ({
            ...prev,
            userInfo: { ...prev.userInfo, ...updates },
        }));
    };

    // Atualizar assinatura
    const updateSubscription = (updates) => {
        setData(prev => ({
            ...prev,
            userSubscription: { ...prev.userSubscription, ...updates },
        }));
    };

    // Atualizar notificações
    const updateNotifications = (key, value) => {
        setData(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: value },
        }));
    };

    // Login
    const login = () => {
        setData(prev => ({ ...prev, isLoggedIn: true }));
    };

    // Logout
    const logout = () => {
        setData(prev => ({ ...prev, isLoggedIn: false }));
    };

    // Adicionar agendamento
    const addAppointment = (appointment) => {
        const newAppointment = {
            ...appointment,
            id: appointments.length + 1,
            status: 'confirmed',
            rating: null,
        };
        setAppointments(prev => [newAppointment, ...prev]);
        return newAppointment;
    };

    // Atualizar agendamento
    const updateAppointment = (id, updates) => {
        setAppointments(prev =>
            prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
        );
    };

    // Cancelar agendamento
    const cancelAppointment = (id) => {
        updateAppointment(id, { status: 'cancelled' });
    };

    // Avaliar agendamento
    const rateAppointment = (id, rating) => {
        updateAppointment(id, { rating });
    };

    // Abrir modal
    const openModal = (modalName, data = null) => {
        setActiveModal(modalName);
        setModalData(data);
    };

    // Fechar modal
    const closeModal = () => {
        setActiveModal(null);
        setModalData(null);
    };

    // Adicionar forma de pagamento
    const addPaymentMethod = (method) => {
        setData(prev => ({
            ...prev,
            paymentMethods: [...prev.paymentMethods, { ...method, id: prev.paymentMethods.length + 1 }],
        }));
    };

    // Remover forma de pagamento
    const removePaymentMethod = (id) => {
        setData(prev => ({
            ...prev,
            paymentMethods: prev.paymentMethods.filter(m => m.id !== id),
        }));
    };

    // Definir forma de pagamento padrão
    const setDefaultPaymentMethod = (id) => {
        setData(prev => ({
            ...prev,
            paymentMethods: prev.paymentMethods.map(m => ({
                ...m,
                isDefault: m.id === id,
            })),
        }));
    };

    // Adicionar crédito de indicação
    const addReferralCredit = () => {
        setData(prev => ({
            ...prev,
            userInfo: {
                ...prev.userInfo,
                referralCredits: prev.userInfo.referralCredits + 1,
                referralsMade: prev.userInfo.referralsMade + 1,
            },
        }));
    };

    // Usar crédito de indicação
    const useReferralCredit = () => {
        if (data.userInfo.referralCredits > 0) {
            setData(prev => ({
                ...prev,
                userInfo: {
                    ...prev.userInfo,
                    referralCredits: prev.userInfo.referralCredits - 1,
                },
            }));
            return true;
        }
        return false;
    };

    // Resgatar meta de indicação
    const redeemReferralGoal = (goalIndex) => {
        if (!data.userInfo.redeemedGoals.includes(goalIndex)) {
            setData(prev => ({
                ...prev,
                userInfo: {
                    ...prev.userInfo,
                    redeemedGoals: [...prev.userInfo.redeemedGoals, goalIndex],
                },
            }));
        }
    };

    // Helpers
    const getUnitById = (id) => data.units.find(u => u.id === id);
    const getBarberById = (id) => data.barbers.find(b => b.id === id);
    const getServiceById = (id) => data.services.find(s => s.id === id);
    const getPlanById = (id) => data.plans.find(p => p.id === id);
    const getBarbersByUnit = (unitId) => data.barbers.filter(b => b.unitIds.includes(unitId));

    const value = {
        ...data,
        appointments,
        paymentHistory,
        currentView,
        setCurrentView,
        activeModal,
        modalData,
        isLoading,
        setIsLoading,

        // Actions
        updateUserInfo,
        updateSubscription,
        updateNotifications,
        login,
        logout,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        rateAppointment,
        openModal,
        closeModal,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        addReferralCredit,
        useReferralCredit,
        redeemReferralGoal,

        // Helpers
        getUnitById,
        getBarberById,
        getServiceById,
        getPlanById,
        getBarbersByUnit,
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
