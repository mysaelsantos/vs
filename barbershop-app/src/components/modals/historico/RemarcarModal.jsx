import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function RemarcarModal() {
    const { modalData, closeModal, updateAppointment, timeSlots } = useApp();
    const [selectedDate, setSelectedDate] = useState(modalData?.date || null);
    const [selectedTime, setSelectedTime] = useState(modalData?.time || null);
    const [loading, setLoading] = useState(false);

    const getNextDays = () => {
        const days = [];
        for (let i = 1; i <= 14; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const handleConfirm = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        updateAppointment(modalData.id, {
            date: selectedDate,
            time: selectedTime,
        });

        closeModal();
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Remarcar Agendamento</h2>
            </div>

            {/* Seleção de Data */}
            <div className="mb-6">
                <label className="text-sm text-secondary mb-3 block">Escolha uma nova data</label>
                <div className="scroll-container">
                    {getNextDays().map((date) => (
                        <button
                            key={date.toISOString()}
                            className={`flex-shrink-0 w-16 p-3 rounded-xl text-center transition-all ${selectedDate === date.toISOString().split('T')[0]
                                    ? 'bg-primary text-black'
                                    : 'bg-bg-card border border-gray-800'
                                }`}
                            onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                        >
                            <p className="text-xs opacity-70">
                                {date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                            </p>
                            <p className="text-xl font-bold">{date.getDate()}</p>
                            <p className="text-xs opacity-70">
                                {date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Seleção de Horário */}
            {selectedDate && (
                <div className="mb-6">
                    <label className="text-sm text-secondary mb-3 block">Escolha um horário</label>
                    <div className="time-slots-grid">
                        {timeSlots.map((time) => (
                            <button
                                key={time}
                                className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Botão de confirmação */}
            <button
                className="btn-primary w-full flex items-center justify-center"
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime || loading}
            >
                {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                ) : (
                    <>
                        <span>Confirmar Remarcação</span>
                        <i className="fas fa-check ml-2"></i>
                    </>
                )}
            </button>
        </div>
    );
}

export default RemarcarModal;
