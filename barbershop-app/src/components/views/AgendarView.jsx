import React, { useState, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';

function AgendarView() {
    const {
        isLoggedIn,
        userSubscription,
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

    const handleAgendar = () => {
        if (selectedUnit && selectedBarber && selectedService && selectedDate && selectedTime) {
            openModal('resumo', {
                unit: getUnitById(selectedUnit),
                barber: getBarberById(selectedBarber),
                service: getServiceById(selectedService),
                date: selectedDate,
                time: selectedTime,
            });
        } else {
            if (!selectedUnit) {
                openModal('unidades', {
                    selected: selectedUnit,
                    onSelect: setSelectedUnit
                });
            } else if (!selectedBarber) {
                openModal('barbeiros', {
                    unitId: selectedUnit,
                    selected: selectedBarber,
                    onSelect: setSelectedBarber
                });
            } else if (!selectedService) {
                openModal('servicos', {
                    selected: selectedService,
                    onSelect: setSelectedService,
                    coveredServices: isLoggedIn ? userSubscription?.coveredServices : []
                });
            } else if (!selectedDate || !selectedTime) {
                openModal('calendario', {
                    selectedDate,
                    selectedTime,
                    onSelect: (date, time) => {
                        setSelectedDate(date);
                        setSelectedTime(time);
                    }
                });
            }
        }
    };

    const isSelected = (type) => {
        switch (type) {
            case 'unit': return selectedUnit !== null;
            case 'barber': return selectedBarber !== null;
            case 'service': return selectedService !== null;
            case 'datetime': return selectedDate !== null && selectedTime !== null;
            default: return false;
        }
    };

    return (
        <div className="agendar-view">
            {/* Content */}
            <div className="agendar-content">
                {/* Logo */}
                <div className="logo-section">
                    <img
                        src="https://i.postimg.cc/5yBSjg1F/Bigode-3.png"
                        alt="VS Barbearia"
                        className="logo-image"
                    />
                </div>

                {/* Title */}
                <div className="title-section">
                    <h1 className="main-title">Agende seu horário</h1>
                    <div className="title-underline"></div>
                    <p className="subtitle">Escolha os serviços e agende com facilidade.</p>
                </div>

                {/* Selection Buttons */}
                <div className="selection-buttons">
                    {/* Unidade */}
                    <button
                        className={`selection-btn ${isSelected('unit') ? 'selected' : ''}`}
                        onClick={() => openModal('unidades', {
                            selected: selectedUnit,
                            onSelect: setSelectedUnit
                        })}
                    >
                        <div className="selection-btn-content">
                            <i className={`fas fa-calendar-alt selection-icon ${isSelected('unit') ? 'active' : ''}`}></i>
                            <span className={isSelected('unit') ? 'text-white' : ''}>
                                {selectedUnit ? getUnitById(selectedUnit).name : 'Selecionar unidade'}
                            </span>
                        </div>
                        <i className="fas fa-chevron-right"></i>
                    </button>

                    {/* Barbeiro */}
                    <button
                        className={`selection-btn ${isSelected('barber') ? 'selected' : ''} ${!selectedUnit ? 'disabled' : ''}`}
                        onClick={() => selectedUnit && openModal('barbeiros', {
                            unitId: selectedUnit,
                            selected: selectedBarber,
                            onSelect: setSelectedBarber
                        })}
                    >
                        <div className="selection-btn-content">
                            <i className={`fas fa-user selection-icon ${isSelected('barber') ? 'active' : ''}`}></i>
                            <span className={isSelected('barber') ? 'text-white' : ''}>
                                {selectedBarber ? getBarberById(selectedBarber).name : 'Selecionar barbeiro'}
                            </span>
                        </div>
                        <i className="fas fa-chevron-right"></i>
                    </button>

                    {/* Serviço */}
                    <button
                        className={`selection-btn ${isSelected('service') ? 'selected' : ''} ${!selectedBarber ? 'disabled' : ''}`}
                        onClick={() => selectedBarber && openModal('servicos', {
                            selected: selectedService,
                            onSelect: setSelectedService,
                            coveredServices: isLoggedIn ? userSubscription?.coveredServices : []
                        })}
                    >
                        <div className="selection-btn-content">
                            <i className={`fas fa-cut selection-icon ${isSelected('service') ? 'active' : ''}`}></i>
                            <span className={isSelected('service') ? 'text-white' : ''}>
                                {selectedService ? getServiceById(selectedService).name : 'Selecionar serviço'}
                            </span>
                        </div>
                        <i className="fas fa-chevron-right"></i>
                    </button>

                    {/* Data e Hora */}
                    <button
                        className={`selection-btn ${isSelected('datetime') ? 'selected' : ''} ${!selectedService ? 'disabled' : ''}`}
                        onClick={() => selectedService && openModal('calendario', {
                            selectedDate,
                            selectedTime,
                            onSelect: (date, time) => {
                                setSelectedDate(date);
                                setSelectedTime(time);
                            }
                        })}
                    >
                        <div className="selection-btn-content">
                            <i className={`fas fa-calendar selection-icon ${isSelected('datetime') ? 'active' : ''}`}></i>
                            <span className={isSelected('datetime') ? 'text-white' : ''}>
                                {selectedDate && selectedTime
                                    ? `${new Date(selectedDate).toLocaleDateString('pt-BR')} às ${selectedTime}`
                                    : 'Selecionar data e hora'}
                            </span>
                        </div>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>

                {/* Agendar Button */}
                <button
                    className="agendar-btn"
                    onClick={handleAgendar}
                >
                    Agendar
                </button>
            </div>
        </div>
    );
}

export default AgendarView;
