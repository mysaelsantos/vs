import React from 'react';
import { useApp } from '../../../context/AppContext';

function BemVindoModal() {
    const { closeModal, userInfo } = useApp();

    return (
        <div className="p-6 text-center">
            <div className="mb-6">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-zoom-in">
                    <i className="fas fa-check text-5xl text-green-500 animate-tada"></i>
                </div>
                <h2 className="text-2xl font-bold text-primary">Bem-vindo!</h2>
                <p className="text-secondary mt-2">
                    Olá, <span className="text-white font-semibold">{userInfo.name.split(' ')[0]}</span>!
                </p>
                <p className="text-secondary">
                    Sua conta foi acessada com sucesso.
                </p>
            </div>

            <div className="info-card mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <i className="fas fa-gift text-xl text-primary"></i>
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-white">Você tem créditos disponíveis!</p>
                        <p className="text-sm text-secondary">
                            <span className="text-primary font-bold">{userInfo.referralCredits}</span> cortes de indicação
                        </p>
                    </div>
                </div>
            </div>

            <button
                className="btn-primary w-full"
                onClick={closeModal}
            >
                Começar a Usar
                <i className="fas fa-arrow-right ml-2"></i>
            </button>
        </div>
    );
}

export default BemVindoModal;
