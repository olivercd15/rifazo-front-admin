'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { classNames } from 'primereact/utils';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * 👉 Servicio real
 */
import { getQrVouchers } from '@/services/qr.service';

type VoucherImage = {
    id: string;
    name: string;
    url_image: string;
    is_enabled: boolean;
    created_at: string;
};

const TableQrVouchers = () => {
    const [data, setData] = useState<VoucherImage[]>([]);
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
            const result = await getQrVouchers();
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
            <h5 className="m-0">Comprobantes registrados</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter} onChange={onGlobalFilterChange} placeholder="Buscar..." />
            </span>
        </div>
    );

    /**
     * 👉 Templates
     */

    const imageBodyTemplate = (row: VoucherImage) => {
        return (
            <img
                src={`${SUPABASE_URL}/storage/v1/object/public/${row.url_image}`}
                alt={row.name}
                width={120}
                className="shadow-2 border-round"
                onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
            />
        );
    };

    const enabledBodyTemplate = (row: VoucherImage) => {
        return (
            <i
                className={classNames('pi', {
                    'pi-check-circle text-green-500': row.is_enabled,
                    'pi-times-circle text-red-500': !row.is_enabled
                })}
            />
        );
    };

    const dateBodyTemplate = (row: VoucherImage) => {
        return new Date(row.created_at).toLocaleDateString('es-BO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <DataTable value={data} paginator rows={10} loading={loading} filters={filters} globalFilterFields={['name']} header={header} emptyMessage="No se encontraron comprobantes" showGridlines responsiveLayout="scroll">
                        <Column field="raffle_title" header="Rifa" sortable />
                        <Column header="Comprobante" body={imageBodyTemplate} />
                        <Column field="is_enabled" header="Activo" body={enabledBodyTemplate} style={{ textAlign: 'center' }} />
                        <Column field="created_at" header="Fecha creación" body={dateBodyTemplate} sortable />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default TableQrVouchers;
