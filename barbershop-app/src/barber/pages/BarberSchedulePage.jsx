import React, { useState, useMemo } from 'react';
import { useBarber } from '../context/BarberContext';

function BarberSchedulePage() {
    const { appointments, barber, startService, completeService, updateAppointmentStatus, refreshData } = useBarber();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(null);

    // Formatar data para exibição
    const formatDate = (date) => {
        return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    // Navegação de datas
    const goToDate = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    };

    // Filtrar agendamentos do dia selecionado
    const todayAppointments = useMemo(() => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        return appointments
            .filter(apt => apt.date === dateStr)
            .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    }, [appointments, selectedDate]);

    // Estatísticas do dia
    const stats = useMemo(() => {
        const confirmed = todayAppointments.filter(a => a.status === 'confirmed').length;
        const pending = todayAppointments.filter(a => a.status === 'pending').length;
        const completed = todayAppointments.filter(a => a.status === 'completed').length;
        const inProgress = todayAppointments.filter(a => a.status === 'in_progress').length;
        const revenue = todayAppointments
            .filter(a => a.status === 'completed')
            .reduce((sum, a) => sum + (a.price || 0), 0);
        return { total: todayAppointments.length, confirmed, pending, completed, inProgress, revenue };
    }, [todayAppointments]);

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'badge-warning', text: 'Pendente', icon: 'fa-clock' },
            confirmed: { class: 'badge-info', text: 'Confirmado', icon: 'fa-check' },
            in_progress: { class: 'badge-primary', text: 'Em Atendimento', icon: 'fa-spinner fa-spin' },
            completed: { class: 'badge-success', text: 'Concluído', icon: 'fa-check-double' },
            cancelled: { class: 'badge-danger', text: 'Cancelado', icon: 'fa-times' },
            no_show: { class: 'badge-gray', text: 'Não Compareceu', icon: 'fa-user-slash' },
        };
        return badges[status] || badges.pending;
    };

    const handleAction = async (appointment, action) => {
        setLoading(appointment.id);
        try {
            switch (action) {
                case 'start':
                    await startService(appointment.id);
                    break;
                case 'complete':
                    await completeService(appointment.id);
                    break;
                case 'confirm':
                    await updateAppointmentStatus(appointment.id, 'confirmed');
                    break;
                case 'no_show':
                    await updateAppointmentStatus(appointment.id, 'no_show');
                    break;
            }
        } catch (error) {
            console.error('Erro na ação:', error);
        } finally {
            setLoading(null);
        }
    };

    const isToday = selectedDate.toDateString() === new Date().toDateString();

    return (
        <div className="admin-page">
            {/* Header com navegação de data */}
            <div className="admin-card p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            className="w-10 h-10 rounded-lg bg-bg-alt flex items-center justify-center hover:bg-primary/20"
                            onClick={() => goToDate(-1)}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>

                        <div className="text-center">
                            <h2 className="text-lg font-bold capitalize">{formatDate(selectedDate)}</h2>
                            {isToday && <span className="text-xs text-primary">Hoje</span>}
                        </div>

                        <button
                            className="w-10 h-10 rounded-lg bg-bg-alt flex items-center justify-center hover:bg-primary/20"
                            onClick={() => goToDate(1)}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>

                        {!isToday && (
                            <button
                                className="btn-outline px-3 py-2 text-sm"
                                onClick={() => setSelectedDate(new Date())}
                            >
                                <i className="fas fa-calendar-day mr-1"></i>
                                Hoje
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="badge badge-info">{stats.confirmed} confirmados</span>
                            <span className="badge badge-warning">{stats.pending} pendentes</span>
                            <span className="badge badge-success">{stats.completed} concluídos</span>
                        </div>
                        <button
                            className="btn-outline px-3 py-2"
                            onClick={refreshData}
                        >
                            <i className="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="admin-card p-4 text-center">
                    <i className="fas fa-calendar-check text-2xl text-primary mb-2"></i>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-secondary">Agendamentos</p>
                </div>
                <div className="admin-card p-4 text-center">
                    <i className="fas fa-user-check text-2xl text-green-500 mb-2"></i>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                    <p className="text-xs text-secondary">Concluídos</p>
                </div>
                <div className="admin-card p-4 text-center">
                    <i className="fas fa-spinner text-2xl text-blue-500 mb-2"></i>
                    <p className="text-2xl font-bold">{stats.inProgress}</p>
                    <p className="text-xs text-secondary">Em Atendimento</p>
                </div>
                <div className="admin-card p-4 text-center">
                    <i className="fas fa-coins text-2xl text-yellow-500 mb-2"></i>
                    <p className="text-2xl font-bold">R$ {stats.revenue.toFixed(2)}</p>
                    <p className="text-xs text-secondary">Faturado</p>
                </div>
            </div>

            {/* Lista de agendamentos */}
            <div className="space-y-4">
                {todayAppointments.length === 0 ? (
                    <div className="admin-card p-12 text-center">
                        <i className="fas fa-calendar-times text-5xl text-secondary/30 mb-4"></i>
                        <h3 className="text-lg font-semibold mb-2">Nenhum agendamento</h3>
                        <p className="text-secondary text-sm">Você não tem agendamentos para este dia.</p>
                    </div>
                ) : (
                    todayAppointments.map((apt) => {
                        const statusBadge = getStatusBadge(apt.status);
                        const isActive = loading === apt.id;

                        return (
                            <div
                                key={apt.id}
                                className={`admin-card p-4 border-l-4 ${apt.status === 'in_progress' ? 'border-l-primary animate-pulse' :
                                        apt.status === 'completed' ? 'border-l-green-500' :
                                            apt.status === 'cancelled' ? 'border-l-red-500' :
                                                'border-l-transparent'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Horário e Info */}
                                    <div className="flex items-start gap-4">
                                        <div className="text-center min-w-[60px]">
                                            <p className="text-2xl font-bold text-primary">{apt.time || '--:--'}</p>
                                            <p className="text-xs text-secondary">{apt.duration || '30min'}</p>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold">{apt.clientName || 'Cliente'}</h3>
                                                <span className={`badge ${statusBadge.class}`}>
                                                    <i className={`fas ${statusBadge.icon} mr-1`}></i>
                                                    {statusBadge.text}
                                                </span>
                                            </div>
                                            <p className="text-sm text-secondary mb-1">
                                                <i className="fas fa-cut mr-2"></i>
                                                {apt.serviceName || 'Serviço'}
                                            </p>
                                            {apt.clientPhone && (
                                                <p className="text-xs text-secondary">
                                                    <i className="fas fa-phone mr-2"></i>
                                                    {apt.clientPhone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preço e Ações */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-primary">
                                                R$ {(apt.price || 0).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Botões de ação */}
                                        <div className="flex items-center gap-2">
                                            {apt.status === 'pending' && (
                                                <button
                                                    className="btn-outline px-3 py-2 text-sm"
                                                    onClick={() => handleAction(apt, 'confirm')}
                                                    disabled={isActive}
                                                >
                                                    {isActive ? <i className="fas fa-spinner fa-spin"></i> : (
                                                        <><i className="fas fa-check mr-1"></i> Confirmar</>
                                                    )}
                                                </button>
                                            )}

                                            {apt.status === 'confirmed' && (
                                                <button
                                                    className="btn-primary px-3 py-2 text-sm"
                                                    onClick={() => handleAction(apt, 'start')}
                                                    disabled={isActive}
                                                >
                                                    {isActive ? <i className="fas fa-spinner fa-spin"></i> : (
                                                        <><i className="fas fa-play mr-1"></i> Iniciar</>
                                                    )}
                                                </button>
                                            )}

                                            {apt.status === 'in_progress' && (
                                                <button
                                                    className="btn-primary px-3 py-2 text-sm bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleAction(apt, 'complete')}
                                                    disabled={isActive}
                                                >
                                                    {isActive ? <i className="fas fa-spinner fa-spin"></i> : (
                                                        <><i className="fas fa-check-double mr-1"></i> Finalizar</>
                                                    )}
                                                </button>
                                            )}

                                            {['pending', 'confirmed'].includes(apt.status) && (
                                                <button
                                                    className="p-2 rounded hover:bg-red-500/20 text-red-500"
                                                    onClick={() => handleAction(apt, 'no_show')}
                                                    disabled={isActive}
                                                    title="Não compareceu"
                                                >
                                                    <i className="fas fa-user-slash"></i>
                                                </button>
                                            )}

                                            {apt.clientPhone && (
                                                <a
                                                    href={`https://wa.me/55${apt.clientPhone.replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded hover:bg-green-500/20 text-green-500"
                                                    title="WhatsApp"
                                                >
                                                    <i className="fab fa-whatsapp"></i>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default BarberSchedulePage;
