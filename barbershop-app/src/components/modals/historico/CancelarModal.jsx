import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function CancelarModal() {
    const { modalData, closeModal, cancelAppointment } = useApp();
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState('');

    const reasons = [
        'Imprevisto pessoal',
        'Mudança de planos',
        'Problemas de saúde',
        'Outro motivo',
    ];

    const handleConfirm = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        cancelAppointment(modalData.id);
        closeModal();
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-red-500">Cancelar Agendamento</h2>
            </div>

            <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
                </div>
                <p className="text-secondary">
                    Tem certeza que deseja cancelar este agendamento?
                </p>
                <p className="text-white font-semibold mt-2">
                    {new Date(modalData?.date).toLocaleDateString('pt-BR')} às {modalData?.time}
                </p>
            </div>

            {/* Motivo do cancelamento */}
            <div className="mb-6">
                <label className="text-sm text-secondary mb-3 block">Motivo do cancelamento (opcional)</label>
                <div className="space-y-2">
                    {reasons.map((r) => (
                        <button
                            key={r}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${reason === r
                                    ? 'bg-primary/20 border-primary text-white border'
                                    : 'bg-bg-card border border-gray-800'
                                }`}
                            onClick={() => setReason(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Warning */}
            <div className="info-card-alt mb-6 flex items-start gap-3">
                <i className="fas fa-info-circle text-yellow-500 mt-1"></i>
                <p className="text-sm text-secondary">
                    Após o cancelamento, você poderá agendar novamente quando quiser.
                    Caso tenha usado créditos do plano, eles serão restaurados.
                </p>
            </div>

            {/* Botões */}
            <div className="space-y-3">
                <button
                    className="btn-danger w-full flex items-center justify-center"
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <>
                            <span>Confirmar Cancelamento</span>
                            <i className="fas fa-times ml-2"></i>
                        </>
                    )}
                </button>
                <button className="btn-secondary w-full" onClick={closeModal}>
                    Manter Agendamento
                </button>
            </div>
        </div>
    );
}

export default CancelarModal;
