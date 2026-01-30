import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

function EditarPerfilModal() {
    const { userInfo, updateUserInfo, closeModal } = useApp();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        birthdate: userInfo.birthdate,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateUserInfo(formData);
        closeModal();
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Editar Perfil</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm text-secondary mb-2 block">Nome Completo</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="text-sm text-secondary mb-2 block">E-mail</label>
                    <input
                        type="email"
                        className="form-input"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="text-sm text-secondary mb-2 block">Telefone</label>
                    <input
                        type="tel"
                        className="form-input"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="text-sm text-secondary mb-2 block">Data de Nascimento</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.birthdate}
                        onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
                    />
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
                            <span>Salvar Alterações</span>
                            <i className="fas fa-check ml-2"></i>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default EditarPerfilModal;
