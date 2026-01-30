import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

function PlanosView() {
    const {
        isLoggedIn,
        userSubscription,
        plans,
        services,
        openModal
    } = useApp();

    const [selectedPlan, setSelectedPlan] = useState(null);

    const renderSubscribedView = () => {
        const currentPlan = plans.find(p => p.id === userSubscription.planId);

        return (
            <div>
                {/* Status do Plano */}
                <div className="info-card mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                            <i className="fas fa-crown text-2xl text-primary"></i>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{userSubscription.plan}</h2>
                            <span className="badge badge-success mt-1">
                                <i className="fas fa-check-circle"></i>
                                {userSubscription.status}
                            </span>
                        </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-secondary">Cortes utilizados</span>
                            <span className="text-white font-semibold">
                                {userSubscription.usedServices}/{userSubscription.totalServices}
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${(userSubscription.usedServices / userSubscription.totalServices) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Info de Renovação */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary">Próxima renovação:</span>
                        <span className="font-bold text-white">{userSubscription.nextBillingDate}</span>
                    </div>
                </div>

                {/* Ações do Plano */}
                <div className="space-y-3 mb-6">
                    <button
                        className="w-full list-item justify-between"
                        onClick={() => openModal('pagamentos')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <i className="fas fa-receipt text-primary"></i>
                            </div>
                            <span>Histórico de Pagamentos</span>
                        </div>
                        <i className="fas fa-chevron-right text-secondary"></i>
                    </button>

                    <button
                        className="w-full list-item justify-between"
                        onClick={() => openModal('beneficios')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <i className="fas fa-gifts text-primary"></i>
                            </div>
                            <span>Benefícios do Plano</span>
                        </div>
                        <i className="fas fa-chevron-right text-secondary"></i>
                    </button>

                    <button
                        className="w-full list-item justify-between"
                        onClick={() => openModal('gerenciarAssinatura')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <i className="fas fa-cog text-primary"></i>
                            </div>
                            <span>Gerenciar Assinatura</span>
                        </div>
                        <i className="fas fa-chevron-right text-secondary"></i>
                    </button>
                </div>

                {/* Serviços Cobertos */}
                <h3 className="text-lg font-bold mb-4">Serviços Inclusos</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {services
                        .filter(s => userSubscription.coveredServices.includes(s.id))
                        .map(service => (
                            <div key={service.id} className="info-card-alt text-center">
                                <i className={`fas ${service.icon} text-2xl text-primary mb-2`}></i>
                                <p className="text-sm font-medium">{service.name}</p>
                            </div>
                        ))
                    }
                </div>

                {/* Ver Todos os Planos */}
                <button
                    className="btn-outline w-full"
                    onClick={() => openModal('mudarPlano')}
                >
                    <i className="fas fa-sync-alt mr-2"></i>
                    Mudar de Plano
                </button>
            </div>
        );
    };

    const renderPlansView = () => (
        <div>
            <p className="text-secondary mb-6">
                Escolha o plano ideal para você e economize em seus cortes favoritos
            </p>

            {/* Lista de Planos */}
            <div className="space-y-4">
                {plans.map(plan => (
                    <div
                        key={plan.id}
                        className={`plan-card cursor-pointer transition-all ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'border-primary' : ''
                            }`}
                        onClick={() => setSelectedPlan(plan.id)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-3xl font-bold text-primary">
                                        R$ {plan.price.toFixed(2).replace('.', ',')}
                                    </span>
                                    <span className="text-secondary">{plan.period}</span>
                                </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-primary bg-primary' : 'border-gray-600'
                                }`}>
                                {selectedPlan === plan.id && (
                                    <i className="fas fa-check text-black text-xs"></i>
                                )}
                            </div>
                        </div>

                        <ul className="space-y-2">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm">
                                    <i className="fas fa-check text-green-500"></i>
                                    <span className="text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Botão de Assinar */}
            <button
                className="btn-primary w-full mt-6"
                disabled={!selectedPlan}
                onClick={() => {
                    if (!isLoggedIn) {
                        openModal('login');
                    } else {
                        openModal('resumo', { planId: selectedPlan });
                    }
                }}
            >
                {isLoggedIn ? 'Assinar Agora' : 'Entrar para Assinar'}
            </button>

            {/* Links */}
            <div className="flex justify-center gap-6 mt-6 text-sm">
                <button
                    className="text-primary hover:underline"
                    onClick={() => openModal('termos')}
                >
                    Termos de Uso
                </button>
                <button
                    className="text-primary hover:underline"
                    onClick={() => openModal('faleConosco')}
                >
                    Fale Conosco
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-primary mb-6">
                {isLoggedIn && userSubscription ? 'Meu Plano' : 'Planos'}
            </h1>

            {isLoggedIn && userSubscription ? renderSubscribedView() : renderPlansView()}
        </div>
    );
}

export default PlanosView;
