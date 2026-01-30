import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function ResumoModal() {
    const {
        modalData,
        closeModal,
        openModal,
        isLoggedIn,
        userInfo,
        userSubscription,
        addAppointment
    } = useApp();

    const [loading, setLoading] = useState(false);
    const [useReferralCredit, setUseReferralCredit] = useState(false);

    const { unit, barber, service, date, time } = modalData || {};

    const canUsePlan = isLoggedIn &&
        userSubscription &&
        service &&
        userSubscription.coveredServices.includes(service.id) &&
        userSubscription.usedServices < userSubscription.totalServices;

    const hasReferralCredits = isLoggedIn && userInfo.referralCredits > 0;

    const getPrice = () => {
        if (canUsePlan) return 0;
        if (useReferralCredit && hasReferralCredits) return 0;
        return service?.promoPrice || service?.price || 0;
    };

    const handleConfirm = async () => {
        if (!isLoggedIn) {
            closeModal();
            openModal('login');
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        addAppointment({
            unitId: unit.id,
            barberId: barber.id,
            serviceId: service.id,
            date,
            time,
            price: getPrice(),
            usedInPlan: canUsePlan,
            usedReferralCredit: useReferralCredit,
        });

        closeModal();
        openModal('sucesso', { date, time, barber, unit });
    };

    if (!modalData) return null;

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Resumo do Agendamento</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {/* Detalhes */}
            <div className="info-card mb-4">
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
                        {canUsePlan ? (
                            <span className="text-green-500 font-semibold">Incluso</span>
                        ) : (
                            <span className="text-primary font-bold text-lg">
                                R$ {getPrice().toFixed(2)}
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
                            {date && new Date(date).toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                        </p>
                        <p className="text-sm text-secondary">às {time}</p>
                    </div>
                </div>
            </div>

            {/* Usar crédito de indicação */}
            {hasReferralCredits && !canUsePlan && (
                <div
                    className="info-card-alt mb-4 flex items-center justify-between cursor-pointer"
                    onClick={() => setUseReferralCredit(!useReferralCredit)}
                >
                    <div className="flex items-center gap-3">
                        <i className="fas fa-gift text-primary text-xl"></i>
                        <div>
                            <p className="font-semibold">Usar crédito de indicação</p>
                            <p className="text-sm text-secondary">
                                Você tem {userInfo.referralCredits} crédito(s)
                            </p>
                        </div>
                    </div>
                    <div className={`toggle-switch ${useReferralCredit ? 'active' : ''}`}></div>
                </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between mb-6 p-4 bg-primary/10 rounded-xl">
                <span className="text-lg font-semibold">Total a pagar</span>
                <span className="text-2xl font-bold text-primary">
                    {(canUsePlan || useReferralCredit) ? 'GRÁTIS' : `R$ ${getPrice().toFixed(2)}`}
                </span>
            </div>

            {/* Botão de confirmação */}
            <button
                className="btn-primary w-full flex items-center justify-center"
                onClick={handleConfirm}
                disabled={loading}
            >
                {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                ) : (
                    <>
                        <span>{isLoggedIn ? 'Confirmar Agendamento' : 'Fazer Login para Agendar'}</span>
                        <i className="fas fa-check ml-2"></i>
                    </>
                )}
            </button>
        </div>
    );
}

export default ResumoModal;
