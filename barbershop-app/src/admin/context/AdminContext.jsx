import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
    const [isAdminLoading, setIsAdminLoading] = useState(true);
    const [adminUser, setAdminUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Métricas do dashboard
    const [metrics, setMetrics] = useState({
        todayAppointments: 12,
        weeklyRevenue: 2850.00,
        activeClients: 156,
        pendingAppointments: 3,
        monthlyGrowth: 15.5,
        planSubscribers: 47,
    });

    // Dados simulados
    const [appointments, setAppointments] = useState([
        { id: 1, clientName: 'João Silva', clientPhone: '(11) 99999-1111', barberId: 1, barberName: 'Carlos Miguel', serviceId: 1, serviceName: 'Corte Degradê', date: '2024-01-15', time: '09:00', status: 'confirmed', unitId: 1, unitName: 'VS Barbearia - Centro', price: 45.00 },
        { id: 2, clientName: 'Pedro Santos', clientPhone: '(11) 99999-2222', barberId: 2, barberName: 'Ricardo Alves', serviceId: 2, serviceName: 'Barba', date: '2024-01-15', time: '10:00', status: 'confirmed', unitId: 1, unitName: 'VS Barbearia - Centro', price: 35.00 },
        { id: 3, clientName: 'Lucas Oliveira', clientPhone: '(11) 99999-3333', barberId: 1, barberName: 'Carlos Miguel', serviceId: 3, serviceName: 'Corte + Barba', date: '2024-01-15', time: '11:00', status: 'pending', unitId: 2, unitName: 'VS Barbearia - Zona Sul', price: 70.00 },
        { id: 4, clientName: 'André Costa', clientPhone: '(11) 99999-4444', barberId: 3, barberName: 'Fernando Lima', serviceId: 1, serviceName: 'Corte Degradê', date: '2024-01-15', time: '14:00', status: 'completed', unitId: 1, unitName: 'VS Barbearia - Centro', price: 45.00 },
        { id: 5, clientName: 'Gabriel Martins', clientPhone: '(11) 99999-5555', barberId: 2, barberName: 'Ricardo Alves', serviceId: 4, serviceName: 'Sobrancelha', date: '2024-01-16', time: '09:30', status: 'confirmed', unitId: 2, unitName: 'VS Barbearia - Zona Sul', price: 20.00 },
    ]);

    const [clients, setClients] = useState([
        { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-1111', birthdate: '15/03/1990', totalAppointments: 12, planId: 1, planName: 'Plano Ouro', referralCode: 'JOAO123', referralCredits: 2, createdAt: '2023-06-15' },
        { id: 2, name: 'Pedro Santos', email: 'pedro@email.com', phone: '(11) 99999-2222', birthdate: '22/07/1988', totalAppointments: 8, planId: null, planName: null, referralCode: 'PEDRO456', referralCredits: 0, createdAt: '2023-08-20' },
        { id: 3, name: 'Lucas Oliveira', email: 'lucas@email.com', phone: '(11) 99999-3333', birthdate: '10/12/1995', totalAppointments: 25, planId: 2, planName: 'Plano Diamante', referralCode: 'LUCAS789', referralCredits: 5, createdAt: '2023-03-10' },
        { id: 4, name: 'André Costa', email: 'andre@email.com', phone: '(11) 99999-4444', birthdate: '05/09/1992', totalAppointments: 3, planId: null, planName: null, referralCode: 'ANDRE321', referralCredits: 1, createdAt: '2024-01-02' },
    ]);

    const [services, setServices] = useState([
        { id: 1, name: 'Corte Degradê', price: 45.00, promoPrice: null, duration: '45 min', icon: 'fa-scissors', active: true },
        { id: 2, name: 'Barba', price: 35.00, promoPrice: null, duration: '30 min', icon: 'fa-face-grin-beam', active: true },
        { id: 3, name: 'Corte + Barba', price: 70.00, promoPrice: 65.00, duration: '60 min', icon: 'fa-wand-magic-sparkles', active: true },
        { id: 4, name: 'Sobrancelha', price: 20.00, promoPrice: null, duration: '15 min', icon: 'fa-eye', active: true },
        { id: 5, name: 'Pigmentação', price: 80.00, promoPrice: null, duration: '45 min', icon: 'fa-paintbrush', active: true },
        { id: 6, name: 'Selagem', price: 120.00, promoPrice: 99.00, duration: '90 min', icon: 'fa-wind', active: true },
    ]);

    const [barbers, setBarbers] = useState([
        { id: 1, name: 'Carlos Miguel', role: 'Barbeiro Senior', image: 'https://i.pravatar.cc/150?img=11', unitId: 1, unitName: 'VS Barbearia - Centro', active: true, rating: 4.9, totalServices: 320 },
        { id: 2, name: 'Ricardo Alves', role: 'Barbeiro', image: 'https://i.pravatar.cc/150?img=12', unitId: 1, unitName: 'VS Barbearia - Centro', active: true, rating: 4.7, totalServices: 185 },
        { id: 3, name: 'Fernando Lima', role: 'Barbeiro Senior', image: 'https://i.pravatar.cc/150?img=14', unitId: 2, unitName: 'VS Barbearia - Zona Sul', active: true, rating: 4.8, totalServices: 290 },
        { id: 4, name: 'Bruno Costa', role: 'Barbeiro', image: 'https://i.pravatar.cc/150?img=15', unitId: 2, unitName: 'VS Barbearia - Zona Sul', active: true, rating: 4.6, totalServices: 120 },
    ]);

    const [units, setUnits] = useState([
        { id: 1, name: 'VS Barbearia - Centro', address: 'Rua das Flores, 123 - Centro', phone: '(11) 3333-1111', active: true },
        { id: 2, name: 'VS Barbearia - Zona Sul', address: 'Av. Paulista, 456 - Bela Vista', phone: '(11) 3333-2222', active: true },
    ]);

    const [plans, setPlans] = useState([
        { id: 1, title: 'Plano Ouro', price: 89.90, period: '/mês', subscribers: 32, coveredServices: [1], features: ['4 cortes por mês', 'Agendamento prioritário', 'Desconto em produtos'] },
        { id: 2, title: 'Plano Diamante', price: 139.90, period: '/mês', subscribers: 15, coveredServices: [1, 2], features: ['4 cortes por mês', 'Barba ilimitada', 'Agendamento VIP', 'Bebida grátis', 'Desconto de 20% em produtos'] },
    ]);

    useEffect(() => {
        // Simular loading
        setTimeout(() => {
            setAdminUser({ name: 'Admin', email: 'admin@vsbarbearia.com' });
            setIsAdminLoading(false);
        }, 1000);
    }, []);

    // Ações CRUD
    const updateAppointmentStatus = (id, status) => {
        setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status } : apt));
    };

    const addService = (service) => {
        setServices(prev => [...prev, { ...service, id: Date.now() }]);
    };

    const updateService = (id, data) => {
        setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const deleteService = (id) => {
        setServices(prev => prev.filter(s => s.id !== id));
    };

    const addBarber = (barber) => {
        setBarbers(prev => [...prev, { ...barber, id: Date.now() }]);
    };

    const updateBarber = (id, data) => {
        setBarbers(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    };

    const deleteBarber = (id) => {
        setBarbers(prev => prev.filter(b => b.id !== id));
    };

    const addUnit = (unit) => {
        setUnits(prev => [...prev, { ...unit, id: Date.now() }]);
    };

    const updateUnit = (id, data) => {
        setUnits(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    };

    const addPlan = (plan) => {
        setPlans(prev => [...prev, { ...plan, id: Date.now(), subscribers: 0 }]);
    };

    const updatePlan = (id, data) => {
        setPlans(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    };

    const deletePlan = (id) => {
        setPlans(prev => prev.filter(p => p.id !== id));
    };

    const value = {
        isAdminLoading,
        adminUser,
        currentPage,
        setCurrentPage,
        sidebarOpen,
        setSidebarOpen,
        metrics,
        appointments,
        clients,
        services,
        barbers,
        units,
        plans,
        updateAppointmentStatus,
        addService,
        updateService,
        deleteService,
        addBarber,
        updateBarber,
        deleteBarber,
        addUnit,
        updateUnit,
        addPlan,
        updatePlan,
        deletePlan,
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
