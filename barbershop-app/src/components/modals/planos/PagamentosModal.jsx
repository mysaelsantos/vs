import React from 'react';
import { useApp } from '../../../context/AppContext';

function PagamentosModal() {
    const { paymentHistory, closeModal } = useApp();

    const getStatusBadge = (status) => {
        const badges = {
            paid: { class: 'badge-success', text: 'Pago' },
            pending: { class: 'badge-warning', text: 'Pendente' },
            failed: { class: 'badge-danger', text: 'Falhou' },
        };
        return badges[status] || badges.pending;
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Histórico de Pagamentos</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {paymentHistory.length > 0 ? (
                <div className="space-y-3">
                    {paymentHistory.map((payment) => {
                        const statusBadge = getStatusBadge(payment.status);
                        return (
                            <div key={payment.id} className="info-card">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-white">{payment.description}</h4>
                                        <p className="text-sm text-secondary">{payment.date}</p>
                                    </div>
                                    <span className={`badge ${statusBadge.class}`}>
                                        {statusBadge.text}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-secondary">
                                        <i className="fas fa-credit-card mr-1"></i>
                                        {payment.method}
                                    </span>
                                    <span className="text-lg font-bold text-primary">
                                        R$ {payment.amount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <i className="fas fa-receipt"></i>
                    <h3>Nenhum pagamento encontrado</h3>
                    <p>Seus pagamentos aparecerão aqui</p>
                </div>
            )}
        </div>
    );
}

export default PagamentosModal;
