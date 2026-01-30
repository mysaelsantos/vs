import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function AdicionarCartaoModal() {
    const { addPaymentMethod, closeModal } = useApp();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: '',
    });

    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const groups = cleaned.match(/.{1,4}/g);
        return groups ? groups.join(' ') : '';
    };

    const formatExpiry = (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        }
        return cleaned;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        addPaymentMethod({
            type: 'credit',
            brand: 'Mastercard',
            last4: formData.number.replace(/\s/g, '').slice(-4),
            expiry: formData.expiry,
            isDefault: false,
        });

        closeModal();
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Adicionar Cartão</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {/* Preview do Cartão */}
            <div className="credit-card mb-6">
                <div className="flex justify-between items-start">
                    <i className="fas fa-wifi text-xl text-white/60 rotate-90"></i>
                    <i className="fab fa-cc-mastercard text-3xl text-white/60"></i>
                </div>
                <div className="mt-8">
                    <p className="text-lg tracking-widest text-white/80">
                        {formData.number || '•••• •••• •••• ••••'}
                    </p>
                </div>
                <div className="flex justify-between items-end mt-4">
                    <div>
                        <p className="text-xs text-white/40">Nome</p>
                        <p className="text-sm text-white/80 uppercase">
                            {formData.name || 'SEU NOME'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-white/40">Validade</p>
                        <p className="text-sm text-white/80">{formData.expiry || 'MM/AA'}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm text-secondary mb-2 block">Número do Cartão</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="0000 0000 0000 0000"
                        value={formData.number}
                        onChange={(e) => setFormData(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                        maxLength={19}
                    />
                </div>

                <div>
                    <label className="text-sm text-secondary mb-2 block">Nome no Cartão</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Como está no cartão"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-secondary mb-2 block">Validade</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="MM/AA"
                            value={formData.expiry}
                            onChange={(e) => setFormData(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                            maxLength={5}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-secondary mb-2 block">CVV</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="***"
                            value={formData.cvv}
                            onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) }))}
                            maxLength={3}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <>
                            <span>Adicionar Cartão</span>
                            <i className="fas fa-check ml-2"></i>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default AdicionarCartaoModal;
