import React from 'react';
import { useApp } from '../../context/AppContext';

function PerfilView() {
    const {
        isLoggedIn,
        userInfo,
        userSubscription,
        referralGoals,
        openModal,
        logout
    } = useApp();

    if (!isLoggedIn) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold text-primary mb-6">Perfil</h1>

                <div className="empty-state">
                    <i className="fas fa-user-circle"></i>
                    <h3>Bem-vindo à VS Barbearia</h3>
                    <p className="mb-6">Faça login ou cadastre-se para acessar seu perfil</p>

                    <div className="space-y-3 w-full max-w-xs">
                        <button
                            className="btn-primary-sm w-full"
                            onClick={() => openModal('login')}
                        >
                            <i className="fas fa-sign-in-alt mr-2"></i>
                            Entrar
                        </button>
                        <button
                            className="btn-outline-sm w-full"
                            onClick={() => openModal('cadastro')}
                        >
                            <i className="fas fa-user-plus mr-2"></i>
                            Criar Conta
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentGoal = referralGoals.find((goal, idx) =>
        userInfo.referralsMade < goal.count && !userInfo.redeemedGoals.includes(idx)
    );

    return (
        <div className="p-4">
            {/* Header do Perfil */}
            <div className="text-center mb-6">
                <div className="relative inline-block">
                    <img
                        src={userInfo.profilePic}
                        alt={userInfo.name}
                        className="avatar w-24 h-24 mx-auto"
                    />
                    <button
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                        onClick={() => openModal('trocarFoto')}
                    >
                        <i className="fas fa-camera text-black text-sm"></i>
                    </button>
                </div>
                <h2 className="text-xl font-bold mt-4">{userInfo.name}</h2>
                <p className="text-secondary">{userInfo.email}</p>

                {userSubscription && (
                    <span className="badge badge-success mt-2">
                        <i className="fas fa-crown"></i>
                        {userSubscription.plan}
                    </span>
                )}
            </div>

            {/* Card de Indicação */}
            <div
                className="info-card mb-6 cursor-pointer hover:border-primary transition-colors"
                onClick={() => openModal('indiqueAmigo')}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <i className="fas fa-gift text-xl text-primary"></i>
                        </div>
                        <div>
                            <p className="font-semibold">Indique e Ganhe</p>
                            <p className="text-sm text-secondary">
                                Você tem <span className="text-primary font-bold">{userInfo.referralCredits}</span> créditos
                            </p>
                        </div>
                    </div>
                    <i className="fas fa-chevron-right text-secondary"></i>
                </div>

                {currentGoal && (
                    <div className="mt-3">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-secondary">Próxima recompensa</span>
                            <span className="text-primary">{currentGoal.reward}</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${(userInfo.referralsMade / currentGoal.count) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-secondary mt-1">
                            {userInfo.referralsMade}/{currentGoal.count} indicações
                        </p>
                    </div>
                )}
            </div>

            {/* Menu de Opções */}
            <h3 className="text-lg font-bold mb-4">Configurações</h3>
            <div className="space-y-3">
                <button
                    className="w-full list-item justify-between"
                    onClick={() => openModal('editarPerfil')}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <i className="fas fa-user-edit text-blue-500"></i>
                        </div>
                        <span>Editar Perfil</span>
                    </div>
                    <i className="fas fa-chevron-right text-secondary"></i>
                </button>

                <button
                    className="w-full list-item justify-between"
                    onClick={() => openModal('notificacoes')}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <i className="fas fa-bell text-purple-500"></i>
                        </div>
                        <span>Notificações</span>
                    </div>
                    <i className="fas fa-chevron-right text-secondary"></i>
                </button>

                <button
                    className="w-full list-item justify-between"
                    onClick={() => openModal('formasPagamento')}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <i className="fas fa-credit-card text-green-500"></i>
                        </div>
                        <span>Formas de Pagamento</span>
                    </div>
                    <i className="fas fa-chevron-right text-secondary"></i>
                </button>

                <button
                    className="w-full list-item justify-between"
                    onClick={() => openModal('alterarPin')}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <i className="fas fa-key text-orange-500"></i>
                        </div>
                        <span>Alterar PIN</span>
                    </div>
                    <i className="fas fa-chevron-right text-secondary"></i>
                </button>

                <button
                    className="w-full list-item justify-between"
                    onClick={() => openModal('cashback')}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <i className="fas fa-coins text-primary"></i>
                        </div>
                        <span>Cashback</span>
                    </div>
                    <i className="fas fa-chevron-right text-secondary"></i>
                </button>
            </div>

            {/* Links */}
            <div className="mt-6 space-y-3">
                <button
                    className="w-full list-item justify-between"
                    onClick={() => openModal('termos')}
                >
                    <div className="flex items-center gap-3">
                        <i className="fas fa-file-contract text-secondary"></i>
                        <span className="text-secondary">Termos de Uso</span>
                    </div>
                    <i className="fas fa-chevron-right text-secondary"></i>
                </button>

                <button
                    className="w-full list-item justify-between"
                    onClick={() => openModal('faleConosco')}
                >
                    <div className="flex items-center gap-3">
                        <i className="fas fa-headset text-secondary"></i>
                        <span className="text-secondary">Fale Conosco</span>
                    </div>
                    <i className="fas fa-chevron-right text-secondary"></i>
                </button>
            </div>

            {/* Botão de Sair */}
            <button
                className="btn-danger w-full mt-8"
                onClick={logout}
            >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Sair da Conta
            </button>

            <p className="text-center text-xs text-gray-600 mt-6">
                Versão 1.0.0
            </p>
        </div>
    );
}

export default PerfilView;
