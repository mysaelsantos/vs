import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

function AgendarView() {
    const {
        isLoggedIn,
        userInfo,
        userSubscription,
        units,
        barbers,
        services,
        openModal,
        getUnitById,
        getBarberById,
        getServiceById
    } = useApp();

    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const handleContinue = () => {
        if (selectedUnit && selectedBarber && selectedService && selectedDate && selectedTime) {
            openModal('resumo', {
                unit: getUnitById(selectedUnit),
                barber: getBarberById(selectedBarber),
                service: getServiceById(selectedService),
                date: selectedDate,
                time: selectedTime,
            });
        }
    };

    const canUsePlanService = () => {
        if (!isLoggedIn || !userSubscription) return false;
        if (userSubscription.usedServices >= userSubscription.totalServices) return false;
        return selectedService && userSubscription.coveredServices.includes(selectedService);
    };

    const getServicePrice = () => {
        if (!selectedService) return null;
        const service = getServiceById(selectedService);
        if (canUsePlanService()) return 0;
        return service.promoPrice || service.price;
    };

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary">VS Barbearia</h1>
                    <p className="text-secondary text-sm">
                        {isLoggedIn ? `Olá, ${userInfo.name.split(' ')[0]}!` : 'Bem-vindo!'}
                    </p>
                </div>
                <img
                    src="https://i.postimg.cc/5yBSjg1F/Bigode-3.png"
                    alt="Logo"
                    className="w-12 h-12"
                />
            </div>

            {/* Banner de Plano */}
            {isLoggedIn && userSubscription && (
                <div
                    className="info-card mb-6 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => openModal('assinatura')}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <i className="fas fa-crown text-primary"></i>
                            </div>
                            <div>
                                <p className="font-semibold text-white">{userSubscription.plan}</p>
                                <p className="text-sm text-secondary">
                                    {userSubscription.usedServices}/{userSubscription.totalServices} cortes usados
                                </p>
                            </div>
                        </div>
                        <i className="fas fa-chevron-right text-secondary"></i>
                    </div>
                    <div className="mt-3">
                        <div className="progress-bar">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${(userSubscription.usedServices / userSubscription.totalServices) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Título da Seção */}
            <h2 className="text-lg font-bold mb-4">Agendar Serviço</h2>

            {/* Seleção de Unidade */}
            <div className="mb-4">
                <label className="text-sm text-secondary mb-2 block">Unidade</label>
                <button
                    className="w-full list-item justify-between"
                    onClick={() => openModal('unidades', {
                        selected: selectedUnit,
                        onSelect: setSelectedUnit
                    })}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <i className="fas fa-location-dot text-primary"></i>
                        </div>
                        <span className={selectedUnit ? 'text-white' : 'text-secondary'}>
                            {selectedUnit ? getUnitById(selectedUnit).name : 'Selecione uma unidade'}
                        </span>
                    </div>
                    <i className="fas fa-chevron-right text-secondary"></i>
                </button>
            </div>

            {/* Seleção de Barbeiro */}
            <div className="mb-4">
                <label className="text-sm text-secondary mb-2 block">Barbeiro</label>
                <button
                    className={`w-full list-item justify-between ${!selectedUnit ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => selectedUnit && openModal('barbeiros', {
                        unitId: selectedUnit,
                        selected: selectedBarber,
                        onSelect: setSelectedBarber
                    })}
                    disabled={!selectedUnit}
                >
                    <div className="flex items-center gap-3">
                        {selectedBarber ? (
                            <img
                                src={getBarberById(selectedBarber).image}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <i className="fas fa-user-tie text-primary"></i>
                            </div>
                        )}
                        <span className={selectedBarber ? 'text-white' : 'text-secondary'}>
                            {selectedBarber ? getBarberById(selectedBarber).name : 'Selecione um barbeiro'}
                        </span>
                    </div>
                    <i className="fas fa-chevron-right text-secondary"></i>
                </button>
            </div>

            {/* Seleção de Serviço */}
            <div className="mb-4">
                <label className="text-sm text-secondary mb-2 block">Serviço</label>
                <button
                    className={`w-full list-item justify-between ${!selectedBarber ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => selectedBarber && openModal('servicos', {
                        selected: selectedService,
                        onSelect: setSelectedService,
                        coveredServices: isLoggedIn ? userSubscription?.coveredServices : []
                    })}
                    disabled={!selectedBarber}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <i className={`fas ${selectedService ? getServiceById(selectedService).icon : 'fa-scissors'} text-primary`}></i>
                        </div>
                        <div className="text-left">
                            <span className={selectedService ? 'text-white' : 'text-secondary'}>
                                {selectedService ? getServiceById(selectedService).name : 'Selecione um serviço'}
                            </span>
                            {selectedService && (
                                <p className="text-sm">
                                    {canUsePlanService() ? (
                                        <span className="text-green-500">Incluso no plano</span>
                                    ) : (
                                        <span className="text-primary">R$ {getServicePrice()?.toFixed(2)}</span>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                    <i className="fas fa-chevron-right text-secondary"></i>
                </button>
            </div>

            {/* Seleção de Data e Hora */}
            <div className="mb-6">
                <label className="text-sm text-secondary mb-2 block">Data e Hora</label>
                <button
                    className={`w-full list-item justify-between ${!selectedService ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => selectedService && openModal('calendario', {
                        selectedDate,
                        selectedTime,
                        onSelect: (date, time) => {
                            setSelectedDate(date);
                            setSelectedTime(time);
                        }
                    })}
                    disabled={!selectedService}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <i className="fas fa-calendar text-primary"></i>
                        </div>
                        <span className={selectedDate && selectedTime ? 'text-white' : 'text-secondary'}>
                            {selectedDate && selectedTime
                                ? `${new Date(selectedDate).toLocaleDateString('pt-BR')} às ${selectedTime}`
                                : 'Selecione data e hora'}
                        </span>
                    </div>
                    <i className="fas fa-chevron-right text-secondary"></i>
                </button>
            </div>

            {/* Botão de Continuar */}
            <button
                className="btn-primary w-full flex items-center justify-center gap-2"
                onClick={handleContinue}
                disabled={!selectedUnit || !selectedBarber || !selectedService || !selectedDate || !selectedTime}
            >
                <span>Continuar</span>
                <i className="fas fa-arrow-right"></i>
            </button>

            {/* Aviso de Login */}
            {!isLoggedIn && (
                <div className="mt-6 info-card text-center">
                    <p className="text-secondary text-sm mb-3">
                        Faça login para acessar benefícios exclusivos e histórico de agendamentos
                    </p>
                    <button
                        className="btn-outline text-sm py-2 px-4"
                        onClick={() => openModal('login')}
                    >
                        Entrar ou Cadastrar
                    </button>
                </div>
            )}
        </div>
    );
}

export default AgendarView;
