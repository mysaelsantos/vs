import { db } from './firebase';
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
    limit,
    serverTimestamp,
    writeBatch,
    Timestamp
} from 'firebase/firestore';

// ============================================
// COLLECTIONS REFERENCES
// ============================================
const COLLECTIONS = {
    USERS: 'users',
    APPOINTMENTS: 'appointments',
    SERVICES: 'services',
    BARBERS: 'barbers',
    COLLABORATORS: 'collaborators',
    SCHEDULE_BLOCKS: 'scheduleBlocks',
    UNITS: 'units',
    PLANS: 'plans',
    SETTINGS: 'settings',
    ADMIN: 'admin'
};

// ============================================
// SETTINGS / CONFIGURAÇÕES
// ============================================
export const getSettings = async () => {
    try {
        const docRef = doc(db, COLLECTIONS.SETTINGS, 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        // Retorna configurações padrão se não existir
        return getDefaultSettings();
    } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        return getDefaultSettings();
    }
};

export const updateSettings = async (settings) => {
    try {
        const docRef = doc(db, COLLECTIONS.SETTINGS, 'general');
        await updateDoc(docRef, {
            ...settings,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
        return false;
    }
};

const getDefaultSettings = () => ({
    businessName: 'VS Barbearia',
    cnpj: '00.000.000/0001-00',
    email: 'contato@vsbarbearia.com',
    whatsapp: '(11) 99999-9999',
    workingHours: {
        segunda: { open: '09:00', close: '20:00', closed: false },
        terca: { open: '09:00', close: '20:00', closed: false },
        quarta: { open: '09:00', close: '20:00', closed: false },
        quinta: { open: '09:00', close: '20:00', closed: false },
        sexta: { open: '09:00', close: '20:00', closed: false },
        sabado: { open: '09:00', close: '18:00', closed: false },
        domingo: { open: '09:00', close: '18:00', closed: true },
    },
    // REGRAS DE AGENDAMENTO
    appointmentRules: {
        minAdvanceHours: 2,              // Antecedência mínima para agendar (horas)
        maxAdvanceDays: 30,              // Antecedência máxima para agendar (dias)
        cancelMinHours: 2,               // Antecedência mínima para cancelar (horas)
        rescheduleMinHours: 4,           // Antecedência mínima para remarcar (horas)
        maxAppointmentsPerDay: 2,        // Máximo de agendamentos por cliente por dia
        maxCancellationsPerMonth: 3,     // Máximo de cancelamentos por mês
        noShowPenaltyDays: 7,            // Dias de bloqueio por não comparecimento
        slotDuration: 30,                // Duração padrão do slot (minutos)
        breakBetweenSlots: 0,            // Intervalo entre slots (minutos)
    },
    // REGRAS DE CASHBACK
    cashbackRules: {
        enabled: true,
        percentage: 5,                    // Porcentagem de cashback
        minPurchase: 50,                  // Valor mínimo para gerar cashback
        maxCashback: 50,                  // Cashback máximo por compra
        expirationDays: 90,               // Dias para expirar o cashback
    },
    // REGRAS DE INDICAÇÃO
    referralRules: {
        enabled: true,
        creditValue: 1,                   // Créditos por indicação
        referrerReward: 'Corte Grátis',   // Recompensa para quem indica
        referredDiscount: 20,             // Desconto para o indicado (%)
    },
    notifications: {
        newAppointment: true,
        cancellations: true,
        newSubscriptions: true,
        dailyReport: true,
    }
});

// ============================================
// USERS / CLIENTES
// ============================================
export const getUsers = async () => {
    try {
        const querySnapshot = await getDocs(
            query(collection(db, COLLECTIONS.USERS), orderBy('createdAt', 'desc'))
        );
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
    }
};

export const getUserById = async (userId) => {
    try {
        const docRef = doc(db, COLLECTIONS.USERS, userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return null;
    }
};

export const addUser = async (userData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
            ...userData,
            cashback: 0,
            referralCredits: 0,
            totalAppointments: 0,
            cancellations: 0,
            noShows: 0,
            blockedUntil: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return null;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const docRef = doc(db, COLLECTIONS.USERS, userId);
        await updateDoc(docRef, {
            ...userData,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        return false;
    }
};

export const addCashback = async (userId, amount) => {
    try {
        const user = await getUserById(userId);
        if (user) {
            const newCashback = (user.cashback || 0) + amount;
            await updateUser(userId, { cashback: newCashback });
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao adicionar cashback:', error);
        return false;
    }
};

export const addReferralCredit = async (userId) => {
    try {
        const user = await getUserById(userId);
        if (user) {
            const newCredits = (user.referralCredits || 0) + 1;
            await updateUser(userId, { referralCredits: newCredits });
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao adicionar crédito de indicação:', error);
        return false;
    }
};

// ============================================
// APPOINTMENTS / AGENDAMENTOS
// ============================================
export const getAppointments = async (filters = {}) => {
    try {
        let q = collection(db, COLLECTIONS.APPOINTMENTS);
        const constraints = [];

        if (filters.status) {
            constraints.push(where('status', '==', filters.status));
        }
        if (filters.date) {
            constraints.push(where('date', '==', filters.date));
        }
        if (filters.barberId) {
            constraints.push(where('barberId', '==', filters.barberId));
        }
        if (filters.unitId) {
            constraints.push(where('unitId', '==', filters.unitId));
        }

        constraints.push(orderBy('date', 'desc'));

        if (filters.limit) {
            constraints.push(limit(filters.limit));
        }

        q = query(q, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return [];
    }
};

export const addAppointment = async (appointmentData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), {
            ...appointmentData,
            status: 'confirmed',
            rating: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        return null;
    }
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        const docRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
        await updateDoc(docRef, {
            status,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Erro ao atualizar status do agendamento:', error);
        return false;
    }
};

export const rateAppointment = async (appointmentId, rating, comment = '') => {
    try {
        const docRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
        await updateDoc(docRef, {
            rating,
            ratingComment: comment,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Erro ao avaliar agendamento:', error);
        return false;
    }
};

// ============================================
// SERVICES / SERVIÇOS
// ============================================
export const getServices = async () => {
    try {
        const querySnapshot = await getDocs(
            query(collection(db, COLLECTIONS.SERVICES), orderBy('name'))
        );
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        return [];
    }
};

export const addService = async (serviceData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.SERVICES), {
            ...serviceData,
            active: true,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao criar serviço:', error);
        return null;
    }
};

export const updateService = async (serviceId, serviceData) => {
    try {
        const docRef = doc(db, COLLECTIONS.SERVICES, serviceId);
        await updateDoc(docRef, {
            ...serviceData,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Erro ao atualizar serviço:', error);
        return false;
    }
};

export const deleteService = async (serviceId) => {
    try {
        const docRef = doc(db, COLLECTIONS.SERVICES, serviceId);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        return false;
    }
};

// ============================================
// BARBERS / BARBEIROS
// ============================================
export const getBarbers = async () => {
    try {
        const querySnapshot = await getDocs(
            query(collection(db, COLLECTIONS.BARBERS), orderBy('name'))
        );
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erro ao buscar barbeiros:', error);
        return [];
    }
};

export const addBarber = async (barberData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.BARBERS), {
            ...barberData,
            active: true,
            rating: 0,
            totalServices: 0,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao criar barbeiro:', error);
        return null;
    }
};

export const updateBarber = async (barberId, barberData) => {
    try {
        const docRef = doc(db, COLLECTIONS.BARBERS, barberId);
        await updateDoc(docRef, {
            ...barberData,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Erro ao atualizar barbeiro:', error);
        return false;
    }
};

export const deleteBarber = async (barberId) => {
    try {
        const docRef = doc(db, COLLECTIONS.BARBERS, barberId);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Erro ao excluir barbeiro:', error);
        return false;
    }
};

// ============================================
// UNITS / UNIDADES
// ============================================
export const getUnits = async () => {
    try {
        const querySnapshot = await getDocs(
            query(collection(db, COLLECTIONS.UNITS), orderBy('name'))
        );
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erro ao buscar unidades:', error);
        return [];
    }
};

export const addUnit = async (unitData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.UNITS), {
            ...unitData,
            active: true,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao criar unidade:', error);
        return null;
    }
};

export const updateUnit = async (unitId, unitData) => {
    try {
        const docRef = doc(db, COLLECTIONS.UNITS, unitId);
        await updateDoc(docRef, {
            ...unitData,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Erro ao atualizar unidade:', error);
        return false;
    }
};

// ============================================
// PLANS / PLANOS
// ============================================
export const getPlans = async () => {
    try {
        const querySnapshot = await getDocs(
            query(collection(db, COLLECTIONS.PLANS), orderBy('price'))
        );
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erro ao buscar planos:', error);
        return [];
    }
};

export const addPlan = async (planData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.PLANS), {
            ...planData,
            subscribers: 0,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao criar plano:', error);
        return null;
    }
};

export const updatePlan = async (planId, planData) => {
    try {
        const docRef = doc(db, COLLECTIONS.PLANS, planId);
        await updateDoc(docRef, {
            ...planData,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Erro ao atualizar plano:', error);
        return false;
    }
};

export const deletePlan = async (planId) => {
    try {
        const docRef = doc(db, COLLECTIONS.PLANS, planId);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Erro ao excluir plano:', error);
        return false;
    }
};

// ============================================
// METRICS / MÉTRICAS
// ============================================
export const getMetrics = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        // Agendamentos de hoje
        const todayAppointments = await getDocs(
            query(
                collection(db, COLLECTIONS.APPOINTMENTS),
                where('date', '==', todayStr)
            )
        );

        // Todos os agendamentos para calcular receita
        const allAppointments = await getAppointments({ limit: 100 });

        // Clientes
        const clients = await getUsers();

        // Calcular métricas
        const weeklyRevenue = allAppointments
            .filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate >= startOfWeek && apt.status === 'completed';
            })
            .reduce((sum, apt) => sum + (apt.price || 0), 0);

        const planSubscribers = clients.filter(c => c.planId).length;
        const pendingAppointments = allAppointments.filter(apt => apt.status === 'pending').length;

        return {
            todayAppointments: todayAppointments.size,
            weeklyRevenue,
            activeClients: clients.length,
            pendingAppointments,
            planSubscribers,
            monthlyGrowth: 0 // Calcular baseado em dados históricos
        };
    } catch (error) {
        console.error('Erro ao buscar métricas:', error);
        return {
            todayAppointments: 0,
            weeklyRevenue: 0,
            activeClients: 0,
            pendingAppointments: 0,
            planSubscribers: 0,
            monthlyGrowth: 0
        };
    }
};

// ============================================
// SEED DATABASE
// ============================================
export const seedDatabase = async () => {
    try {
        const batch = writeBatch(db);

        // Verificar se já existe dados
        const existingServices = await getServices();
        if (existingServices.length > 0) {
            console.log('Banco de dados já possui dados. Seed cancelado.');
            return { success: false, message: 'Banco já possui dados' };
        }

        // Criar configurações padrão
        const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'general');
        batch.set(settingsRef, {
            ...getDefaultSettings(),
            createdAt: serverTimestamp()
        });

        // Serviços iniciais
        const services = [
            { name: 'Corte Degradê', price: 45, promoPrice: null, duration: '45 min', icon: 'fa-scissors', active: true },
            { name: 'Barba', price: 35, promoPrice: null, duration: '30 min', icon: 'fa-face-grin-beam', active: true },
            { name: 'Corte + Barba', price: 70, promoPrice: 65, duration: '60 min', icon: 'fa-wand-magic-sparkles', active: true },
            { name: 'Sobrancelha', price: 20, promoPrice: null, duration: '15 min', icon: 'fa-eye', active: true },
            { name: 'Pigmentação', price: 80, promoPrice: null, duration: '45 min', icon: 'fa-paintbrush', active: true },
            { name: 'Selagem', price: 120, promoPrice: 99, duration: '90 min', icon: 'fa-wind', active: true },
        ];

        for (const service of services) {
            const serviceRef = doc(collection(db, COLLECTIONS.SERVICES));
            batch.set(serviceRef, { ...service, createdAt: serverTimestamp() });
        }

        // Unidades iniciais
        const units = [
            { name: 'VS Barbearia - Centro', address: 'Rua das Flores, 123 - Centro', phone: '(11) 3333-1111', active: true },
            { name: 'VS Barbearia - Zona Sul', address: 'Av. Paulista, 456 - Bela Vista', phone: '(11) 3333-2222', active: true },
        ];

        for (const unit of units) {
            const unitRef = doc(collection(db, COLLECTIONS.UNITS));
            batch.set(unitRef, { ...unit, createdAt: serverTimestamp() });
        }

        // Planos iniciais
        const plans = [
            {
                title: 'Plano Ouro',
                price: 89.90,
                period: '/mês',
                popular: false,
                features: ['4 cortes por mês', 'Agendamento prioritário', 'Desconto em produtos', 'Bebida grátis'],
                coveredServices: [], // Será preenchido com IDs reais
                subscribers: 0
            },
            {
                title: 'Plano Diamante',
                price: 139.90,
                period: '/mês',
                popular: true,
                features: ['4 cortes por mês', 'Barba ilimitada', 'Agendamento VIP', 'Bebida grátis', 'Desconto de 20% em produtos'],
                coveredServices: [],
                subscribers: 0
            },
        ];

        for (const plan of plans) {
            const planRef = doc(collection(db, COLLECTIONS.PLANS));
            batch.set(planRef, { ...plan, createdAt: serverTimestamp() });
        }

        // Colaboradores iniciais (barbeiros)
        const collaborators = [
            {
                name: 'Carlos Silva',
                email: 'carlos@vsbarbearia.com',
                phone: '(11) 99999-1111',
                password: '123456', // Senha de teste
                role: 'barber',
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
                active: true,
                workSchedule: {
                    segunda: { start: '09:00', end: '18:00', dayOff: false },
                    terca: { start: '09:00', end: '18:00', dayOff: false },
                    quarta: { start: '09:00', end: '18:00', dayOff: false },
                    quinta: { start: '09:00', end: '18:00', dayOff: false },
                    sexta: { start: '09:00', end: '18:00', dayOff: false },
                    sabado: { start: '09:00', end: '14:00', dayOff: false },
                    domingo: { start: '09:00', end: '14:00', dayOff: true },
                },
                commissions: {
                    default: 50,
                    byService: {}
                },
                rating: 4.8,
                totalServices: 150,
                monthlyEarnings: 0,
            },
            {
                name: 'Ricardo Santos',
                email: 'ricardo@vsbarbearia.com',
                phone: '(11) 99999-2222',
                password: '123456',
                role: 'barber',
                image: 'https://randomuser.me/api/portraits/men/45.jpg',
                active: true,
                workSchedule: {
                    segunda: { start: '10:00', end: '19:00', dayOff: false },
                    terca: { start: '10:00', end: '19:00', dayOff: false },
                    quarta: { start: '10:00', end: '19:00', dayOff: false },
                    quinta: { start: '10:00', end: '19:00', dayOff: false },
                    sexta: { start: '10:00', end: '19:00', dayOff: false },
                    sabado: { start: '09:00', end: '15:00', dayOff: false },
                    domingo: { start: '09:00', end: '15:00', dayOff: true },
                },
                commissions: {
                    default: 45,
                    byService: {}
                },
                rating: 4.6,
                totalServices: 98,
                monthlyEarnings: 0,
            },
            {
                name: 'Fernando Lima',
                email: 'fernando@vsbarbearia.com',
                phone: '(11) 99999-3333',
                password: '123456',
                role: 'barber',
                image: 'https://randomuser.me/api/portraits/men/67.jpg',
                active: true,
                workSchedule: {
                    segunda: { start: '08:00', end: '17:00', dayOff: false },
                    terca: { start: '08:00', end: '17:00', dayOff: false },
                    quarta: { start: '08:00', end: '17:00', dayOff: true },
                    quinta: { start: '08:00', end: '17:00', dayOff: false },
                    sexta: { start: '08:00', end: '17:00', dayOff: false },
                    sabado: { start: '08:00', end: '12:00', dayOff: false },
                    domingo: { start: '08:00', end: '12:00', dayOff: true },
                },
                commissions: {
                    default: 55,
                    byService: {}
                },
                rating: 4.9,
                totalServices: 220,
                monthlyEarnings: 0,
            },
        ];

        for (const collaborator of collaborators) {
            const collabRef = doc(collection(db, COLLECTIONS.COLLABORATORS));
            batch.set(collabRef, { ...collaborator, createdAt: serverTimestamp() });
        }

        await batch.commit();

        console.log('Seed do banco de dados concluído com sucesso!');
        return { success: true, message: 'Dados iniciais criados com sucesso!' };
    } catch (error) {
        console.error('Erro ao popular banco de dados:', error);
        return { success: false, message: error.message };
    }
};

// ============================================
// EXPORT CSV
// ============================================
export const exportClientsToCSV = (clients) => {
    const headers = ['Nome', 'Email', 'Telefone', 'Nascimento', 'Plano', 'Cashback', 'Créditos', 'Atendimentos', 'Cliente Desde'];

    const rows = clients.map(client => [
        client.name || '',
        client.email || '',
        client.phone || '',
        client.birthdate || '',
        client.planName || 'Nenhum',
        client.cashback || 0,
        client.referralCredits || 0,
        client.totalAppointments || 0,
        client.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || ''
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
