import React from 'react';
import { useApp } from '../../../context/AppContext';

function NotificacoesModal() {
    const { notifications, updateNotifications, closeModal } = useApp();

    const options = [
        { key: 'appointments', icon: 'fa-calendar-check', title: 'Agendamentos', desc: 'Confirmações e lembretes' },
        { key: 'promotions', icon: 'fa-tag', title: 'Promoções', desc: 'Ofertas e descontos especiais' },
        { key: 'reminders', icon: 'fa-bell', title: 'Lembretes', desc: 'Aviso antes dos agendamentos' },
        { key: 'news', icon: 'fa-newspaper', title: 'Novidades', desc: 'Novos serviços e atualizações' },
    ];

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Notificações</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="space-y-4">
                {options.map((option) => (
                    <div key={option.key} className="list-item justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <i className={`fas ${option.icon} text-primary`}></i>
                            </div>
                            <div>
                                <p className="font-semibold text-white">{option.title}</p>
                                <p className="text-sm text-secondary">{option.desc}</p>
                            </div>
                        </div>
                        <div
                            className={`toggle-switch ${notifications[option.key] ? 'active' : ''}`}
                            onClick={() => updateNotifications(option.key, !notifications[option.key])}
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NotificacoesModal;
