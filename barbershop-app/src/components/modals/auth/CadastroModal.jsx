import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function CadastroModal() {
    const { openModal, closeModal, login } = useApp();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        birthdate: '',
        pin: '',
        confirmPin: '',
    });
    const [error, setError] = useState('');

    const formatPhone = (value) => {
        const cleaned = value.replace(/\D/g, '');
        let formatted = '';
        if (cleaned.length > 0) formatted = '(' + cleaned.substring(0, 2);
        if (cleaned.length > 2) formatted += ') ' + cleaned.substring(2, 7);
        if (cleaned.length > 7) formatted += '-' + cleaned.substring(7, 11);
        return formatted;
    };

    const formatDate = (value) => {
        const cleaned = value.replace(/\D/g, '');
        let formatted = '';
        if (cleaned.length > 0) formatted = cleaned.substring(0, 2);
        if (cleaned.length > 2) formatted += '/' + cleaned.substring(2, 4);
        if (cleaned.length > 4) formatted += '/' + cleaned.substring(4, 8);
        return formatted;
    };

    const handleChange = (field, value) => {
        if (field === 'phone') value = formatPhone(value);
        if (field === 'birthdate') value = formatDate(value);
        if (field === 'pin' || field === 'confirmPin') value = value.replace(/\D/g, '').substring(0, 4);

        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateStep1 = () => {
        if (!formData.name.trim()) return 'Nome é obrigatório';
        if (formData.phone.replace(/\D/g, '').length !== 11) return 'Telefone inválido';
        if (!formData.email.includes('@')) return 'E-mail inválido';
        return null;
    };

    const validateStep2 = () => {
        if (formData.birthdate.length !== 10) return 'Data de nascimento inválida';
        if (formData.pin.length !== 4) return 'PIN deve ter 4 dígitos';
        if (formData.pin !== formData.confirmPin) return 'PINs não conferem';
        return null;
    };

    const handleNext = () => {
        const err = validateStep1();
        if (err) {
            setError(err);
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validateStep2();
        if (err) {
            setError(err);
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        login();
        closeModal();
        openModal('bemVindo');
    };

    return (
        <div className="p-6 pt-2">
            {/* Botão de voltar (só aparece no step 2) */}
            {step === 2 && (
                <button
                    className="flex items-center gap-2 text-secondary mb-4 hover:text-white transition-colors"
                    onClick={() => setStep(1)}
                >
                    <i className="fas fa-arrow-left"></i>
                    <span>Voltar</span>
                </button>
            )}

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary">Criar Conta</h2>
                <p className="text-secondary mt-2">
                    {step === 1 ? 'Preencha seus dados pessoais' : 'Defina sua segurança'}
                </p>

                {/* Progress Indicator */}
                <div className="flex justify-center gap-2 mt-4">
                    <div className={`w-8 h-1 rounded ${step >= 1 ? 'bg-primary' : 'bg-gray-700'}`}></div>
                    <div className={`w-8 h-1 rounded ${step >= 2 ? 'bg-primary' : 'bg-gray-700'}`}></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 ? (
                    <>
                        <div>
                            <label className="text-sm text-secondary mb-2 block">Nome Completo</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Seu nome completo"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-secondary mb-2 block">Telefone</label>
                            <input
                                type="tel"
                                className="form-input"
                                placeholder="(00) 00000-0000"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                maxLength={15}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-secondary mb-2 block">E-mail</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="button"
                            className="btn-primary w-full"
                            onClick={handleNext}
                        >
                            Continuar
                            <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="text-sm text-secondary mb-2 block">Data de Nascimento</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="DD/MM/AAAA"
                                value={formData.birthdate}
                                onChange={(e) => handleChange('birthdate', e.target.value)}
                                maxLength={10}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-secondary mb-2 block">Criar PIN (4 dígitos)</label>
                            <input
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="form-input"
                                placeholder="****"
                                value={formData.pin}
                                onChange={(e) => handleChange('pin', e.target.value)}
                                maxLength={4}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-secondary mb-2 block">Confirmar PIN</label>
                            <input
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="form-input"
                                placeholder="****"
                                value={formData.confirmPin}
                                onChange={(e) => handleChange('confirmPin', e.target.value)}
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
                                    <span>Criar Conta</span>
                                    <i className="fas fa-check ml-2"></i>
                                </>
                            )}
                        </button>
                    </>
                )}
            </form>

            <div className="divider my-6"></div>

            <div className="text-center">
                <p className="text-secondary text-sm mb-3">Já tem uma conta?</p>
                <button
                    className="text-primary hover:underline"
                    onClick={() => {
                        closeModal();
                        openModal('login');
                    }}
                >
                    Fazer Login
                </button>
            </div>
        </div>
    );
}

export default CadastroModal;
