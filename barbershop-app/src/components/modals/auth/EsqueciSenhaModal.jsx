import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function EsqueciSenhaModal() {
    const { openModal, closeModal } = useApp();
    const [phone, setPhone] = useState('');
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (phone.replace(/\D/g, '').length !== 11) {
            setError('Telefone inválido');
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        closeModal();
        openModal('verificarCodigo', { phone });
    };

    return (
        <div className="p-6">
            <div className="modal-header mb-6">
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-arrow-left"></i>
                </button>
            </div>

            <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-lock text-3xl text-primary"></i>
                </div>
                <h2 className="text-2xl font-bold text-primary">Esqueceu seu PIN?</h2>
                <p className="text-secondary mt-2">
                    Informe seu telefone cadastrado. Enviaremos um código de verificação.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm text-secondary mb-2 block">Telefone Cadastrado</label>
                    <input
                        type="tel"
                        className="form-input"
                        placeholder="(00) 00000-0000"
                        value={phone}
                        onChange={(e) => {
                            setPhone(formatPhone(e.target.value));
                            setError('');
                        }}
                        maxLength={15}
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center"
                    disabled={loading || phone.replace(/\D/g, '').length !== 11}
                >
                    {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <>
                            <span>Enviar Código</span>
                            <i className="fas fa-paper-plane ml-2"></i>
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    className="text-primary text-sm hover:underline"
                    onClick={() => {
                        closeModal();
                        openModal('login');
                    }}
                >
                    Voltar ao Login
                </button>
            </div>
        </div>
    );
}

export default EsqueciSenhaModal;
