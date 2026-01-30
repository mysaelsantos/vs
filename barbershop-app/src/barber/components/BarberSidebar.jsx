import React from 'react';
import { useBarber } from '../context/BarberContext';

function BarberSidebar() {
    const { barber, currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, logout } = useBarber();

    const menuItems = [
        { id: 'schedule', icon: 'fa-calendar-alt', label: 'Minha Agenda' },
        { id: 'blocks', icon: 'fa-clock', label: 'Bloqueios' },
        { id: 'earnings', icon: 'fa-wallet', label: 'Faturamento' },
        { id: 'profile', icon: 'fa-user', label: 'Meu Perfil' },
    ];

    return (
        <aside className={`fixed left-0 top-0 h-full bg-bg-card border-r border-gray-800 transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                {sidebarOpen && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center">
                            <i className="fas fa-cut text-black text-sm"></i>
                        </div>
                        <span className="font-bold text-white">VS Barbeiro</span>
                    </div>
                )}
                <button
                    className="w-8 h-8 rounded-lg bg-bg-alt flex items-center justify-center hover:bg-primary/20 transition-colors"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-sm`}></i>
                </button>
            </div>

            {/* User Info */}
            {sidebarOpen && barber && (
                <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        {barber.image ? (
                            <img src={barber.image} alt={barber.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <i className="fas fa-user text-primary"></i>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">{barber.name}</p>
                            <p className="text-xs text-secondary truncate">{barber.role || 'Barbeiro'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Menu */}
            <nav className="p-2 flex-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${currentPage === item.id
                                ? 'bg-primary text-black font-semibold'
                                : 'text-secondary hover:bg-bg-alt hover:text-white'
                            }`}
                        onClick={() => setCurrentPage(item.id)}
                    >
                        <i className={`fas ${item.icon} w-5 text-center`}></i>
                        {sidebarOpen && <span>{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-2 border-t border-gray-800">
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    onClick={logout}
                >
                    <i className="fas fa-sign-out-alt w-5 text-center"></i>
                    {sidebarOpen && <span>Sair</span>}
                </button>
            </div>
        </aside>
    );
}

export default BarberSidebar;
