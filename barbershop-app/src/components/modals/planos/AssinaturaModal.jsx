import React from 'react';
import { useApp } from '../../../context/AppContext';

function AssinaturaModal() {
    const { userSubscription, services, plans, closeModal, openModal } = useApp();

    const currentPlan = plans.find(p => p.id === userSubscription?.planId);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Minha Assinatura</h2>
            </div>

            {/* Status do Plano */}
            <div className="info-card mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                        <i className="fas fa-crown text-2xl text-primary"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{userSubscription?.plan}</h3>
                        <span className="badge badge-success">
                            <i className="fas fa-check-circle"></i>
                            {userSubscription?.status}
                        </span>
                    </div>
                </div>

                {/* Progresso */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-secondary">Cortes utilizados este período</span>
                        <span className="text-white font-semibold">
                            {userSubscription?.usedServices}/{userSubscription?.totalServices}
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${(userSubscription?.usedServices / userSubscription?.totalServices) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-secondary">Próxima renovação:</span>
                    <span className="font-bold text-white">{userSubscription?.nextBillingDate}</span>
                </div>
            </div>

            {/* Serviços Cobertos */}
            <h3 className="font-semibold mb-3">Serviços Inclusos</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
                {services
                    .filter(s => userSubscription?.coveredServices?.includes(s.id))
                    .map(service => (
                        <div key={service.id} className="info-card-alt text-center py-3">
                            <i className={`fas ${service.icon} text-xl text-primary mb-1`}></i>
                            <p className="text-xs">{service.name}</p>
                        </div>
                    ))
                }
            </div>

            {/* Benefícios */}
            <h3 className="font-semibold mb-3">Benefícios do seu Plano</h3>
            <div className="info-card-alt mb-6">
                <ul className="space-y-2">
                    {currentPlan?.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                            <i className="fas fa-check text-green-500"></i>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Ações */}
            <div className="space-y-3">
                <button
                    className="btn-outline w-full"
                    onClick={() => {
                        closeModal();
                        openModal('mudarPlano');
                    }}
                >
                    <i className="fas fa-sync-alt mr-2"></i>
                    Mudar de Plano
                </button>
                <button
                    className="btn-secondary w-full"
                    onClick={() => {
                        closeModal();
                        openModal('gerenciarAssinatura');
                    }}
                >
                    <i className="fas fa-cog mr-2"></i>
                    Gerenciar Assinatura
                </button>
            </div>
        </div>
    );
}

export default AssinaturaModal;
