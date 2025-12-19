'use client';

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';



export type Raffle = {
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

const statusSeverity = (status: string) => {
    switch (status) {
        case 'upcoming':
            return null;
        case 'active':
            return 'info';
        case 'completed':
            return 'success';
        case 'cancelled':
            return 'danger';
        default:
            return null;
    }
};

type Props = {
    data: Raffle[];
    loading: boolean;
    onEdit: (row: Raffle) => void;
    onDelete: (id: string) => void;
    onAssignWinner: (raffle: Raffle) => void;
};

const RafflesTable = ({ data, loading, onEdit, onDelete, onAssignWinner }: Props) => {
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [filters, setFilters] = React.useState<any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilters({ global: { value, matchMode: FilterMatchMode.CONTAINS } });
        setGlobalFilter(value);
    };

    const formatCurrency = (value: string) =>
        Number(value).toLocaleString('es-BO', {
            style: 'currency',
            currency: 'BOB'
        });

    const formatDate = (value: string) => new Date(value).toLocaleString();

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h5 className="m-0">Rifas registradas</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter} onChange={onGlobalFilterChange} placeholder="Buscar..." />
            </span>
        </div>
    );

    const actionBodyTemplate = (row: Raffle) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded outlined onClick={() => onEdit(row)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => onDelete(row.id)} />
        </div>
    );

    return (
        <DataTable value={data} loading={loading} paginator rows={10} showGridlines responsiveLayout="scroll">
            <Column field="title" header="Rifa" sortable />
            <Column header="Premio" body={(r) => `BOB ${r.prize_value}`} />
            <Column header="Tickets" body={(r) => `${r.tickets_sold} / ${r.max_tickets}`} />
            <Column header="Estado" body={(r) => <Tag value={r.status} severity={statusSeverity(r.status)} />} />
            <Column header="Sorteo" body={(r) => new Date(r.draw_date).toLocaleString()} />
            <Column field="time_slot" header="Horario" />
            <Column header="Ganador" body={(r) => (r.winner_id ? `Ticket #${r.winning_ticket_number}` : '—')} />
            <Column
                header="Acciones"
                body={(r) => (
                    <div className="flex gap-2">
                        <Button icon="pi pi-pencil" outlined onClick={() => onEdit(r)} />
                        <Button icon="pi pi-trash" outlined severity="danger" onClick={() => onDelete(r.id)} />
                        {r.status === 'active' && !r.winner_id && <Button icon="pi pi-star" severity="warning" outlined onClick={() => onAssignWinner(r)} tooltip="Asignar ganador" />}
                    </div>
                )}
            />
        </DataTable>
    );
};

export default RafflesTable;
