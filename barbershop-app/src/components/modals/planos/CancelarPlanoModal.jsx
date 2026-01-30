import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function CancelarPlanoModal() {
    const { userSubscription, updateSubscription, closeModal } = useApp();
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const reasons = [
        'Não estou usando o suficiente',
        'Muito caro para mim',
        'Vou me mudar',
        'Problemas com o serviço',
        'Outro motivo',
    ];

    const handleConfirm = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simular cancelamento
        updateSubscription({ status: 'Cancelado' });
        setConfirmed(true);
        setLoading(false);
    };

    if (confirmed) {
        return (
            <div className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-heart-crack text-3xl text-red-500"></i>
                </div>
                <h2 className="text-xl font-bold mb-2">Assinatura Cancelada</h2>
                <p className="text-secondary mb-6">
                    Sentiremos sua falta! Você ainda pode usar o plano até {userSubscription?.nextBillingDate}.
                </p>
                <button className="btn-primary w-full" onClick={closeModal}>
                    Entendi
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-red-500">Cancelar Assinatura</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
                </div>
                <p className="text-secondary">
                    Tem certeza que deseja cancelar sua assinatura?
                </p>
                <p className="text-white font-semibold mt-1">{userSubscription?.plan}</p>
            </div>

            {/* O que você vai perder */}
            <div className="info-card-alt mb-6">
                <h4 className="font-semibold mb-3 text-red-400">
                    <i className="fas fa-times-circle mr-2"></i>
                    O que você vai perder:
                </h4>
                <ul className="space-y-2 text-sm text-secondary">
                    <li className="flex items-center gap-2">
                        <i className="fas fa-scissors"></i>
                        4 cortes gratuitos por mês
                    </li>
                    <li className="flex items-center gap-2">
                        <i className="fas fa-calendar-check"></i>
                        Agendamento prioritário
                    </li>
                    <li className="flex items-center gap-2">
                        <i className="fas fa-percent"></i>
                        Descontos exclusivos
                    </li>
                </ul>
            </div>

            {/* Motivo */}
            <div className="mb-6">
                <label className="text-sm text-secondary mb-2 block">
                    Por que você quer cancelar?
                </label>
                <div className="space-y-2">
                    {reasons.map((r) => (
                        <button
                            key={r}
                            className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${reason === r
                                    ? 'bg-red-500/20 border-red-500 text-white border'
                                    : 'bg-bg-card border border-gray-800'
                                }`}
                            onClick={() => setReason(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Botões */}
            <div className="space-y-3">
                <button
                    className="btn-danger w-full flex items-center justify-center"
                    onClick={handleConfirm}
                    disabled={!reason || loading}
                >
                    {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <>Confirmar Cancelamento</>
                    )}
                </button>
                <button className="btn-secondary w-full" onClick={closeModal}>
                    Manter Meu Plano
                </button>
            </div>
        </div>
    );
}

export default CancelarPlanoModal;
