import React from 'react';
import { useApp } from '../../../context/AppContext';

function ServicosModal() {
    const { services, modalData, closeModal } = useApp();

    const handleSelect = (serviceId) => {
        if (modalData?.onSelect) {
            modalData.onSelect(serviceId);
        }
        closeModal();
    };

    const coveredServices = modalData?.coveredServices || [];

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Escolha o Serviço</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="space-y-3">
                {services.map((service) => {
                    const isCovered = coveredServices.includes(service.id);

                    return (
                        <div
                            key={service.id}
                            className={`list-item cursor-pointer ${modalData?.selected === service.id ? 'selected' : ''}`}
                            onClick={() => handleSelect(service.id)}
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                <i className={`fas ${service.icon} text-xl text-primary`}></i>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-white">{service.name}</h3>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="text-secondary">
                                        <i className="fas fa-clock mr-1"></i>
                                        {service.duration}
                                    </span>
                                    {isCovered ? (
                                        <span className="text-green-500 font-semibold">
                                            <i className="fas fa-crown mr-1"></i>
                                            Incluso no Plano
                                        </span>
                                    ) : service.promoPrice ? (
                                        <span>
                                            <span className="text-gray-500 line-through mr-2">
                                                R$ {service.price.toFixed(2)}
                                            </span>
                                            <span className="text-primary font-semibold">
                                                R$ {service.promoPrice.toFixed(2)}
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="text-primary font-semibold">
                                            R$ {service.price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {modalData?.selected === service.id && (
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                    <i className="fas fa-check text-black text-xs"></i>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ServicosModal;
