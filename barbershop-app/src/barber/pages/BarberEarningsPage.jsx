import React, { useState, useMemo } from 'react';
import { useBarber } from '../context/BarberContext';

function BarberEarningsPage() {
    const { appointments, barber, earnings } = useBarber();
    const [period, setPeriod] = useState('month');

    // Calcular dados por período
    const periodData = useMemo(() => {
        const now = new Date();
        let startDate;
        let periodLabel;

        switch (period) {
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                periodLabel = 'Últimos 7 dias';
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                periodLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                break;
            case 'quarter':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                periodLabel = 'Últimos 3 meses';
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                periodLabel = now.getFullYear().toString();
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                periodLabel = 'Este mês';
        }

        const filtered = appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= startDate && apt.status === 'completed';
        });

        const totalRevenue = filtered.reduce((sum, apt) => sum + (apt.price || 0), 0);
        const commissionRate = barber?.commissions?.default || 50;
        const commission = (totalRevenue * commissionRate) / 100;
        const totalServices = filtered.length;

        // Agrupar por serviço
        const byService = filtered.reduce((acc, apt) => {
            const name = apt.serviceName || 'Outros';
            if (!acc[name]) {
                acc[name] = { count: 0, revenue: 0 };
            }
            acc[name].count++;
            acc[name].revenue += apt.price || 0;
            return acc;
        }, {});

        // Top serviços
        const topServices = Object.entries(byService)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Últimos atendimentos
        const recentServices = filtered
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        return {
            periodLabel,
            totalRevenue,
            commission,
            commissionRate,
            totalServices,
            topServices,
            recentServices
        };
    }, [appointments, barber, period]);

    // Calcular comparativo com período anterior
    const comparison = useMemo(() => {
        const now = new Date();
        let currentStart, previousStart, previousEnd;

        if (period === 'month') {
            currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
            previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        } else {
            return null;
        }

        const previousFiltered = appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= previousStart && aptDate <= previousEnd && apt.status === 'completed';
        });

        const previousRevenue = previousFiltered.reduce((sum, apt) => sum + (apt.price || 0), 0);
        const currentRevenue = periodData.totalRevenue;

        if (previousRevenue === 0) return null;

        const percentChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
        return {
            previous: previousRevenue,
            change: percentChange,
            isPositive: percentChange >= 0
        };
    }, [appointments, period, periodData.totalRevenue]);

    const formatCurrency = (value) => {
        return `R$ ${(value || 0).toFixed(2).replace('.', ',')}`;
    };

    return (
        <div className="admin-page">
            {/* Header com seleção de período */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-bold">{periodData.periodLabel}</h2>
                    <p className="text-secondary text-sm">Seus ganhos e comissões</p>
                </div>
                <div className="flex items-center gap-2">
                    {['week', 'month', 'quarter', 'year'].map((p) => (
                        <button
                            key={p}
                            className={`px-4 py-2 rounded-lg text-sm ${period === p ? 'bg-primary text-black font-semibold' : 'bg-bg-alt hover:bg-primary/20'
                                }`}
                            onClick={() => setPeriod(p)}
                        >
                            {p === 'week' && '7 dias'}
                            {p === 'month' && 'Mês'}
                            {p === 'quarter' && '3 meses'}
                            {p === 'year' && 'Ano'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards principais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Faturamento bruto */}
                <div className="admin-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <i className="fas fa-coins text-xl text-primary"></i>
                        </div>
                        {comparison && (
                            <div className={`flex items-center gap-1 text-sm ${comparison.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                <i className={`fas fa-arrow-${comparison.isPositive ? 'up' : 'down'}`}></i>
                                {Math.abs(comparison.change).toFixed(1)}%
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-secondary mb-1">Faturamento Bruto</p>
                    <p className="text-3xl font-bold">{formatCurrency(periodData.totalRevenue)}</p>
                </div>

                {/* Comissão */}
                <div className="admin-card p-6 border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <i className="fas fa-wallet text-xl text-green-500"></i>
                        </div>
                        <span className="badge badge-success">{periodData.commissionRate}%</span>
                    </div>
                    <p className="text-sm text-secondary mb-1">Sua Comissão</p>
                    <p className="text-3xl font-bold text-green-500">{formatCurrency(periodData.commission)}</p>
                </div>

                {/* Total de atendimentos */}
                <div className="admin-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <i className="fas fa-user-check text-xl text-blue-500"></i>
                        </div>
                    </div>
                    <p className="text-sm text-secondary mb-1">Atendimentos</p>
                    <p className="text-3xl font-bold">{periodData.totalServices}</p>
                    <p className="text-xs text-secondary mt-1">
                        Média: {formatCurrency(periodData.totalServices > 0 ? periodData.totalRevenue / periodData.totalServices : 0)}/atendimento
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top serviços */}
                <div className="admin-card p-6">
                    <h3 className="font-bold mb-4">
                        <i className="fas fa-trophy text-primary mr-2"></i>
                        Top Serviços
                    </h3>

                    {periodData.topServices.length === 0 ? (
                        <p className="text-secondary text-center py-8">Nenhum serviço neste período</p>
                    ) : (
                        <div className="space-y-4">
                            {periodData.topServices.map((service, index) => (
                                <div key={service.name} className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-500 text-black' :
                                            index === 1 ? 'bg-gray-400 text-black' :
                                                index === 2 ? 'bg-amber-700 text-white' :
                                                    'bg-bg-alt text-secondary'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{service.name}</p>
                                        <p className="text-xs text-secondary">{service.count} atendimentos</p>
                                    </div>
                                    <p className="font-bold text-primary">{formatCurrency(service.revenue)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Últimos atendimentos */}
                <div className="admin-card p-6">
                    <h3 className="font-bold mb-4">
                        <i className="fas fa-history text-primary mr-2"></i>
                        Últimos Atendimentos
                    </h3>

                    {periodData.recentServices.length === 0 ? (
                        <p className="text-secondary text-center py-8">Nenhum atendimento neste período</p>
                    ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {periodData.recentServices.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                                    <div>
                                        <p className="font-semibold text-sm">{apt.clientName || 'Cliente'}</p>
                                        <p className="text-xs text-secondary">
                                            {apt.serviceName} • {new Date(apt.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <p className="font-bold text-primary text-sm">{formatCurrency(apt.price)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Info de comissão */}
            <div className="admin-card p-4 mt-6 bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-4">
                    <i className="fas fa-info-circle text-primary text-xl"></i>
                    <div>
                        <p className="font-semibold">Sua taxa de comissão: {periodData.commissionRate}%</p>
                        <p className="text-sm text-secondary">
                            A comissão é calculada sobre o valor total dos serviços realizados.
                            Para dúvidas sobre sua taxa, fale com a administração.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BarberEarningsPage;
