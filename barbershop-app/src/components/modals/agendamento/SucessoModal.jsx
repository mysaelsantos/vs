import React from 'react';
import { useApp } from '../../../context/AppContext';

function SucessoModal() {
    const { modalData, closeModal, setCurrentView } = useApp();
    const { date, time, barber, unit } = modalData || {};

    const handleViewHistory = () => {
        closeModal();
        setCurrentView('historico');
    };

    return (
        <div className="p-6 text-center">
            <div className="mb-6">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-zoom-in">
                    <i className="fas fa-check text-5xl text-green-500 animate-tada"></i>
                </div>
                <h2 className="text-2xl font-bold text-primary">Agendamento Confirmado!</h2>
                <p className="text-secondary mt-2">
                    Seu horário foi reservado com sucesso
                </p>
            </div>

            <div className="info-card mb-6 text-left">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <img src={barber?.image} alt={barber?.name} className="avatar-sm" />
                        <div>
                            <p className="font-semibold text-white">{barber?.name}</p>
                            <p className="text-sm text-secondary">{barber?.role}</p>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <i className="fas fa-calendar-check text-primary"></i>
                        </div>
                        <div>
                            <p className="font-semibold text-white">
                                {date && new Date(date).toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })}
                            </p>
                            <p className="text-sm text-secondary">às {time}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <i className="fas fa-location-dot text-primary"></i>
                        </div>
                        <div>
                            <p className="font-semibold text-white">{unit?.name}</p>
                            <p className="text-sm text-secondary">{unit?.address}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <button className="btn-primary w-full" onClick={closeModal}>
                    <i className="fas fa-home mr-2"></i>
                    Voltar ao Início
                </button>
                <button className="btn-outline w-full" onClick={handleViewHistory}>
                    <i className="fas fa-clock-rotate-left mr-2"></i>
                    Ver Meus Agendamentos
                </button>
            </div>

            <p className="text-secondary text-sm mt-6">
                <i className="fas fa-bell mr-1"></i>
                Você receberá uma notificação de lembrete
            </p>
        </div>
    );
}

export default SucessoModal;
