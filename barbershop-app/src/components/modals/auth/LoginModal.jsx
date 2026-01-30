import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function LoginModal() {
    const { openModal, closeModal, login } = useApp();
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formatPhone = (value) => {
        const cleaned = value.replace(/\D/g, '');
        let formatted = '';
        if (cleaned.length > 0) formatted = '(' + cleaned.substring(0, 2);
        if (cleaned.length > 2) formatted += ') ' + cleaned.substring(2, 7);
        if (cleaned.length > 7) formatted += '-' + cleaned.substring(7, 11);
        return formatted;
    };

    const handlePhoneChange = (e) => {
        setPhone(formatPhone(e.target.value));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        await new Promise(resolve => setTimeout(resolve, 1500));

        if (phone.replace(/\D/g, '').length !== 11) {
            setError('Telefone inválido');
            setLoading(false);
            return;
        }

        if (pin.length !== 4) {
            setError('PIN deve ter 4 dígitos');
            setLoading(false);
            return;
        }

        login();
        closeModal();
        openModal('bemVindo');
    };

    return (
        <div className="modal-body">
            {/* Close Button */}
            <button className="modal-close-btn" onClick={closeModal}>
                <i className="fas fa-times"></i>
            </button>

            <div className="text-center mb-8 pt-4">
                <img
                    src="https://i.postimg.cc/5yBSjg1F/Bigode-3.png"
                    alt="VS Barbearia"
                    className="w-20 h-auto mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-primary">Bem-vindo de volta!</h2>
                <p className="text-secondary mt-2">Entre com seu telefone e PIN</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6">
                <div>
                    <label className="text-sm text-secondary mb-2 block">Telefone</label>
                    <input
                        type="tel"
                        className="form-input"
                        placeholder="(00) 00000-0000"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={15}
                    />
                </div>

                <div>
                    <label className="text-sm text-secondary mb-2 block">PIN</label>
                    <div className="relative">
                        <input
                            type={showPin ? 'text' : 'password'}
                            className="form-input pr-12"
                            placeholder="****"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
                            maxLength={4}
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary"
                            onClick={() => setShowPin(!showPin)}
                        >
                            <i className={`fas ${showPin ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <>
                            <span>Entrar</span>
                            <i className="fas fa-arrow-right ml-2"></i>
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    className="text-primary text-sm hover:underline"
                    onClick={() => {
                        closeModal();
                        openModal('esqueciSenha');
                    }}
                >
                    Esqueci meu PIN
                </button>
            </div>

            <div className="divider my-6 mx-6"></div>

            <div className="text-center pb-6 px-6">
                <p className="text-secondary text-sm mb-3">Não tem uma conta?</p>
                <button
                    className="btn-outline w-full"
                    onClick={() => {
                        closeModal();
                        openModal('cadastro');
                    }}
                >
                    <i className="fas fa-user-plus mr-2"></i>
                    Criar Conta
                </button>
            </div>
        </div>
    );
}

export default LoginModal;
