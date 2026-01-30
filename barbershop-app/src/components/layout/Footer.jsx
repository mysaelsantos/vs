import React from 'react';
import { useApp } from '../../context/AppContext';

function Footer() {
    const { currentView, setCurrentView } = useApp();

    const navItems = [
        { id: 'agendar', icon: 'fa-calendar-check', label: 'Agendar' },
        { id: 'historico', icon: 'fa-clock-rotate-left', label: 'Histórico' },
        { id: 'planos', icon: 'fa-crown', label: 'Planos' },
        { id: 'perfil', icon: 'fa-user', label: 'Perfil' },
    ];

    return (
        <footer className="footer-nav">
            <nav className="footer-nav-inner">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                        onClick={() => setCurrentView(item.id)}
                    >
                        <i className={`fas ${item.icon}`}></i>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </footer>
    );
}

export default Footer;
