import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';

function SettingsPage() {
    const { settings, saveSettings, seedDatabase, loadingStates } = useAdmin();
    const [localSettings, setLocalSettings] = useState(null);
    const [saving, setSaving] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (settings) {
            setLocalSettings(settings);
        }
    }, [settings]);

    const handleChange = (section, field, value) => {
        setLocalSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSimpleChange = (field, value) => {
        setLocalSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleWorkingHoursChange = (day, field, value) => {
        setLocalSettings(prev => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: {
                    ...prev.workingHours[day],
                    [field]: value
                }
            }
        }));
    };

    const handleSave = async (section) => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        const dataToSave = section ? { [section]: localSettings[section] } : localSettings;
        const success = await saveSettings(dataToSave);

        if (success) {
            setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        } else {
            setMessage({ type: 'error', text: 'Erro ao salvar configurações.' });
        }
        setSaving(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleSeedDatabase = async () => {
        if (!confirm('Isso irá criar dados iniciais no banco. Continuar?')) return;

        setSeeding(true);
        const result = await seedDatabase();
        setSeeding(false);

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    if (!localSettings) {
        return (
            <div className="admin-page flex items-center justify-center">
                <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
            </div>
        );
    }

    const days = [
        { key: 'segunda', label: 'Segunda' },
        { key: 'terca', label: 'Terça' },
        { key: 'quarta', label: 'Quarta' },
        { key: 'quinta', label: 'Quinta' },
        { key: 'sexta', label: 'Sexta' },
        { key: 'sabado', label: 'Sábado' },
        { key: 'domingo', label: 'Domingo' },
    ];

    return (
        <div className="admin-page">
            {/* Mensagem de feedback */}
            {message.text && (
                <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informações do Negócio */}
                <div className="admin-card p-6">
                    <h3 className="font-bold text-lg mb-4">
                        <i className="fas fa-building mr-2 text-primary"></i>
                        Informações do Negócio
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-secondary mb-1 block">Nome do Estabelecimento</label>
                            <input
                                type="text"
                                className="form-input"
                                value={localSettings.businessName || ''}
                                onChange={(e) => handleSimpleChange('businessName', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-secondary mb-1 block">CNPJ</label>
                            <input
                                type="text"
                                className="form-input"
                                value={localSettings.cnpj || ''}
                                onChange={(e) => handleSimpleChange('cnpj', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-secondary mb-1 block">E-mail de Contato</label>
                            <input
                                type="email"
                                className="form-input"
                                value={localSettings.email || ''}
                                onChange={(e) => handleSimpleChange('email', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-secondary mb-1 block">WhatsApp</label>
                            <input
                                type="text"
                                className="form-input"
                                value={localSettings.whatsapp || ''}
                                onChange={(e) => handleSimpleChange('whatsapp', e.target.value)}
                            />
                        </div>
                        <button
                            className="btn-primary w-full"
                            onClick={() => handleSave()}
                            disabled={saving}
                        >
                            {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>

                {/* Horários de Funcionamento */}
                <div className="admin-card p-6">
                    <h3 className="font-bold text-lg mb-4">
                        <i className="fas fa-clock mr-2 text-primary"></i>
                        Horários de Funcionamento
                    </h3>
                    <div className="space-y-3">
                        {days.map((day) => (
                            <div key={day.key} className="flex items-center justify-between p-3 bg-bg-alt rounded-lg">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={!localSettings.workingHours?.[day.key]?.closed}
                                        onChange={(e) => handleWorkingHoursChange(day.key, 'closed', !e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <span className={localSettings.workingHours?.[day.key]?.closed ? 'text-secondary' : ''}>
                                        {day.label}
                                    </span>
                                </div>
                                {localSettings.workingHours?.[day.key]?.closed ? (
                                    <span className="text-secondary">Fechado</span>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            className="form-input py-1 px-2 w-24 text-sm"
                                            value={localSettings.workingHours?.[day.key]?.open || '09:00'}
                                            onChange={(e) => handleWorkingHoursChange(day.key, 'open', e.target.value)}
                                        />
                                        <span className="text-secondary">às</span>
                                        <input
                                            type="time"
                                            className="form-input py-1 px-2 w-24 text-sm"
                                            value={localSettings.workingHours?.[day.key]?.close || '20:00'}
                                            onChange={(e) => handleWorkingHoursChange(day.key, 'close', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        className="btn-primary w-full mt-4"
                        onClick={() => handleSave('workingHours')}
                        disabled={saving}
                    >
                        {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Salvar Horários'}
                    </button>
                </div>

                {/* REGRAS DE AGENDAMENTO */}
                <div className="admin-card p-6">
                    <h3 className="font-bold text-lg mb-4">
                        <i className="fas fa-calendar-check mr-2 text-primary"></i>
                        Regras de Agendamento
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-secondary mb-1 block">
                                    Antecedência mínima (horas)
                                </label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="0"
                                    value={localSettings.appointmentRules?.minAdvanceHours || 2}
                                    onChange={(e) => handleChange('appointmentRules', 'minAdvanceHours', parseInt(e.target.value))}
                                />
                                <p className="text-xs text-secondary mt-1">Para agendar</p>
                            </div>
                            <div>
                                <label className="text-sm text-secondary mb-1 block">
                                    Antecedência máxima (dias)
                                </label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="1"
                                    value={localSettings.appointmentRules?.maxAdvanceDays || 30}
                                    onChange={(e) => handleChange('appointmentRules', 'maxAdvanceDays', parseInt(e.target.value))}
                                />
                                <p className="text-xs text-secondary mt-1">Para agendar</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-secondary mb-1 block">
                                    Cancelar com antecedência (horas)
                                </label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="0"
                                    value={localSettings.appointmentRules?.cancelMinHours || 2}
                                    onChange={(e) => handleChange('appointmentRules', 'cancelMinHours', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-secondary mb-1 block">
                                    Remarcar com antecedência (horas)
                                </label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="0"
                                    value={localSettings.appointmentRules?.rescheduleMinHours || 4}
                                    onChange={(e) => handleChange('appointmentRules', 'rescheduleMinHours', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-secondary mb-1 block">
                                    Máx. agendamentos/dia por cliente
                                </label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="1"
                                    value={localSettings.appointmentRules?.maxAppointmentsPerDay || 2}
                                    onChange={(e) => handleChange('appointmentRules', 'maxAppointmentsPerDay', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-secondary mb-1 block">
                                    Máx. cancelamentos/mês
                                </label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="0"
                                    value={localSettings.appointmentRules?.maxCancellationsPerMonth || 3}
                                    onChange={(e) => handleChange('appointmentRules', 'maxCancellationsPerMonth', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-secondary mb-1 block">
                                    Penalidade por falta (dias bloqueado)
                                </label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="0"
                                    value={localSettings.appointmentRules?.noShowPenaltyDays || 7}
                                    onChange={(e) => handleChange('appointmentRules', 'noShowPenaltyDays', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-secondary mb-1 block">
                                    Duração do slot (minutos)
                                </label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="15"
                                    step="15"
                                    value={localSettings.appointmentRules?.slotDuration || 30}
                                    onChange={(e) => handleChange('appointmentRules', 'slotDuration', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <button
                            className="btn-primary w-full"
                            onClick={() => handleSave('appointmentRules')}
                            disabled={saving}
                        >
                            {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Salvar Regras de Agendamento'}
                        </button>
                    </div>
                </div>

                {/* REGRAS DE CASHBACK */}
                <div className="admin-card p-6">
                    <h3 className="font-bold text-lg mb-4">
                        <i className="fas fa-coins mr-2 text-primary"></i>
                        Regras de Cashback
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-bg-alt rounded-lg">
                            <div>
                                <p className="font-semibold">Cashback Ativo</p>
                                <p className="text-sm text-secondary">Clientes acumulam cashback nas compras</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={localSettings.cashbackRules?.enabled || false}
                                    onChange={(e) => handleChange('cashbackRules', 'enabled', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-secondary mb-1 block">
                                    Porcentagem (%)
                                </label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="0"
                                    max="100"
                                    value={localSettings.cashbackRules?.percentage || 5}
                                    onChange={(e) => handleChange('cashbackRules', 'percentage', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-secondary mb-1 block">
                                    Compra mínima (R$)
                                </label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="0"
                                    value={localSettings.cashbackRules?.minPurchase || 50}
                                    onChange={(e) => handleChange('cashbackRules', 'minPurchase', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-secondary mb-1 block">
                                    Cashback máximo (R$)
                                </label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="0"
                                    value={localSettings.cashbackRules?.maxCashback || 50}
                                    onChange={(e) => handleChange('cashbackRules', 'maxCashback', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-secondary mb-1 block">
                                    Expira em (dias)
                                </label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="1"
                                    value={localSettings.cashbackRules?.expirationDays || 90}
                                    onChange={(e) => handleChange('cashbackRules', 'expirationDays', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <button
                            className="btn-primary w-full"
                            onClick={() => handleSave('cashbackRules')}
                            disabled={saving}
                        >
                            {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Salvar Regras de Cashback'}
                        </button>
                    </div>
                </div>

                {/* REGRAS DE INDICAÇÃO */}
                <div className="admin-card p-6">
                    <h3 className="font-bold text-lg mb-4">
                        <i className="fas fa-user-plus mr-2 text-primary"></i>
                        Regras de Indicação
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-bg-alt rounded-lg">
                            <div>
                                <p className="font-semibold">Programa de Indicação Ativo</p>
                                <p className="text-sm text-secondary">Clientes ganham benefícios ao indicar amigos</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={localSettings.referralRules?.enabled || false}
                                    onChange={(e) => handleChange('referralRules', 'enabled', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div>
                            <label className="text-sm text-secondary mb-1 block">
                                Créditos por indicação
                            </label>
                            <input
                                type="number"
                                className="form-input"
                                min="1"
                                value={localSettings.referralRules?.creditValue || 1}
                                onChange={(e) => handleChange('referralRules', 'creditValue', parseInt(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-secondary mb-1 block">
                                Recompensa para quem indica
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={localSettings.referralRules?.referrerReward || 'Corte Grátis'}
                                onChange={(e) => handleChange('referralRules', 'referrerReward', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-secondary mb-1 block">
                                Desconto para o indicado (%)
                            </label>
                            <input
                                type="number"
                                className="form-input"
                                min="0"
                                max="100"
                                value={localSettings.referralRules?.referredDiscount || 20}
                                onChange={(e) => handleChange('referralRules', 'referredDiscount', parseInt(e.target.value))}
                            />
                        </div>

                        <button
                            className="btn-primary w-full"
                            onClick={() => handleSave('referralRules')}
                            disabled={saving}
                        >
                            {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Salvar Regras de Indicação'}
                        </button>
                    </div>
                </div>

                {/* Notificações */}
                <div className="admin-card p-6">
                    <h3 className="font-bold text-lg mb-4">
                        <i className="fas fa-bell mr-2 text-primary"></i>
                        Notificações
                    </h3>
                    <div className="space-y-4">
                        {[
                            { key: 'newAppointment', label: 'Novo agendamento', desc: 'Notificar ao receber novos agendamentos' },
                            { key: 'cancellations', label: 'Cancelamentos', desc: 'Notificar quando clientes cancelarem' },
                            { key: 'newSubscriptions', label: 'Novas assinaturas', desc: 'Notificar ao receber novas assinaturas' },
                            { key: 'dailyReport', label: 'Relatório diário', desc: 'Receber resumo diário por e-mail' },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{item.label}</p>
                                    <p className="text-sm text-secondary">{item.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={localSettings.notifications?.[item.key] || false}
                                        onChange={(e) => handleChange('notifications', item.key, e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        ))}
                        <button
                            className="btn-primary w-full"
                            onClick={() => handleSave('notifications')}
                            disabled={saving}
                        >
                            {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Salvar Notificações'}
                        </button>
                    </div>
                </div>

                {/* Ferramentas de Administração */}
                <div className="admin-card p-6 lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4">
                        <i className="fas fa-tools mr-2 text-primary"></i>
                        Ferramentas de Administração
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <button
                            className="btn-outline w-full py-4 flex flex-col items-center gap-2"
                            onClick={handleSeedDatabase}
                            disabled={seeding}
                        >
                            {seeding ? (
                                <i className="fas fa-spinner fa-spin text-xl"></i>
                            ) : (
                                <i className="fas fa-database text-xl"></i>
                            )}
                            <span>Criar Dados Iniciais</span>
                        </button>
                        <button className="btn-outline w-full py-4 flex flex-col items-center gap-2">
                            <i className="fas fa-key text-xl"></i>
                            <span>Alterar Senha</span>
                        </button>
                        <button className="btn-outline w-full py-4 flex flex-col items-center gap-2">
                            <i className="fas fa-user-shield text-xl"></i>
                            <span>Gerenciar Usuários</span>
                        </button>
                        <button className="btn-outline w-full py-4 flex flex-col items-center gap-2">
                            <i className="fas fa-history text-xl"></i>
                            <span>Log de Atividades</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
