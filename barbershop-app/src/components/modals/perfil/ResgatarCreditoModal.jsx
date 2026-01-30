import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function ResgatarCreditoModal() {
    const { modalData, redeemReferralGoal, closeModal } = useApp();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleRedeem = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        redeemReferralGoal(modalData?.goalIndex);
        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div className="p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-zoom-in">
                    <i className="fas fa-gift text-5xl text-green-500 animate-tada"></i>
                </div>
                <h2 className="text-2xl font-bold text-primary mb-2">Parabéns!</h2>
                <p className="text-secondary mb-2">Você resgatou:</p>
                <p className="text-xl font-bold text-white mb-6">{modalData?.reward}</p>
                <button className="btn-primary w-full" onClick={closeModal}>
                    Fechar
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Resgatar Recompensa</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-gift text-3xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Recompensa Disponível!</h3>
                <p className="text-2xl font-bold text-primary">{modalData?.reward}</p>
            </div>

            <div className="info-card-alt mb-6">
                <p className="text-sm text-secondary text-center">
                    Ao resgatar, você receberá 1 crédito para usar em seu próximo agendamento.
                    O crédito não expira!
                </p>
            </div>

            <button
                className="btn-primary w-full flex items-center justify-center"
                onClick={handleRedeem}
                disabled={loading}
            >
                {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                ) : (
                    <>
                        <span>Resgatar Agora</span>
                        <i className="fas fa-gift ml-2"></i>
                    </>
                )}
            </button>
        </div>
    );
}

export default ResgatarCreditoModal;
