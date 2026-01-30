import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

function FaleConoscoModal() {
    const { closeModal } = useApp();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const subjects = [
        'Dúvidas sobre agendamento',
        'Problema com plano',
        'Sugestão de melhoria',
        'Reclamação',
        'Outro assunto',
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check-circle text-3xl text-green-500"></i>
                </div>
                <h2 className="text-xl font-bold mb-2">Mensagem Enviada!</h2>
                <p className="text-secondary mb-6">
                    Responderemos em até 24 horas úteis.
                </p>
                <button className="btn-primary w-full" onClick={closeModal}>
                    Fechar
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Fale Conosco</h2>
            </div>

            {/* Canais de contato */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-card-alt text-center py-4"
                >
                    <i className="fab fa-whatsapp text-2xl text-green-500 mb-2"></i>
                    <p className="text-xs">WhatsApp</p>
                </a>
                <a
                    href="mailto:contato@vsbarbearia.com"
                    className="info-card-alt text-center py-4"
                >
                    <i className="fas fa-envelope text-2xl text-blue-500 mb-2"></i>
                    <p className="text-xs">E-mail</p>
                </a>
                <a
                    href="https://instagram.com/vsbarbearia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-card-alt text-center py-4"
                >
                    <i className="fab fa-instagram text-2xl text-pink-500 mb-2"></i>
                    <p className="text-xs">Instagram</p>
                </a>
            </div>

            <div className="divider mb-6"></div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm text-secondary mb-2 block">Assunto</label>
                    <select
                        className="form-select"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    >
                        <option value="">Selecione um assunto</option>
                        {subjects.map((s, idx) => (
                            <option key={idx} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm text-secondary mb-2 block">Mensagem</label>
                    <textarea
                        className="form-input h-32 resize-none"
                        placeholder="Descreva sua dúvida, sugestão ou problema..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center"
                    disabled={loading || !subject || !message}
                >
                    {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <>
                            <span>Enviar Mensagem</span>
                            <i className="fas fa-paper-plane ml-2"></i>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default FaleConoscoModal;
