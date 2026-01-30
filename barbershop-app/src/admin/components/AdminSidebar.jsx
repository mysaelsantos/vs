import React from 'react';
import { useAdmin } from '../context/AdminContext';

function AdminSidebar() {
    const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, adminUser } = useAdmin();

    const menuItems = [
        { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
        { id: 'appointments', icon: 'fa-calendar-check', label: 'Agendamentos' },
        { id: 'clients', icon: 'fa-users', label: 'Clientes' },
        { id: 'services', icon: 'fa-scissors', label: 'Serviços' },
        { id: 'collaborators', icon: 'fa-user-tie', label: 'Colaboradores' },
        { id: 'units', icon: 'fa-location-dot', label: 'Unidades' },
        { id: 'plans', icon: 'fa-crown', label: 'Planos' },
        { id: 'reports', icon: 'fa-file-lines', label: 'Relatórios' },
        { id: 'settings', icon: 'fa-gear', label: 'Configurações' },
    ];

    return (
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            {/* Logo */}
            <div className="sidebar-header">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-black font-bold text-lg">VS</span>
                    </div>
                    {sidebarOpen && (
                        <div>
                            <h1 className="font-bold text-white">VS Barbearia</h1>
                            <p className="text-xs text-secondary">Painel Admin</p>
                        </div>
                    )}
                </div>
                <button
                    className="sidebar-toggle"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
                </button>
            </div>

            {/* Menu */}
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => setCurrentPage(item.id)}
                    >
                        <i className={`fas ${item.icon}`}></i>
                        {sidebarOpen && <span>{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* User */}
            {sidebarOpen && (
                <div className="sidebar-footer">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <i className="fas fa-user text-primary"></i>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{adminUser?.name}</p>
                            <p className="text-xs text-secondary">{adminUser?.email}</p>
                        </div>
                    </div>
                    <button className="text-secondary hover:text-red-500 transition-colors">
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            )}
        </aside>
    );
}

export default AdminSidebar;
