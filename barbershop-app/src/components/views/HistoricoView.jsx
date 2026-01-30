import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

function HistoricoView() {
    const {
        isLoggedIn,
        appointments,
        openModal,
        getUnitById,
        getBarberById,
        getServiceById
    } = useApp();

    const [activeTab, setActiveTab] = useState('proximos');

    const getStatusBadge = (status) => {
        const badges = {
            confirmed: { class: 'badge-success', icon: 'fa-check-circle', text: 'Confirmado' },
            pending: { class: 'badge-warning', icon: 'fa-clock', text: 'Pendente' },
            completed: { class: 'badge-info', icon: 'fa-check-double', text: 'Concluído' },
            cancelled: { class: 'badge-danger', icon: 'fa-times-circle', text: 'Cancelado' },
        };
        return badges[status] || badges.pending;
    };

    const upcomingAppointments = appointments.filter(apt =>
        ['confirmed', 'pending'].includes(apt.status) && new Date(apt.date) >= new Date()
    );

    const pastAppointments = appointments.filter(apt =>
        apt.status === 'completed' || new Date(apt.date) < new Date()
    );

    const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled');

    const getFilteredAppointments = () => {
        switch (activeTab) {
            case 'proximos':
                return upcomingAppointments;
            case 'realizados':
                return pastAppointments;
            case 'cancelados':
                return cancelledAppointments;
            default:
                return [];
        }
    };

    const renderAppointmentCard = (apt) => {
        const unit = getUnitById(apt.unitId);
        const barber = getBarberById(apt.barberId);
        const service = getServiceById(apt.serviceId);
        const statusBadge = getStatusBadge(apt.status);

        return (
            <div
                key={apt.id}
                className="info-card mb-4 cursor-pointer hover:border-gray-600 transition-colors"
                onClick={() => openModal('detalhesAgendamento', apt)}
            >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={barber.image}
                            alt={barber.name}
                            className="avatar-sm"
                        />
                        <div>
                            <h3 className="font-semibold text-white">{service.name}</h3>
                            <p className="text-sm text-secondary">{barber.name}</p>
                        </div>
                    </div>
                    <span className={`badge ${statusBadge.class}`}>
                        <i className={`fas ${statusBadge.icon}`}></i>
                        {statusBadge.text}
                    </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-secondary">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-calendar"></i>
                        <span>{new Date(apt.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <i className="fas fa-clock"></i>
                        <span>{apt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <i className="fas fa-location-dot"></i>
                        <span>{unit.name.split(' - ')[1]}</span>
                    </div>
                </div>

                {apt.status === 'completed' && apt.rating && (
                    <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-2">
                        <span className="text-sm text-secondary">Sua avaliação:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <i
                                    key={star}
                                    className={`fas fa-star text-sm ${star <= apt.rating ? 'text-primary' : 'text-gray-600'}`}
                                ></i>
                            ))}
                        </div>
                    </div>
                )}

                {apt.status === 'completed' && !apt.rating && (
                    <button
                        className="mt-3 w-full btn-outline text-sm py-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal('avaliacao', apt);
                        }}
                    >
                        <i className="fas fa-star mr-2"></i>
                        Avaliar Atendimento
                    </button>
                )}

                {apt.usedInPlan && (
                    <div className="mt-3 flex items-center gap-2 text-green-500 text-sm">
                        <i className="fas fa-crown"></i>
                        <span>Usado no plano</span>
                    </div>
                )}
            </div>
        );
    };

    if (!isLoggedIn) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold text-primary mb-6">Histórico</h1>
                <div className="empty-state">
                    <i className="fas fa-clock-rotate-left"></i>
                    <h3>Faça login para ver seu histórico</h3>
                    <p className="mb-4">Acompanhe seus agendamentos passados e futuros</p>
                    <button
                        className="btn-primary"
                        onClick={() => openModal('login')}
                    >
                        Entrar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-primary mb-6">Histórico</h1>

            {/* Tabs */}
            <div className="tabs-container mb-6">
                <button
                    className={`tab-item ${activeTab === 'proximos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('proximos')}
                >
                    Próximos
                </button>
                <button
                    className={`tab-item ${activeTab === 'realizados' ? 'active' : ''}`}
                    onClick={() => setActiveTab('realizados')}
                >
                    Realizados
                </button>
                <button
                    className={`tab-item ${activeTab === 'cancelados' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cancelados')}
                >
                    Cancelados
                </button>
            </div>

            {/* Lista de Agendamentos */}
            {getFilteredAppointments().length > 0 ? (
                <div>
                    {getFilteredAppointments().map(apt => renderAppointmentCard(apt))}
                </div>
            ) : (
                <div className="empty-state">
                    <i className={`fas ${activeTab === 'proximos' ? 'fa-calendar-plus' :
                            activeTab === 'realizados' ? 'fa-check-double' :
                                'fa-times-circle'
                        }`}></i>
                    <h3>
                        {activeTab === 'proximos' && 'Nenhum agendamento próximo'}
                        {activeTab === 'realizados' && 'Nenhum agendamento realizado'}
                        {activeTab === 'cancelados' && 'Nenhum agendamento cancelado'}
                    </h3>
                    <p>
                        {activeTab === 'proximos' && 'Que tal agendar seu próximo corte?'}
                        {activeTab === 'realizados' && 'Seus agendamentos concluídos aparecerão aqui'}
                        {activeTab === 'cancelados' && 'Agendamentos cancelados aparecerão aqui'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default HistoricoView;
