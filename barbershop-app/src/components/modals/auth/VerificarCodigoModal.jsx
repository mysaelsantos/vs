import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';

function VerificarCodigoModal() {
    const { openModal, closeModal, modalData } = useApp();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();

        const timer = setInterval(() => {
            setCountdown(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when complete
        if (newCode.every(digit => digit) && newCode.join('').length === 6) {
            handleSubmit(newCode.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCode = [...code];
        pastedData.split('').forEach((digit, i) => {
            if (i < 6) newCode[i] = digit;
        });
        setCode(newCode);
    };

    const handleSubmit = async (codeStr) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simular verificação (código é sempre válido para demo)
        closeModal();
        openModal('redefinirSenha', { phone: modalData?.phone });
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setCountdown(60);
        // Simular reenvio
        await new Promise(resolve => setTimeout(resolve, 1000));
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
                    <i className="fas fa-mobile-alt text-3xl text-primary"></i>
                </div>
                <h2 className="text-2xl font-bold text-primary">Verificação</h2>
                <p className="text-secondary mt-2">
                    Digite o código de 6 dígitos enviado para
                </p>
                <p className="text-white font-semibold">{modalData?.phone || '(XX) XXXXX-XXXX'}</p>
            </div>

            <div className="otp-container mb-6" onPaste={handlePaste}>
                {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        className="otp-input"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength={1}
                    />
                ))}
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            {loading && (
                <div className="text-center mb-4">
                    <i className="fas fa-spinner fa-spin text-primary text-2xl"></i>
                </div>
            )}

            <div className="text-center text-secondary text-sm">
                {countdown > 0 ? (
                    <p>Reenviar código em <span className="text-primary">{countdown}s</span></p>
                ) : (
                    <button
                        className="text-primary hover:underline"
                        onClick={handleResend}
                    >
                        Reenviar código
                    </button>
                )}
            </div>
        </div>
    );
}

export default VerificarCodigoModal;
