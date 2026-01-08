'use client';

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

export type AdminPromoMulti = {
    id: string;
    name: string;
    description?: string;
    factor: number;
    is_active: boolean;
    starts_at: string;
    ends_at: string;
    created_at: string;

    raffle_id: string;
    raffle_title: string;
};

type Props = {
    data: AdminPromoMulti[];
    loading: boolean;
    onEdit: (promo: AdminPromoMulti) => void;
    onDelete: (id: string) => void;
    onToggle: (promo: AdminPromoMulti) => void;
};

const PromoMultiTable = ({ data, loading, onEdit, onDelete, onToggle }: Props) => {
    return (
        <DataTable
            value={data}
            paginator
            rows={10}
            loading={loading}
            showGridlines
            responsiveLayout="scroll"
            emptyMessage="No se encontraron promociones"
        >
            <Column field="name" header="Promoción" sortable />
            <Column field="raffle_title" header="Rifa" sortable />
            <Column
                header="Factor"
                body={(row) => `÷ ${row.factor}`}
                sortable
            />
            <Column
                header="Estado"
                body={(row) => (
                    <Tag
                        value={row.is_active ? 'Activa' : 'Inactiva'}
                        severity={row.is_active ? 'success' : 'danger'}
                    />
                )}
            />
            <Column
                header="Vigencia"
                body={(row) =>
                    `${new Date(row.starts_at).toLocaleDateString()} – ${new Date(
                        row.ends_at
                    ).toLocaleDateString()}`
                }
            />
            <Column
                header="Acciones"
                body={(row) => (
                    <div className="flex gap-2">
                        <Button
                            icon="pi pi-pencil"
                            rounded
                            outlined
                            onClick={() => onEdit(row)}
                        />
                        <Button
                            icon={row.is_active ? 'pi pi-eye-slash' : 'pi pi-eye'}
                            rounded
                            outlined
                            severity="secondary"
                            onClick={() => onToggle(row)}
                        />
                        <Button
                            icon="pi pi-trash"
                            rounded
                            outlined
                            severity="danger"
                            onClick={() => onDelete(row.id)}
                        />
                    </div>
                )}
            />
        </DataTable>
    );
};

export default PromoMultiTable;
