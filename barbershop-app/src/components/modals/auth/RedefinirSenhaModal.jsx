import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function RedefinirSenhaModal() {
    const { openModal, closeModal } = useApp();
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPin, setShowPin] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (pin.length !== 4) {
            setError('PIN deve ter 4 dígitos');
            return;
        }

        if (pin !== confirmPin) {
            setError('PINs não conferem');
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        closeModal();
        // Mostrar sucesso e ir para login
        openModal('login');
    };

    return (
        <div className="p-6">
            <div className="modal-header mb-6">
            </div>

            <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-key text-3xl text-green-500"></i>
                </div>
                <h2 className="text-2xl font-bold text-primary">Novo PIN</h2>
                <p className="text-secondary mt-2">
                    Crie um novo PIN de 4 dígitos para sua conta
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm text-secondary mb-2 block">Novo PIN</label>
                    <div className="relative">
                        <input
                            type={showPin ? 'text' : 'password'}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="form-input pr-12"
                            placeholder="****"
                            value={pin}
                            onChange={(e) => {
                                setPin(e.target.value.replace(/\D/g, '').substring(0, 4));
                                setError('');
                            }}
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

                <div>
                    <label className="text-sm text-secondary mb-2 block">Confirmar PIN</label>
                    <input
                        type={showPin ? 'text' : 'password'}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="form-input"
                        placeholder="****"
                        value={confirmPin}
                        onChange={(e) => {
                            setConfirmPin(e.target.value.replace(/\D/g, '').substring(0, 4));
                            setError('');
                        }}
                        maxLength={4}
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center"
                    disabled={loading || pin.length !== 4 || confirmPin.length !== 4}
                >
                    {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <>
                            <span>Salvar PIN</span>
                            <i className="fas fa-check ml-2"></i>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default RedefinirSenhaModal;
