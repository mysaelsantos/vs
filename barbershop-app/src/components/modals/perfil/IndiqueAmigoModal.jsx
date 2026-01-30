import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function IndiqueAmigoModal() {
    const { userInfo, referralGoals, closeModal, openModal } = useApp();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(userInfo.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'VS Barbearia',
                text: `Use meu código ${userInfo.referralCode} e ganhe desconto no primeiro corte!`,
                url: 'https://vsbarbearia.com',
            });
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Indique e Ganhe</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {/* Código de indicação */}
            <div className="info-card text-center mb-6">
                <p className="text-secondary text-sm mb-2">Seu código de indicação</p>
                <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-bold text-primary tracking-widest">
                        {userInfo.referralCode}
                    </span>
                    <button
                        className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
                        onClick={handleCopy}
                    >
                        <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} text-primary`}></i>
                    </button>
                </div>
                {copied && <p className="text-green-500 text-sm mt-2">Copiado!</p>}
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="stat-card">
                    <i className="fas fa-users text-2xl text-primary mb-2"></i>
                    <p className="text-2xl font-bold text-white">{userInfo.referralsMade}</p>
                    <p className="text-xs text-secondary">Indicações</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-gift text-2xl text-primary mb-2"></i>
                    <p className="text-2xl font-bold text-white">{userInfo.referralCredits}</p>
                    <p className="text-xs text-secondary">Créditos</p>
                </div>
            </div>

            {/* Metas */}
            <h3 className="font-semibold mb-3">Suas Metas</h3>
            <div className="space-y-3 mb-6">
                {referralGoals.map((goal, idx) => {
                    const completed = userInfo.referralsMade >= goal.count;
                    const redeemed = userInfo.redeemedGoals.includes(idx);

                    return (
                        <div key={idx} className={`info-card-alt flex items-center justify-between ${completed && !redeemed ? 'border border-green-500' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${completed ? 'bg-green-500/20' : 'bg-gray-700'} flex items-center justify-center`}>
                                    <i className={`fas ${goal.icon} ${completed ? 'text-green-500' : 'text-gray-500'}`}></i>
                                </div>
                                <div>
                                    <p className={`font-semibold ${completed ? 'text-white' : 'text-gray-400'}`}>
                                        {goal.count} indicações
                                    </p>
                                    <p className={`text-sm ${completed ? 'text-green-500' : 'text-secondary'}`}>
                                        {goal.reward}
                                    </p>
                                </div>
                            </div>
                            {completed && !redeemed && (
                                <button
                                    className="btn-primary text-xs py-2 px-3"
                                    onClick={() => {
                                        closeModal();
                                        openModal('resgatarCredito', { goalIndex: idx, reward: goal.reward });
                                    }}
                                >
                                    Resgatar
                                </button>
                            )}
                            {redeemed && (
                                <span className="badge badge-gray">Resgatado</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Botões de compartilhamento */}
            <div className="space-y-3">
                <button className="btn-primary w-full" onClick={handleShare}>
                    <i className="fas fa-share-alt mr-2"></i>
                    Compartilhar Código
                </button>
                <button
                    className="btn-outline w-full"
                    onClick={() => {
                        closeModal();
                        openModal('cashback');
                    }}
                >
                    <i className="fas fa-coins mr-2"></i>
                    Ver Meus Créditos
                </button>
            </div>
        </div>
    );
}

export default IndiqueAmigoModal;
