import React from 'react';
import { useApp } from '../../../context/AppContext';

function FormasPagamentoModal() {
    const { paymentMethods, setDefaultPaymentMethod, removePaymentMethod, closeModal, openModal } = useApp();

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Formas de Pagamento</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {/* Lista de métodos */}
            {paymentMethods.length > 0 ? (
                <div className="space-y-3 mb-6">
                    {paymentMethods.map((method) => (
                        <div key={method.id} className="info-card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {method.type === 'credit' ? (
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                            <i className="fab fa-cc-mastercard text-xl text-white"></i>
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center">
                                            <i className="fab fa-pix text-xl text-white"></i>
                                        </div>
                                    )}
                                    <div>
                                        {method.type === 'credit' ? (
                                            <>
                                                <p className="font-semibold text-white">{method.brand} •••• {method.last4}</p>
                                                <p className="text-sm text-secondary">Expira em {method.expiry}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-semibold text-white">PIX - {method.keyType}</p>
                                                <p className="text-sm text-secondary">{method.key}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {method.isDefault && (
                                        <span className="badge badge-success text-xs">Padrão</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                {!method.isDefault && (
                                    <button
                                        className="btn-secondary text-xs py-2 px-3 flex-1"
                                        onClick={() => setDefaultPaymentMethod(method.id)}
                                    >
                                        Definir como Padrão
                                    </button>
                                )}
                                <button
                                    className="text-red-500 text-sm py-2 px-3"
                                    onClick={() => removePaymentMethod(method.id)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state mb-6">
                    <i className="fas fa-credit-card"></i>
                    <h3>Nenhuma forma de pagamento</h3>
                    <p>Adicione um cartão ou chave PIX</p>
                </div>
            )}

            {/* Adicionar novo */}
            <div className="space-y-3">
                <button
                    className="btn-secondary w-full"
                    onClick={() => {
                        closeModal();
                        openModal('adicionarCartao');
                    }}
                >
                    <i className="fas fa-credit-card mr-2"></i>
                    Adicionar Cartão
                </button>
                <button
                    className="btn-secondary w-full"
                    onClick={() => {
                        closeModal();
                        openModal('adicionarPix');
                    }}
                >
                    <i className="fab fa-pix mr-2"></i>
                    Adicionar PIX
                </button>
            </div>
        </div>
    );
}

export default FormasPagamentoModal;
