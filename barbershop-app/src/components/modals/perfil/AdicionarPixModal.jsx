import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function AdicionarPixModal() {
    const { addPaymentMethod, closeModal } = useApp();
    const [loading, setLoading] = useState(false);
    const [keyType, setKeyType] = useState('cpf');
    const [key, setKey] = useState('');

    const keyTypes = [
        { id: 'cpf', label: 'CPF', placeholder: '000.000.000-00' },
        { id: 'email', label: 'E-mail', placeholder: 'seu@email.com' },
        { id: 'phone', label: 'Telefone', placeholder: '(00) 00000-0000' },
        { id: 'random', label: 'Chave Aleatória', placeholder: 'Cole sua chave aqui' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        addPaymentMethod({
            type: 'pix',
            keyType: keyTypes.find(k => k.id === keyType)?.label,
            key,
            isDefault: false,
        });

        closeModal();
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Adicionar PIX</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm text-secondary mb-2 block">Tipo de Chave</label>
                    <div className="grid grid-cols-2 gap-2">
                        {keyTypes.map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                className={`p-3 rounded-lg text-sm font-medium transition-colors ${keyType === type.id
                                        ? 'bg-primary text-black'
                                        : 'bg-bg-card border border-gray-800'
                                    }`}
                                onClick={() => setKeyType(type.id)}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-sm text-secondary mb-2 block">Chave PIX</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder={keyTypes.find(k => k.id === keyType)?.placeholder}
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center"
                    disabled={loading || !key}
                >
                    {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <>
                            <span>Adicionar PIX</span>
                            <i className="fas fa-check ml-2"></i>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default AdicionarPixModal;
