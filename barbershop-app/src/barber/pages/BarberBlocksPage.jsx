import React, { useState } from 'react';
import { useBarber } from '../context/BarberContext';

function BarberBlocksPage() {
    const { blocks, addBlock, removeBlock } = useBarber();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [formData, setFormData] = useState({
        type: 'break',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        reason: '',
        allDay: false
    });

    const blockTypes = [
        { id: 'break', label: 'Intervalo', icon: 'fa-coffee', color: 'text-yellow-500' },
        { id: 'dayoff', label: 'Folga', icon: 'fa-umbrella-beach', color: 'text-blue-500' },
        { id: 'vacation', label: 'Férias', icon: 'fa-plane', color: 'text-green-500' },
        { id: 'sick', label: 'Atestado', icon: 'fa-briefcase-medical', color: 'text-red-500' },
        { id: 'personal', label: 'Pessoal', icon: 'fa-user', color: 'text-purple-500' },
    ];

    const statusLabels = {
        pending: { label: 'Aguardando', class: 'badge-warning' },
        approved: { label: 'Aprovado', class: 'badge-success' },
        rejected: { label: 'Rejeitado', class: 'badge-danger' }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await addBlock({
            ...formData,
            startDate: formData.startDate,
            endDate: formData.endDate || formData.startDate,
            startTime: formData.allDay ? null : formData.startTime,
            endTime: formData.allDay ? null : formData.endTime
        });

        if (result.success) {
            setShowForm(false);
            setFormData({
                type: 'break',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                reason: '',
                allDay: false
            });
        }
        setLoading(false);
    };

    const handleDelete = async (blockId) => {
        if (!confirm('Tem certeza que deseja remover este bloqueio?')) return;

        setDeleting(blockId);
        await removeBlock(blockId);
        setDeleting(null);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getBlockType = (typeId) => blockTypes.find(t => t.id === typeId) || blockTypes[0];

    // Separar bloqueios futuros e passados
    const today = new Date().toISOString().split('T')[0];
    const futureBlocks = blocks.filter(b => b.endDate >= today || b.startDate >= today);
    const pastBlocks = blocks.filter(b => b.endDate < today && b.startDate < today);

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-secondary">{blocks.length} bloqueios cadastrados</p>
                </div>
                <button className="btn-primary py-2 px-4" onClick={() => setShowForm(true)}>
                    <i className="fas fa-plus mr-2"></i>
                    Novo Bloqueio
                </button>
            </div>

            {/* Modal de formulário */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
                    <div className="admin-card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">
                            <i className="fas fa-clock mr-2 text-primary"></i>
                            Novo Bloqueio
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Tipo de bloqueio */}
                            <div>
                                <label className="text-sm text-secondary mb-2 block">Tipo</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {blockTypes.map(type => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${formData.type === type.id
                                                    ? 'bg-primary text-black'
                                                    : 'bg-bg-alt hover:bg-primary/20'
                                                }`}
                                            onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                                        >
                                            <i className={`fas ${type.icon} ${formData.type !== type.id ? type.color : ''}`}></i>
                                            <span className="text-xs">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dia inteiro */}
                            <div className="flex items-center gap-3">
                                <div
                                    className={`toggle-switch ${formData.allDay ? 'active' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, allDay: !prev.allDay }))}
                                ></div>
                                <span className="text-sm">Dia inteiro</span>
                            </div>

                            {/* Datas */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-secondary mb-1 block">Data início</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-secondary mb-1 block">Data fim</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                        min={formData.startDate}
                                    />
                                </div>
                            </div>

                            {/* Horários (se não for dia inteiro) */}
                            {!formData.allDay && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-secondary mb-1 block">Horário início</label>
                                        <input
                                            type="time"
                                            className="form-input"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                            required={!formData.allDay}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-secondary mb-1 block">Horário fim</label>
                                        <input
                                            type="time"
                                            className="form-input"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                            required={!formData.allDay}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Motivo */}
                            <div>
                                <label className="text-sm text-secondary mb-1 block">Motivo (opcional)</label>
                                <textarea
                                    className="form-input min-h-[80px]"
                                    placeholder="Descreva o motivo do bloqueio..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                                />
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3 pt-4">
                                <button type="button" className="btn-secondary flex-1" onClick={() => setShowForm(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                                    {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Solicitar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lista de bloqueios */}
            {blocks.length === 0 ? (
                <div className="admin-card p-12 text-center">
                    <i className="fas fa-calendar-check text-5xl text-secondary/30 mb-4"></i>
                    <h3 className="text-lg font-semibold mb-2">Nenhum bloqueio</h3>
                    <p className="text-secondary text-sm">Você não tem nenhum bloqueio de horário cadastrado.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Bloqueios ativos/futuros */}
                    {futureBlocks.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">
                                <i className="fas fa-clock mr-2 text-primary"></i>
                                Próximos Bloqueios
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {futureBlocks.map(block => {
                                    const type = getBlockType(block.type);
                                    const status = statusLabels[block.status] || statusLabels.pending;

                                    return (
                                        <div key={block.id} className="admin-card p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg bg-bg-alt flex items-center justify-center ${type.color}`}>
                                                        <i className={`fas ${type.icon}`}></i>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{type.label}</h4>
                                                        <span className={`badge ${status.class} text-xs`}>{status.label}</span>
                                                    </div>
                                                </div>

                                                {block.status === 'pending' && (
                                                    <button
                                                        className="p-2 rounded hover:bg-red-500/20 text-red-500"
                                                        onClick={() => handleDelete(block.id)}
                                                        disabled={deleting === block.id}
                                                    >
                                                        {deleting === block.id ? (
                                                            <i className="fas fa-spinner fa-spin"></i>
                                                        ) : (
                                                            <i className="fas fa-trash"></i>
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="text-sm text-secondary space-y-1">
                                                <p>
                                                    <i className="fas fa-calendar mr-2 w-4"></i>
                                                    {formatDate(block.startDate)}
                                                    {block.endDate && block.endDate !== block.startDate && (
                                                        <> até {formatDate(block.endDate)}</>
                                                    )}
                                                </p>
                                                {block.startTime && (
                                                    <p>
                                                        <i className="fas fa-clock mr-2 w-4"></i>
                                                        {block.startTime} - {block.endTime}
                                                    </p>
                                                )}
                                                {block.reason && (
                                                    <p className="mt-2 text-xs italic">"{block.reason}"</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Histórico */}
                    {pastBlocks.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-secondary">
                                <i className="fas fa-history mr-2"></i>
                                Histórico
                            </h3>
                            <div className="admin-card overflow-hidden opacity-60">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Tipo</th>
                                            <th>Período</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pastBlocks.slice(0, 10).map(block => {
                                            const type = getBlockType(block.type);
                                            const status = statusLabels[block.status] || statusLabels.pending;
                                            return (
                                                <tr key={block.id}>
                                                    <td>
                                                        <span className={type.color}>
                                                            <i className={`fas ${type.icon} mr-2`}></i>
                                                            {type.label}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(block.startDate)}</td>
                                                    <td><span className={`badge ${status.class}`}>{status.label}</span></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default BarberBlocksPage;
