'use client';

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

export type AdminTicket = {
    ticket_id: string;
    ticket_number: number;
    ticket_status: string;
    ticket_reserved_at: string;

    user_email: string;
    user_name: string;
    user_phone: string;

    raffle_title: string;

    payment_status?: string;
};

type Props = {
    data: AdminTicket[];
    loading: boolean;
    onCancel: (id: string) => void;
};

const statusSeverity = (status: string) => {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'active':
            return 'success';
        case 'expired':
            return null;
        case 'used':
            return 'info';
        case 'refunded':
            return 'danger';
        default:
            return null;
    }
};

const dateBodyTemplate = (row: AdminTicket) => {
    return new Date(row.ticket_reserved_at).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const TicketsTable = ({ data, loading, onCancel }: Props) => {
    return (
        <DataTable value={data} paginator rows={10} loading={loading} showGridlines responsiveLayout="scroll" emptyMessage="No se encontraron tickets" sortField="ticket_reserved_at" sortOrder={-1}>
            <Column field="raffle_title" header="Rifa" sortable />
            <Column field="ticket_number" header="Ticket #" sortable />
            <Column field="user_name" header="Usuario" />
            <Column field="user_phone" header="Telefono" />
            <Column header="Estado" body={(row) => <Tag value={row.ticket_status} severity={statusSeverity(row.ticket_status)} />} />
            <Column header="Pago" body={(row) => row.payment_status ?? '—'} />
            <Column
                field="ticket_reserved_at"
                header="Fecha Reserva"
                body={dateBodyTemplate}
                sortable
            />
            <Column header="Acciones" body={(row) => (row.ticket_status === 'pending' ? <Button icon="pi pi-times" rounded outlined severity="danger" onClick={() => onCancel(row.ticket_id)} /> : '—')} />
        </DataTable>
    );
};

export default TicketsTable;
