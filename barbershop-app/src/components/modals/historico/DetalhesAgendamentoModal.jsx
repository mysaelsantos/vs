import React from 'react';
import { useApp } from '../../../context/AppContext';

function DetalhesAgendamentoModal() {
    const {
        modalData,
        closeModal,
        openModal,
        getUnitById,
        getBarberById,
        getServiceById
    } = useApp();

    if (!modalData) return null;

    const unit = getUnitById(modalData.unitId);
    const barber = getBarberById(modalData.barberId);
    const service = getServiceById(modalData.serviceId);

    const getStatusInfo = (status) => {
        const statuses = {
            confirmed: { class: 'badge-success', icon: 'fa-check-circle', text: 'Confirmado' },
            pending: { class: 'badge-warning', icon: 'fa-clock', text: 'Pendente' },
            completed: { class: 'badge-info', icon: 'fa-check-double', text: 'Concluído' },
            cancelled: { class: 'badge-danger', icon: 'fa-times-circle', text: 'Cancelado' },
        };
        return statuses[status] || statuses.pending;
    };

    const statusInfo = getStatusInfo(modalData.status);
    const canReschedule = ['confirmed', 'pending'].includes(modalData.status);
    const canCancel = ['confirmed', 'pending'].includes(modalData.status);
    const canRate = modalData.status === 'completed' && !modalData.rating;

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Detalhes do Agendamento</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {/* Status */}
            <div className="text-center mb-6">
                <span className={`badge ${statusInfo.class} text-base px-6 py-2`}>
                    <i className={`fas ${statusInfo.icon}`}></i>
                    {statusInfo.text}
                </span>
            </div>

            <div className="info-card mb-6">
                {/* Serviço */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-800">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <i className={`fas ${service?.icon} text-xl text-primary`}></i>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-white">{service?.name}</h3>
                        <p className="text-sm text-secondary">{service?.duration}</p>
                    </div>
                    <div className="text-right">
                        {modalData.usedInPlan ? (
                            <span className="text-green-500 font-semibold">Plano</span>
                        ) : (
                            <span className="text-primary font-bold">
                                R$ {modalData.price?.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Barbeiro */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-800">
                    <img src={barber?.image} alt={barber?.name} className="avatar-sm" />
                    <div>
                        <p className="font-semibold text-white">{barber?.name}</p>
                        <p className="text-sm text-secondary">{barber?.role}</p>
                    </div>
                </div>

                {/* Unidade */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-800">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <i className="fas fa-location-dot text-xl text-primary"></i>
                    </div>
                    <div>
                        <p className="font-semibold text-white">{unit?.name}</p>
                        <p className="text-sm text-secondary">{unit?.address}</p>
                    </div>
                </div>

                {/* Data e Hora */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <i className="fas fa-calendar-check text-xl text-primary"></i>
                    </div>
                    <div>
                        <p className="font-semibold text-white">
                            {new Date(modalData.date).toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                        </p>
                        <p className="text-sm text-secondary">às {modalData.time}</p>
                    </div>
                </div>
            </div>

            {/* Avaliação existente */}
            {modalData.rating && (
                <div className="info-card-alt mb-6 text-center">
                    <p className="text-secondary text-sm mb-2">Sua avaliação</p>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <i
                                key={star}
                                className={`fas fa-star text-2xl ${star <= modalData.rating ? 'text-primary' : 'text-gray-600'}`}
                            ></i>
                        ))}
                    </div>
                </div>
            )}

            {/* Ações */}
            <div className="space-y-3">
                {canRate && (
                    <button
                        className="btn-primary w-full"
                        onClick={() => {
                            closeModal();
                            openModal('avaliacao', modalData);
                        }}
                    >
                        <i className="fas fa-star mr-2"></i>
                        Avaliar Atendimento
                    </button>
                )}

                {canReschedule && (
                    <button
                        className="btn-outline w-full"
                        onClick={() => {
                            closeModal();
                            openModal('remarcar', modalData);
                        }}
                    >
                        <i className="fas fa-calendar-alt mr-2"></i>
                        Remarcar
                    </button>
                )}

                {canCancel && (
                    <button
                        className="btn-danger w-full"
                        onClick={() => {
                            closeModal();
                            openModal('cancelar', modalData);
                        }}
                    >
                        <i className="fas fa-times mr-2"></i>
                        Cancelar Agendamento
                    </button>
                )}
            </div>
        </div>
    );
}

export default DetalhesAgendamentoModal;
