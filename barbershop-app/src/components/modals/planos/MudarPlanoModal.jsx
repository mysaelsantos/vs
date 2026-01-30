import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function MudarPlanoModal() {
    const { plans, userSubscription, updateSubscription, closeModal } = useApp();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!selectedPlan) return;

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const plan = plans.find(p => p.id === selectedPlan);
        updateSubscription({
            planId: selectedPlan,
            plan: plan.title,
            coveredServices: plan.coveredServices,
        });

        closeModal();
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Mudar de Plano</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <p className="text-secondary mb-4">
                Seu plano atual: <span className="text-white font-semibold">{userSubscription?.plan}</span>
            </p>

            <div className="space-y-4 mb-6">
                {plans.map((plan) => {
                    const isCurrent = plan.id === userSubscription?.planId;

                    return (
                        <div
                            key={plan.id}
                            className={`plan-card cursor-pointer ${plan.popular ? 'popular' : ''
                                } ${selectedPlan === plan.id ? 'border-primary' : ''} ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            onClick={() => !isCurrent && setSelectedPlan(plan.id)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-white">
                                        {plan.title}
                                        {isCurrent && <span className="text-sm text-primary ml-2">(Atual)</span>}
                                    </h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-primary">
                                            R$ {plan.price.toFixed(2).replace('.', ',')}
                                        </span>
                                        <span className="text-secondary">{plan.period}</span>
                                    </div>
                                </div>
                                {!isCurrent && (
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-primary bg-primary' : 'border-gray-600'
                                        }`}>
                                        {selectedPlan === plan.id && (
                                            <i className="fas fa-check text-black text-xs"></i>
                                        )}
                                    </div>
                                )}
                            </div>

                            <ul className="space-y-1">
                                {plan.features.slice(0, 3).map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                        <i className="fas fa-check text-green-500 text-xs"></i>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>

            <button
                className="btn-primary w-full flex items-center justify-center"
                onClick={handleConfirm}
                disabled={!selectedPlan || loading}
            >
                {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                ) : (
                    <>
                        <span>Confirmar Mudança</span>
                        <i className="fas fa-check ml-2"></i>
                    </>
                )}
            </button>
        </div>
    );
}

export default MudarPlanoModal;
