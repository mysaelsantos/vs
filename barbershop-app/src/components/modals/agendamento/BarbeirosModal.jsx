import React from 'react';
import { useApp } from '../../../context/AppContext';

function BarbeirosModal() {
    const { getBarbersByUnit, modalData, closeModal } = useApp();

    const barbers = modalData?.unitId ? getBarbersByUnit(modalData.unitId) : [];

    const handleSelect = (barberId) => {
        if (modalData?.onSelect) {
            modalData.onSelect(barberId);
        }
        closeModal();
    };

    return (
        <div className="p-4 pt-2">
            <h2 className="text-xl font-bold text-primary mb-6">Escolha o Barbeiro</h2>

            {barbers.length > 0 ? (
                <div className="space-y-4">
                    {barbers.map((barber) => (
                        <div
                            key={barber.id}
                            className={`list-item cursor-pointer ${modalData?.selected === barber.id ? 'selected' : ''}`}
                            onClick={() => handleSelect(barber.id)}
                        >
                            <img
                                src={barber.image}
                                alt={barber.name}
                                className="avatar-sm"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-white">{barber.name}</h3>
                                <p className="text-sm text-secondary">{barber.role}</p>
                            </div>
                            {modalData?.selected === barber.id && (
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                    <i className="fas fa-check text-black text-xs"></i>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <i className="fas fa-user-tie"></i>
                    <h3>Nenhum barbeiro disponível</h3>
                    <p>Selecione outra unidade</p>
                </div>
            )}
        </div>
    );
}

export default BarbeirosModal;
