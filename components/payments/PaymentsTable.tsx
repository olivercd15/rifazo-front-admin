'use client';

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export type AdminPayment = {
    payment_id: string;
    payment_status: string;
    payment_amount: number;
    currency: string;
    payment_method: string;
    payment_created_at: string;

    user_email: string;
    user_name: string;

    raffle_title: string;

    tickets_count: number;
    ticket_numbers: number[];

    voucher_url?: string;
    has_voucher: boolean;
    ready_for_review: boolean;


};

const severity = (s: string) => (s === 'delivered' ? 'warning' : s === 'completed' ? 'success' : s === 'failed' ? 'danger' : 'info');

type Props = {
    data: AdminPayment[];
    loading: boolean;
    onViewVoucher: (url: string) => void;
    onViewTickets: (numbers: number[]) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
};

const dateBodyTemplate = (row: AdminPayment) => {
    return new Date(row.payment_created_at).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};


const PaymentsTable = ({ data, loading, onViewVoucher, onViewTickets, onApprove, onReject }: Props) => {
    return (
        <DataTable value={data} loading={loading} paginator rows={10} showGridlines responsiveLayout="scroll" sortField="payment_created_at" sortOrder={-1}>
            <Column field="raffle_title" header="Rifa" />
            <Column field="user_name" header="Usuario" />
            <Column field="user_phone" header="Celular" />
            <Column header="Monto" body={(r) => `${r.currency} ${Number(r.payment_amount).toFixed(2)}`} />
            <Column header="Tickets" body={(r) => <Button label={String(r.tickets_count)} text onClick={() => onViewTickets(r.ticket_numbers)} />} />

            <Column header="Estado" body={(r) => <Tag value={r.payment_status} severity={severity(r.payment_status)} />} />
            <Column header="Voucher" body={(r) => (r.has_voucher ? <Button icon="pi pi-image" outlined onClick={() => onViewVoucher(`${SUPABASE_URL}/storage/v1/object/public/${r.voucher_url}`!)} /> : '—')} />
            <Column field="payment_created_at" header="Fecha creación" body={dateBodyTemplate} sortable />
            <Column
                header="Acciones"
                body={(r) =>
                    r.ready_for_review ? (
                        <div className="flex gap-2">
                            <Button icon="pi pi-check" severity="success" outlined onClick={() => onApprove(r.payment_id)} />
                            <Button icon="pi pi-times" severity="danger" outlined onClick={() => onReject(r.payment_id)} />
                        </div>
                    ) : (
                        '—'
                    )
                }
            />
        </DataTable>
    );
};

export default PaymentsTable;
