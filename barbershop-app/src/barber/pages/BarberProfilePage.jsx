import React, { useState } from 'react';
import { useBarber } from '../context/BarberContext';

function BarberProfilePage() {
    const { barber, updateProfile, changePassword, earnings, appointments } = useBarber();
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: barber?.name || '',
        phone: barber?.phone || '',
        image: barber?.image || ''
    });

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    // Estatísticas do barbeiro
    const stats = {
        totalServices: appointments.filter(a => a.status === 'completed').length,
        rating: barber?.rating || 5.0,
        monthlyEarnings: earnings?.month || 0,
        commission: earnings?.commission || 0
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        const success = await updateProfile(formData);

        if (success) {
            setEditing(false);
            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        } else {
            setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
        }
        setLoading(false);
    };

    const handleChangePassword = async () => {
        if (passwordData.new !== passwordData.confirm) {
            setMessage({ type: 'error', text: 'As senhas não coincidem.' });
            return;
        }

        if (passwordData.new.length < 4) {
            setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 4 caracteres.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        const result = await changePassword(passwordData.current, passwordData.new);

        if (result.success) {
            setChangingPassword(false);
            setPasswordData({ current: '', new: '', confirm: '' });
            setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        setLoading(false);
    };

    return (
        <div className="admin-page max-w-2xl">
            {/* Mensagem de feedback */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                    {message.text}
                </div>
            )}

            {/* Card do perfil */}
            <div className="admin-card p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    {/* Avatar */}
                    <div className="relative">
                        {barber?.image ? (
                            <img
                                src={barber.image}
                                alt={barber.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary">
                                <i className="fas fa-user text-3xl text-primary"></i>
                            </div>
                        )}
                        {editing && (
                            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center">
                                <i className="fas fa-camera text-sm"></i>
                            </button>
                        )}
                    </div>

                    {/* Info principal */}
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl font-bold">{barber?.name}</h2>
                        <p className="text-secondary">{barber?.role || 'Barbeiro'}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                            <div className="flex items-center gap-1 text-yellow-500">
                                <i className="fas fa-star"></i>
                                <span className="font-bold">{stats.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-secondary">•</span>
                            <span className="text-secondary">{stats.totalServices} atendimentos</span>
                        </div>
                    </div>

                    {/* Botão editar */}
                    {!editing && (
                        <button
                            className="btn-outline px-4 py-2"
                            onClick={() => setEditing(true)}
                        >
                            <i className="fas fa-edit mr-2"></i>
                            Editar
                        </button>
                    )}
                </div>

                {/* Formulário de edição */}
                {editing && (
                    <div className="border-t border-gray-800 pt-6 space-y-4">
                        <div>
                            <label className="text-sm text-secondary mb-1 block">Nome</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-secondary mb-1 block">Telefone</label>
                            <input
                                type="tel"
                                className="form-input"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-secondary mb-1 block">URL da Foto</label>
                            <input
                                type="url"
                                className="form-input"
                                placeholder="https://..."
                                value={formData.image}
                                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                className="btn-secondary flex-1"
                                onClick={() => {
                                    setEditing(false);
                                    setFormData({
                                        name: barber?.name || '',
                                        phone: barber?.phone || '',
                                        image: barber?.image || ''
                                    });
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-primary flex-1"
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
                                {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Salvar'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="admin-card p-4 text-center">
                    <i className="fas fa-cut text-2xl text-primary mb-2"></i>
                    <p className="text-2xl font-bold">{stats.totalServices}</p>
                    <p className="text-xs text-secondary">Atendimentos</p>
                </div>
                <div className="admin-card p-4 text-center">
                    <i className="fas fa-star text-2xl text-yellow-500 mb-2"></i>
                    <p className="text-2xl font-bold">{stats.rating.toFixed(1)}</p>
                    <p className="text-xs text-secondary">Avaliação</p>
                </div>
                <div className="admin-card p-4 text-center">
                    <i className="fas fa-coins text-2xl text-green-500 mb-2"></i>
                    <p className="text-2xl font-bold">R$ {stats.monthlyEarnings.toFixed(0)}</p>
                    <p className="text-xs text-secondary">Faturamento Mês</p>
                </div>
                <div className="admin-card p-4 text-center">
                    <i className="fas fa-wallet text-2xl text-blue-500 mb-2"></i>
                    <p className="text-2xl font-bold">R$ {stats.commission.toFixed(0)}</p>
                    <p className="text-xs text-secondary">Comissão Mês</p>
                </div>
            </div>

            {/* Segurança */}
            <div className="admin-card p-6">
                <h3 className="font-bold mb-4">
                    <i className="fas fa-shield-alt text-primary mr-2"></i>
                    Segurança
                </h3>

                {!changingPassword ? (
                    <button
                        className="btn-outline w-full py-3"
                        onClick={() => setChangingPassword(true)}
                    >
                        <i className="fas fa-key mr-2"></i>
                        Alterar Senha
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-secondary mb-1 block">Senha Atual</label>
                            <input
                                type="password"
                                className="form-input"
                                value={passwordData.current}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-secondary mb-1 block">Nova Senha</label>
                            <input
                                type="password"
                                className="form-input"
                                value={passwordData.new}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-secondary mb-1 block">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                className="form-input"
                                value={passwordData.confirm}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                className="btn-secondary flex-1"
                                onClick={() => {
                                    setChangingPassword(false);
                                    setPasswordData({ current: '', new: '', confirm: '' });
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-primary flex-1"
                                onClick={handleChangePassword}
                                disabled={loading}
                            >
                                {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Alterar'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Info de conta */}
            <div className="admin-card p-4 mt-6 text-sm text-secondary">
                <p><strong>Email:</strong> {barber?.email}</p>
                <p><strong>Unidade:</strong> {barber?.unitName || 'Não definida'}</p>
                <p><strong>Comissão:</strong> {barber?.commissions?.default || 50}%</p>
            </div>
        </div>
    );
}

export default BarberProfilePage;
