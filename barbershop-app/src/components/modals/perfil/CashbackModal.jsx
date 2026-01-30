import React from 'react';
import { useApp } from '../../../context/AppContext';

function CashbackModal() {
    const { userInfo, closeModal, setCurrentView } = useApp();

    const handleUse = () => {
        closeModal();
        setCurrentView('agendar');
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Meus Créditos</h2>
            </div>

            {/* Saldo */}
            <div className="info-card text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-coins text-3xl text-primary"></i>
                </div>
                <p className="text-secondary text-sm mb-1">Créditos disponíveis</p>
                <p className="text-4xl font-bold text-primary">{userInfo.referralCredits}</p>
                <p className="text-secondary text-sm mt-1">cortes grátis</p>
            </div>

            {/* Info */}
            <div className="info-card-alt mb-6">
                <h4 className="font-semibold mb-3">
                    <i className="fas fa-info-circle text-primary mr-2"></i>
                    Como usar seus créditos
                </h4>
                <ul className="space-y-2 text-sm text-secondary">
                    <li className="flex items-start gap-2">
                        <span className="text-primary">1.</span>
                        Ao agendar um serviço, você pode usar um crédito
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">2.</span>
                        O crédito será aplicado automaticamente no resumo
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">3.</span>
                        Cada crédito vale um serviço gratuito
                    </li>
                </ul>
            </div>

            {/* Histórico simplificado */}
            <h3 className="font-semibold mb-3">Histórico</h3>
            <div className="space-y-2 mb-6">
                {userInfo.referralsMade > 0 ? (
                    <>
                        <div className="flex items-center justify-between py-2 border-b border-gray-800">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-plus-circle text-green-500"></i>
                                <span className="text-sm">Indicação realizada</span>
                            </div>
                            <span className="text-green-500 font-semibold">+1</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-800">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-plus-circle text-green-500"></i>
                                <span className="text-sm">Bônus de meta</span>
                            </div>
                            <span className="text-green-500 font-semibold">+1</span>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-secondary text-sm py-4">
                        Nenhuma movimentação ainda
                    </p>
                )}
            </div>

            <button
                className="btn-primary w-full"
                onClick={handleUse}
                disabled={userInfo.referralCredits === 0}
            >
                <i className="fas fa-calendar-check mr-2"></i>
                {userInfo.referralCredits > 0 ? 'Usar Crédito Agora' : 'Nenhum crédito disponível'}
            </button>
        </div>
    );
}

export default CashbackModal;
