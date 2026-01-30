import React from 'react';
import { useApp } from '../../../context/AppContext';

function GerenciarAssinaturaModal() {
    const { userSubscription, closeModal, openModal } = useApp();

    const options = [
        {
            icon: 'fa-sync-alt',
            title: 'Mudar de Plano',
            desc: 'Upgrade ou downgrade do seu plano',
            action: () => {
                closeModal();
                openModal('mudarPlano');
            }
        },
        {
            icon: 'fa-credit-card',
            title: 'Forma de Pagamento',
            desc: 'Alterar cartão ou método de pagamento',
            action: () => {
                closeModal();
                openModal('formasPagamento');
            }
        },
        {
            icon: 'fa-receipt',
            title: 'Histórico de Pagamentos',
            desc: 'Ver todos os pagamentos realizados',
            action: () => {
                closeModal();
                openModal('pagamentos');
            }
        },
        {
            icon: 'fa-pause-circle',
            title: 'Pausar Assinatura',
            desc: 'Pausar temporariamente seu plano',
            action: () => alert('Funcionalidade em desenvolvimento')
        },
        {
            icon: 'fa-times-circle',
            title: 'Cancelar Assinatura',
            desc: 'Encerrar sua assinatura',
            action: () => {
                closeModal();
                openModal('cancelarPlano');
            },
            danger: true
        },
    ];

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Gerenciar Assinatura</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {/* Info atual */}
            <div className="info-card mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <i className="fas fa-crown text-xl text-primary"></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{userSubscription?.plan}</h3>
                        <p className="text-sm text-secondary">
                            Renova em {userSubscription?.nextBillingDate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Opções */}
            <div className="space-y-3">
                {options.map((option, idx) => (
                    <button
                        key={idx}
                        className={`w-full list-item justify-between ${option.danger ? 'hover:border-red-500' : ''}`}
                        onClick={option.action}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${option.danger ? 'bg-red-500/20' : 'bg-primary/20'} flex items-center justify-center`}>
                                <i className={`fas ${option.icon} ${option.danger ? 'text-red-500' : 'text-primary'}`}></i>
                            </div>
                            <div className="text-left">
                                <span className={option.danger ? 'text-red-500' : 'text-white'}>{option.title}</span>
                                <p className="text-xs text-secondary">{option.desc}</p>
                            </div>
                        </div>
                        <i className="fas fa-chevron-right text-secondary"></i>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default GerenciarAssinaturaModal;
