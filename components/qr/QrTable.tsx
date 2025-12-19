'use client';

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { toggleQrEnabled } from '@/services/qr.service';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export type QrImage = {
    id: string;
    name: string;
    url_image: string;
    is_enabled: boolean;
    created_at: string;
};

interface Props {
    data: QrImage[];
    loading: boolean;
    onEdit: (row: QrImage) => void;
    onDelete: (id: string) => void;
    onLocalUpdate: (id: string, value: boolean) => void;
}

const QrTable = ({ data, loading, onEdit, onDelete, onLocalUpdate }: Props) => {
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [filters, setFilters] = React.useState<any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilter(value);
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h5 className="m-0">QR registrados</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter} onChange={onGlobalFilterChange} placeholder="Buscar..." />
            </span>
        </div>
    );

    /* =========================
       Templates
    ========================= */

    const imageBodyTemplate = (row: QrImage) => (
        <img
            src={`${SUPABASE_URL}/storage/v1/object/public/${row.url_image}`}
            alt={row.name}
            width={120}
            className="shadow-2 border-round"
            onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
        />
    );

    const dateBodyTemplate = (row: QrImage) => new Date(row.created_at).toLocaleDateString('es-BO');

    const enabledBodyTemplate = (row: QrImage) => (
        <Button
            icon={row.is_enabled ? 'pi pi-check-circle' : 'pi pi-times-circle'}
            className={row.is_enabled ? 'p-button-success p-button-text' : 'p-button-danger p-button-text'}
            tooltip={row.is_enabled ? 'Desactivar' : 'Activar'}
            onClick={async () => {
                await toggleQrEnabled(row.id, !row.is_enabled);
                onLocalUpdate(row.id, !row.is_enabled);
            }}
        />
    );

    const actionBodyTemplate = (row: QrImage) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded outlined onClick={() => onEdit(row)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => onDelete(row.id)} />
        </div>
    );

    const actionBodyDeleteTemplate = (row: QrImage) => (
        <div className="flex gap-2">
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => onDelete(row.id)} />
        </div>
    );

    return (
        <DataTable value={data} paginator rows={10} loading={loading} filters={filters} globalFilterFields={['name']} header={header} emptyMessage="No se encontraron QR" showGridlines responsiveLayout="scroll">
            <Column field="name" header="Nombre" sortable />
            <Column header="QR" body={imageBodyTemplate} />
            <Column header="Activo" body={enabledBodyTemplate} style={{ textAlign: 'center' }} />
            <Column header="Fecha creación" body={dateBodyTemplate} sortable />
            <Column header="Acciones" body={actionBodyDeleteTemplate} />
        </DataTable>
    );
};

export default QrTable;
