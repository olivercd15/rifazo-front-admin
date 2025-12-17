'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { classNames } from 'primereact/utils';
import { getRaffles } from '@/services/raffle.service';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * 👉 Servicio real
 */

type Raffles = {
    id: string;
    title: string;
    description: string;
    prize_description: string;
    prize_value: string;
    ticket_price: string;
    max_tickets: string;
    tickets_sold: string;
    status: string;
    draw_date: string;
    stream_url: string;
    winner_id: string;
    winning_ticket_number: string;
    time_slot: string;
    created_at: string;
};

const TableRaffles = () => {
    const [data, setData] = useState<Raffles[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [filters, setFilters] = useState<any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await getRaffles();
            setData(result);
        } catch (error) {
            console.error('Error cargando comprobantes:', error);
        } finally {
            setLoading(false);
        }
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilter(value);
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h5 className="m-0">Rifas registradas</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter} onChange={onGlobalFilterChange} placeholder="Buscar..." />
            </span>
        </div>
    );

    /**
     * 👉 Templates
     */


    const dateBodyTemplate = (row: Raffles) => {
        return new Date(row.created_at).toLocaleDateString('es-BO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const statusOrderBodyTemplate = (rowData: Raffles) => {
        return <span className={`order-badge order-${rowData.status?.toLowerCase()}`}>{rowData.status}</span>;
    };

    const formatCurrency = (value: string) =>
        Number(value).toLocaleString('es-BO', {
            style: 'currency',
            currency: 'BOB'
        });

    const formatDate = (value: string) => new Date(value).toLocaleString();

    const prizeValueTemplate = (row: Raffles) => formatCurrency(row.prize_value);

    const ticketPriceTemplate = (row: Raffles) => formatCurrency(row.ticket_price);

    const ticketsSoldTemplate = (row: Raffles) => Number(row.tickets_sold);

    const statusTemplate = (row: Raffles) => <span className={`raffle-status raffle-${row.status}`}>{row.status}</span>;

    const winnerTemplate = (row: Raffles) => (row.winner_id ? row.winner_id : '—');

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <DataTable value={data} paginator rows={10} loading={loading} header={header} emptyMessage="No se encontraron rifas" showGridlines responsiveLayout="scroll">
                        <Column field="title" header="Rifa" sortable />

                        <Column header="Valor Premio" body={prizeValueTemplate} sortable />

                        <Column header="Precio Ticket" body={ticketPriceTemplate} sortable />

                        <Column header="Tickets Vendidos" body={ticketsSoldTemplate} sortable />

                        <Column field="status" header="Estado" body={statusTemplate} sortable />

                        <Column header="Fecha Sorteo" body={(row: Raffles) => formatDate(row.draw_date)} sortable />

                        <Column header="Ganador" body={winnerTemplate} sortable />

                        <Column field="time_slot" header="Horario" sortable />

                        <Column header="Creado" body={(row: Raffles) => formatDate(row.created_at)} sortable />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default TableRaffles;
