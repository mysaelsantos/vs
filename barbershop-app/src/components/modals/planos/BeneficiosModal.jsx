import React from 'react';
import { useApp } from '../../../context/AppContext';

function BeneficiosModal() {
    const { userSubscription, plans, closeModal } = useApp();

    const currentPlan = plans.find(p => p.id === userSubscription?.planId);

    const allBenefits = [
        { icon: 'fa-scissors', title: '4 Cortes por Mês', desc: 'Cortes ilimitados inclusos no seu plano' },
        { icon: 'fa-calendar-check', title: 'Agendamento Prioritário', desc: 'Acesso aos melhores horários antes de todos' },
        { icon: 'fa-percent', title: 'Desconto em Produtos', desc: 'Produtos da loja com preços especiais' },
        { icon: 'fa-mug-hot', title: 'Bebida Grátis', desc: 'Cerveja, café ou refrigerante por conta da casa' },
        { icon: 'fa-face-grin-beam', title: 'Barba Grátis', desc: 'Serviço de barba incluso no plano' },
        { icon: 'fa-gift', title: 'Presente de Aniversário', desc: 'Surpresa especial no seu mês de aniversário' },
    ];

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Benefícios do Plano</h2>
            </div>

            <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-crown text-2xl text-primary"></i>
                </div>
                <h3 className="text-lg font-bold text-white">{userSubscription?.plan}</h3>
            </div>

            <div className="space-y-4">
                {allBenefits.map((benefit, idx) => (
                    <div key={idx} className="list-item">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <i className={`fas ${benefit.icon} text-xl text-primary`}></i>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">{benefit.title}</h4>
                            <p className="text-sm text-secondary">{benefit.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BeneficiosModal;
