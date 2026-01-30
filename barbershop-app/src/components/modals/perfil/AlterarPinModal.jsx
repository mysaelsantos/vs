import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function AlterarPinModal() {
    const { closeModal } = useApp();
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (currentPin.length !== 4) {
            setError('PIN atual inválido');
            return;
        }
        if (newPin.length !== 4) {
            setError('Novo PIN deve ter 4 dígitos');
            return;
        }
        if (newPin !== confirmPin) {
            setError('PINs não conferem');
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-key text-3xl text-green-500"></i>
                </div>
                <h2 className="text-xl font-bold mb-2">PIN Alterado!</h2>
                <p className="text-secondary mb-6">Seu PIN foi atualizado com sucesso.</p>
                <button className="btn-primary w-full" onClick={closeModal}>
                    Fechar
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Alterar PIN</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm text-secondary mb-2 block">PIN Atual</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="****"
                        value={currentPin}
                        onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
                        maxLength={4}
                    />
                </div>

                <div>
                    <label className="text-sm text-secondary mb-2 block">Novo PIN</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="****"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
                        maxLength={4}
                    />
                </div>

                <div>
                    <label className="text-sm text-secondary mb-2 block">Confirmar Novo PIN</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="****"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
                        maxLength={4}
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <>
                            <span>Alterar PIN</span>
                            <i className="fas fa-check ml-2"></i>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default AlterarPinModal;
