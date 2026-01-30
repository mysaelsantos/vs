import React from 'react';
import { useApp } from '../../../context/AppContext';

function UnidadesModal() {
    const { units, modalData, closeModal } = useApp();

    const handleSelect = (unitId) => {
        if (modalData?.onSelect) {
            modalData.onSelect(unitId);
        }
        closeModal();
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Escolha a Unidade</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="space-y-4">
                {units.map((unit) => (
                    <div
                        key={unit.id}
                        className={`list-item cursor-pointer ${modalData?.selected === unit.id ? 'selected' : ''}`}
                        onClick={() => handleSelect(unit.id)}
                    >
                        <img
                            src={unit.image}
                            alt={unit.name}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-white">{unit.name}</h3>
                            <p className="text-sm text-secondary">{unit.address}</p>
                            <a
                                href={unit.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <i className="fas fa-map-marker-alt"></i>
                                Ver no mapa
                            </a>
                        </div>
                        {modalData?.selected === unit.id && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <i className="fas fa-check text-black text-xs"></i>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UnidadesModal;
