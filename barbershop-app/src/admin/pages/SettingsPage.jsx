import React from 'react';

function SettingsPage() {
    return (
        <div className="admin-page">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informações do Negócio */}
                <div className="admin-card p-6">
                    <h3 className="font-bold text-lg mb-4">
                        <i className="fas fa-building mr-2 text-primary"></i>
                        Informações do Negócio
                    </h3>
                    <form className="space-y-4">
                        <div>
                            <label className="text-sm text-secondary mb-1 block">Nome do Estabelecimento</label>
                            <input type="text" className="form-input" defaultValue="VS Barbearia" />
                        </div>
                        <div>
                            <label className="text-sm text-secondary mb-1 block">CNPJ</label>
                            <input type="text" className="form-input" defaultValue="00.000.000/0001-00" />
                        </div>
                        <div>
                            <label className="text-sm text-secondary mb-1 block">E-mail de Contato</label>
                            <input type="email" className="form-input" defaultValue="contato@vsbarbearia.com" />
                        </div>
                        <div>
                            <label className="text-sm text-secondary mb-1 block">WhatsApp</label>
                            <input type="text" className="form-input" defaultValue="(11) 99999-9999" />
                        </div>
                        <button className="btn-primary w-full">Salvar Alterações</button>
                    </form>
                </div>

                {/* Horários de Funcionamento */}
                <div className="admin-card p-6">
                    <h3 className="font-bold text-lg mb-4">
                        <i className="fas fa-clock mr-2 text-primary"></i>
                        Horários de Funcionamento
                    </h3>
                    <div className="space-y-3">
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, idx) => (
                            <div key={day} className="flex items-center justify-between p-3 bg-bg-alt rounded-lg">
                                <span className={idx === 6 ? 'text-secondary' : ''}>{day}</span>
                                {idx === 6 ? (
                                    <span className="text-secondary">Fechado</span>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input type="time" className="form-input py-1 px-2 w-24 text-sm" defaultValue="09:00" />
                                        <span className="text-secondary">às</span>
                                        <input type="time" className="form-input py-1 px-2 w-24 text-sm" defaultValue="20:00" />
                                    </div>
                                )}
                            </div>
                        ))}
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
                            { label: 'Novo agendamento', desc: 'Notificar ao receber novos agendamentos' },
                            { label: 'Cancelamentos', desc: 'Notificar quando clientes cancelarem' },
                            { label: 'Novas assinaturas', desc: 'Notificar ao receber novas assinaturas' },
                            { label: 'Relatório diário', desc: 'Receber resumo diário por e-mail' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{item.label}</p>
                                    <p className="text-sm text-secondary">{item.desc}</p>
                                </div>
                                <div className="toggle-switch active"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Integrações */}
                <div className="admin-card p-6">
                    <h3 className="font-bold text-lg mb-4">
                        <i className="fas fa-plug mr-2 text-primary"></i>
                        Integrações
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-bg-alt rounded-lg">
                            <div className="flex items-center gap-3">
                                <i className="fab fa-whatsapp text-2xl text-green-500"></i>
                                <div>
                                    <p className="font-semibold">WhatsApp Business</p>
                                    <p className="text-xs text-green-500">Conectado</p>
                                </div>
                            </div>
                            <button className="btn-secondary py-2 px-3 text-sm">Configurar</button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-bg-alt rounded-lg">
                            <div className="flex items-center gap-3">
                                <i className="fab fa-google text-2xl text-blue-500"></i>
                                <div>
                                    <p className="font-semibold">Google Calendar</p>
                                    <p className="text-xs text-secondary">Não conectado</p>
                                </div>
                            </div>
                            <button className="btn-primary py-2 px-3 text-sm">Conectar</button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-bg-alt rounded-lg">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-credit-card text-2xl text-purple-500"></i>
                                <div>
                                    <p className="font-semibold">Gateway de Pagamento</p>
                                    <p className="text-xs text-green-500">Configurado</p>
                                </div>
                            </div>
                            <button className="btn-secondary py-2 px-3 text-sm">Configurar</button>
                        </div>
                    </div>
                </div>

                {/* Segurança */}
                <div className="admin-card p-6 lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4">
                        <i className="fas fa-shield-halved mr-2 text-primary"></i>
                        Segurança
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
