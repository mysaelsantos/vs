import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function CollaboratorsPage() {
    const { barbers, units, services, addBarber, updateBarber, deleteBarber } = useAdmin();
    const [showForm, setShowForm] = useState(false);
    const [editingBarber, setEditingBarber] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [activeTab, setActiveTab] = useState('info');

    const [formData, setFormData] = useState({
        // Informações básicas
        name: '',
        email: '',
        phone: '',
        role: 'Barbeiro',
        image: 'https://i.pravatar.cc/150?img=10',
        unitId: '',
        active: true,
        // Credenciais
        password: '',
        // Horário de trabalho
        workSchedule: {
            segunda: { start: '09:00', end: '18:00', dayOff: false },
            terca: { start: '09:00', end: '18:00', dayOff: false },
            quarta: { start: '09:00', end: '18:00', dayOff: false },
            quinta: { start: '09:00', end: '18:00', dayOff: false },
            sexta: { start: '09:00', end: '18:00', dayOff: false },
            sabado: { start: '09:00', end: '17:00', dayOff: false },
            domingo: { start: '00:00', end: '00:00', dayOff: true },
        },
        // Comissões
        commissions: {
            default: 50,
            byService: {}
        }
    });

    const roles = ['Barbeiro Junior', 'Barbeiro', 'Barbeiro Senior', 'Gerente', 'Recepcionista'];
    const weekDays = [
        { id: 'segunda', label: 'Segunda' },
        { id: 'terca', label: 'Terça' },
        { id: 'quarta', label: 'Quarta' },
        { id: 'quinta', label: 'Quinta' },
        { id: 'sexta', label: 'Sexta' },
        { id: 'sabado', label: 'Sábado' },
        { id: 'domingo', label: 'Domingo' },
    ];

    const handleEdit = (barber) => {
        setEditingBarber(barber);
        setFormData({
            name: barber.name || '',
            email: barber.email || '',
            phone: barber.phone || '',
            role: barber.role || 'Barbeiro',
            image: barber.image || '',
            unitId: barber.unitId?.toString() || '',
            active: barber.active ?? true,
            password: '',
            workSchedule: barber.workSchedule || {
                segunda: { start: '09:00', end: '18:00', dayOff: false },
                terca: { start: '09:00', end: '18:00', dayOff: false },
                quarta: { start: '09:00', end: '18:00', dayOff: false },
                quinta: { start: '09:00', end: '18:00', dayOff: false },
                sexta: { start: '09:00', end: '18:00', dayOff: false },
                sabado: { start: '09:00', end: '17:00', dayOff: false },
                domingo: { start: '00:00', end: '00:00', dayOff: true },
            },
            commissions: barber.commissions || { default: 50, byService: {} }
        });
        setActiveTab('info');
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const unit = units.find(u => u.id === parseInt(formData.unitId));

        const collaboratorData = {
            ...formData,
            unitId: parseInt(formData.unitId),
            unitName: unit?.name || '',
            rating: editingBarber?.rating || 5.0,
            totalServices: editingBarber?.totalServices || 0,
        };

        // Remover senha se estiver vazia (não alterar)
        if (!collaboratorData.password) {
            delete collaboratorData.password;
        }

        if (editingBarber) {
            await updateBarber(editingBarber.id, collaboratorData);
        } else {
            // Definir senha padrão se não informada
            if (!collaboratorData.password) {
                collaboratorData.password = '1234';
            }
            await addBarber(collaboratorData);
        }

        resetForm();
    };

    const handleDelete = async (id) => {
        await deleteBarber(id);
        setShowDeleteConfirm(null);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingBarber(null);
        setActiveTab('info');
        setFormData({
            name: '',
            email: '',
            phone: '',
            role: 'Barbeiro',
            image: 'https://i.pravatar.cc/150?img=10',
            unitId: '',
            active: true,
            password: '',
            workSchedule: {
                segunda: { start: '09:00', end: '18:00', dayOff: false },
                terca: { start: '09:00', end: '18:00', dayOff: false },
                quarta: { start: '09:00', end: '18:00', dayOff: false },
                quinta: { start: '09:00', end: '18:00', dayOff: false },
                sexta: { start: '09:00', end: '18:00', dayOff: false },
                sabado: { start: '09:00', end: '17:00', dayOff: false },
                domingo: { start: '00:00', end: '00:00', dayOff: true },
            },
            commissions: { default: 50, byService: {} }
        });
    };

    const updateWorkDay = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            workSchedule: {
                ...prev.workSchedule,
                [day]: {
                    ...prev.workSchedule[day],
                    [field]: value
                }
            }
        }));
    };

    const updateServiceCommission = (serviceId, value) => {
        setFormData(prev => ({
            ...prev,
            commissions: {
                ...prev.commissions,
                byService: {
                    ...prev.commissions.byService,
                    [serviceId]: value ? parseInt(value) : null
                }
            }
        }));
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({ ...prev, password }));
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-secondary">{barbers.length} colaboradores cadastrados</p>
                    <p className="text-xs text-primary">{barbers.filter(b => b.active).length} ativos</p>
                </div>
                <button className="btn-primary py-2 px-4" onClick={() => setShowForm(true)}>
                    <i className="fas fa-plus mr-2"></i>
                    Novo Colaborador
                </button>
            </div>

            {/* Modal de confirmação de exclusão */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="admin-card p-6 w-full max-w-sm text-center">
                        <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                        <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
                        <p className="text-secondary mb-6">
                            Tem certeza que deseja excluir este colaborador? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3">
                            <button className="btn-secondary flex-1" onClick={() => setShowDeleteConfirm(null)}>
                                Cancelar
                            </button>
                            <button className="btn-primary flex-1 bg-red-600 hover:bg-red-700" onClick={() => handleDelete(showDeleteConfirm)}>
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="admin-card p-6 w-full max-w-2xl my-8">
                        <h2 className="text-xl font-bold mb-4">
                            {editingBarber ? 'Editar Colaborador' : 'Novo Colaborador'}
                        </h2>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-700 mb-6">
                            {[
                                { id: 'info', label: 'Informações', icon: 'fa-user' },
                                { id: 'schedule', label: 'Horários', icon: 'fa-clock' },
                                { id: 'commission', label: 'Comissões', icon: 'fa-percent' },
                                { id: 'access', label: 'Acesso', icon: 'fa-key' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? 'text-primary border-b-2 border-primary'
                                            : 'text-secondary hover:text-white'
                                        }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <i className={`fas ${tab.icon} mr-2`}></i>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Tab: Informações */}
                            {activeTab === 'info' && (
                                <div className="space-y-4">
                                    <div className="text-center mb-4">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="text-sm text-secondary mb-1 block">Nome Completo</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm text-secondary mb-1 block">E-mail</label>
                                            <input
                                                type="email"
                                                className="form-input"
                                                value={formData.email}
                                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                required
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
                                            <label className="text-sm text-secondary mb-1 block">Cargo</label>
                                            <select
                                                className="form-select"
                                                value={formData.role}
                                                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                            >
                                                {roles.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm text-secondary mb-1 block">Unidade</label>
                                            <select
                                                className="form-select"
                                                value={formData.unitId}
                                                onChange={(e) => setFormData(prev => ({ ...prev, unitId: e.target.value }))}
                                                required
                                            >
                                                <option value="">Selecione</option>
                                                {units.map(unit => (
                                                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-span-2">
                                            <label className="text-sm text-secondary mb-1 block">URL da Foto</label>
                                            <input
                                                type="url"
                                                className="form-input"
                                                value={formData.image}
                                                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                            />
                                        </div>

                                        <div className="col-span-2 flex items-center gap-3">
                                            <div
                                                className={`toggle-switch ${formData.active ? 'active' : ''}`}
                                                onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                                            ></div>
                                            <span className="text-sm">Colaborador Ativo</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab: Horários */}
                            {activeTab === 'schedule' && (
                                <div className="space-y-3">
                                    <p className="text-sm text-secondary mb-4">
                                        Configure os horários de trabalho para cada dia da semana.
                                    </p>
                                    {weekDays.map(day => (
                                        <div key={day.id} className="flex items-center gap-4 p-3 bg-bg-alt rounded-lg">
                                            <div className="w-24">
                                                <span className="font-medium">{day.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`toggle-switch ${!formData.workSchedule[day.id].dayOff ? 'active' : ''}`}
                                                    onClick={() => updateWorkDay(day.id, 'dayOff', !formData.workSchedule[day.id].dayOff)}
                                                ></div>
                                                <span className="text-xs text-secondary">Trabalha</span>
                                            </div>
                                            {!formData.workSchedule[day.id].dayOff && (
                                                <>
                                                    <input
                                                        type="time"
                                                        className="form-input w-32 text-sm"
                                                        value={formData.workSchedule[day.id].start}
                                                        onChange={(e) => updateWorkDay(day.id, 'start', e.target.value)}
                                                    />
                                                    <span className="text-secondary">às</span>
                                                    <input
                                                        type="time"
                                                        className="form-input w-32 text-sm"
                                                        value={formData.workSchedule[day.id].end}
                                                        onChange={(e) => updateWorkDay(day.id, 'end', e.target.value)}
                                                    />
                                                </>
                                            )}
                                            {formData.workSchedule[day.id].dayOff && (
                                                <span className="text-secondary text-sm italic">Folga</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Tab: Comissões */}
                            {activeTab === 'commission' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold">Comissão Padrão</p>
                                                <p className="text-xs text-secondary">Aplicada a todos os serviços sem comissão específica</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="form-input w-20 text-center"
                                                    min="0"
                                                    max="100"
                                                    value={formData.commissions.default}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        commissions: { ...prev.commissions, default: parseInt(e.target.value) || 0 }
                                                    }))}
                                                />
                                                <span className="text-lg">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-secondary mb-3">
                                            Comissões personalizadas por serviço (deixe em branco para usar a padrão):
                                        </p>
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                            {services.map(service => (
                                                <div key={service.id} className="flex items-center justify-between p-3 bg-bg-alt rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                                            <i className={`fas ${service.icon || 'fa-cut'} text-primary text-sm`}></i>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{service.name}</p>
                                                            <p className="text-xs text-secondary">R$ {(service.price || 0).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            className="form-input w-16 text-center text-sm"
                                                            min="0"
                                                            max="100"
                                                            placeholder={formData.commissions.default.toString()}
                                                            value={formData.commissions.byService[service.id] || ''}
                                                            onChange={(e) => updateServiceCommission(service.id, e.target.value)}
                                                        />
                                                        <span className="text-sm">%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab: Acesso */}
                            {activeTab === 'access' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-4">
                                        <div className="flex items-center gap-3">
                                            <i className="fas fa-info-circle text-blue-500 text-xl"></i>
                                            <div>
                                                <p className="font-semibold text-blue-400">Portal do Colaborador</p>
                                                <p className="text-xs text-secondary">
                                                    O colaborador poderá acessar sua agenda em:
                                                    <span className="text-primary ml-1">{window.location.origin}/#barber</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-secondary mb-1 block">E-mail de Login</label>
                                        <input
                                            type="email"
                                            className="form-input bg-bg-alt"
                                            value={formData.email}
                                            disabled
                                        />
                                        <p className="text-xs text-secondary mt-1">O e-mail será usado para login no portal</p>
                                    </div>

                                    <div>
                                        <label className="text-sm text-secondary mb-1 block">
                                            {editingBarber ? 'Nova Senha (deixe em branco para manter)' : 'Senha Inicial'}
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder={editingBarber ? '••••••••' : 'Digite a senha'}
                                                value={formData.password}
                                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                            />
                                            <button
                                                type="button"
                                                className="btn-outline px-4"
                                                onClick={generatePassword}
                                                title="Gerar senha aleatória"
                                            >
                                                <i className="fas fa-random"></i>
                                            </button>
                                        </div>
                                        {!editingBarber && (
                                            <p className="text-xs text-secondary mt-1">Se não informada, a senha padrão será "1234"</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Botões */}
                            <div className="flex gap-3 pt-6 border-t border-gray-700 mt-6">
                                <button type="button" className="btn-secondary flex-1" onClick={resetForm}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingBarber ? 'Salvar Alterações' : 'Criar Colaborador'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Grid de Colaboradores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {barbers.map(barber => (
                    <div key={barber.id} className={`admin-card p-6 text-center ${!barber.active ? 'opacity-50' : ''}`}>
                        <img
                            src={barber.image || 'https://i.pravatar.cc/150'}
                            alt={barber.name}
                            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                        />
                        <h3 className="font-bold text-lg mb-1">{barber.name}</h3>
                        <p className="text-secondary text-sm mb-2">{barber.role}</p>

                        <div className="flex items-center justify-center gap-1 text-primary mb-3">
                            <i className="fas fa-star"></i>
                            <span className="font-bold">{barber.rating || 5.0}</span>
                        </div>

                        <div className="space-y-1 text-xs text-secondary mb-4">
                            <p><i className="fas fa-location-dot mr-1"></i>{barber.unitName}</p>
                            <p><i className="fas fa-scissors mr-1"></i>{barber.totalServices || 0} atendimentos</p>
                            {barber.email && (
                                <p><i className="fas fa-envelope mr-1"></i>{barber.email}</p>
                            )}
                            <p>
                                <i className="fas fa-percent mr-1"></i>
                                Comissão: {barber.commissions?.default || 50}%
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <button
                                className="btn-outline px-3 py-2 text-sm flex-1"
                                onClick={() => handleEdit(barber)}
                            >
                                <i className="fas fa-edit mr-1"></i>
                                Editar
                            </button>
                            <button
                                className="p-2 rounded hover:bg-red-500/20 text-red-500"
                                onClick={() => setShowDeleteConfirm(barber.id)}
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CollaboratorsPage;
