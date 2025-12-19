'use client';

import React, { useEffect, useState } from 'react';
import KpiCard from '@/components/dashboard/KpiCard';
import { getDashboardStats, getRecentRaffles, getPendingPayments } from '@/services/dashboard.service';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const DashboardPage = () => {
    const [stats, setStats] = useState<any>(null);
    const [recentRaffles, setRecentRaffles] = useState<any[]>([]);
    const [pendingPayments, setPendingPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [s, r, p] = await Promise.all([getDashboardStats(), getRecentRaffles(), getPendingPayments()]);
            setStats(s);
            setRecentRaffles(r);
            setPendingPayments(p);
            setLoading(false);
        };

        load();
    }, []);

    if (loading) return <p>Cargando dashboard...</p>;

    return (
        <div className="grid">
            {/* KPIs */}
            <div className="col-12 md:col-3">
                <KpiCard title="Rifas Totales" value={stats.totalRaffles} icon="pi-ticket" />
            </div>
            <div className="col-12 md:col-3">
                <KpiCard title="Rifas Activas" value={stats.activeRaffles} icon="pi-play" color="green" />
            </div>
            <div className="col-12 md:col-3">
                <KpiCard title="Pagos Pendientes" value={stats.pendingPayments} icon="pi-clock" color="orange" />
            </div>
            <div className="col-12 md:col-3">
                <KpiCard title="Tickets Activos" value={stats.activeTickets} icon="pi-users" />
            </div>

            {/* Últimas Rifas */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Últimas Rifas</h5>
                    <DataTable value={recentRaffles} size="small">
                        <Column field="title" header="Rifa" />
                        <Column field="status" header="Estado" />
                        <Column field="created_at" header="Creado" body={(r) => new Date(r.created_at).toLocaleDateString()} />
                    </DataTable>
                </div>
            </div>

            {/* Pagos Pendientes */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Pagos Pendientes</h5>
                    <DataTable value={pendingPayments} size="small">
                        <Column field="raffle_title" header="Rifa" />
                        <Column field="user_name" header="Usuario" />
                        <Column field="payment_amount" header="Monto" body={(r) => `BOB ${Number(r.payment_amount).toFixed(2)}`} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
