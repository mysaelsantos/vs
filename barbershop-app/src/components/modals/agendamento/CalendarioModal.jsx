import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function CalendarioModal() {
    const { timeSlots, modalData, closeModal } = useApp();

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(modalData?.selectedDate || null);
    const [selectedTime, setSelectedTime] = useState(modalData?.selectedTime || null);

    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Adicionar dias vazios para alinhar com o dia da semana
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Adicionar os dias do mês
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const isDateDisabled = (date) => {
        if (!date) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date) => {
        if (!date || !selectedDate) return false;
        return date.toDateString() === new Date(selectedDate).toDateString();
    };

    const handleDateSelect = (date) => {
        if (isDateDisabled(date)) return;
        setSelectedDate(date.toISOString().split('T')[0]);
        setSelectedTime(null);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTime && modalData?.onSelect) {
            modalData.onSelect(selectedDate, selectedTime);
        }
        closeModal();
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    // Simular horários ocupados (30% aleatório)
    const isTimeOccupied = (time) => {
        if (!selectedDate) return false;
        const seed = (new Date(selectedDate).getDate() + time.charCodeAt(0)) % 10;
        return seed < 3;
    };

    return (
        <div className="p-4 pt-2">
            <h2 className="text-xl font-bold text-primary mb-6">Data e Hora</h2>

            {/* Navegação do mês */}
            <div className="flex items-center justify-between mb-4">
                <button
                    className="btn-secondary py-2 px-4"
                    onClick={prevMonth}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                <span className="text-lg font-semibold">
                    {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button
                    className="btn-secondary py-2 px-4"
                    onClick={nextMonth}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>

            {/* Dias da semana */}
            <div className="calendar-grid mb-2">
                {daysOfWeek.map((day) => (
                    <div key={day} className="text-center text-xs text-secondary font-semibold py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Dias do mês */}
            <div className="calendar-grid mb-6">
                {getDaysInMonth().map((date, index) => (
                    <button
                        key={index}
                        className={`calendar-day ${isDateDisabled(date) ? 'disabled' : ''
                            } ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
                        onClick={() => date && handleDateSelect(date)}
                        disabled={isDateDisabled(date)}
                    >
                        {date?.getDate()}
                    </button>
                ))}
            </div>

            {/* Horários */}
            {selectedDate && (
                <>
                    <h3 className="text-lg font-semibold mb-4">
                        Horários disponíveis - {new Date(selectedDate).toLocaleDateString('pt-BR')}
                    </h3>
                    <div className="time-slots-grid mb-6">
                        {timeSlots.map((time) => {
                            const occupied = isTimeOccupied(time);
                            return (
                                <button
                                    key={time}
                                    className={`time-slot ${selectedTime === time ? 'selected' : ''} ${occupied ? 'disabled' : ''}`}
                                    onClick={() => !occupied && handleTimeSelect(time)}
                                    disabled={occupied}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Botão de confirmação */}
            <button
                className="btn-primary w-full"
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime}
            >
                Confirmar
                <i className="fas fa-check ml-2"></i>
            </button>
        </div>
    );
}

export default CalendarioModal;
