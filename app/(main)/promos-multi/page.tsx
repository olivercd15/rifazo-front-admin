'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import PromoMultiFilters from '@/components/promos-multi/PromoMultiFilters';
import PromoMultiTable, {
    AdminPromoMulti
} from '@/components/promos-multi/PromoMultiTable';
import PromoMultiForm from '@/components/promos-multi/PromoMultiForm';

import {
    getPromoMulti,
    deletePromoMulti,
    updatePromoMulti
} from '@/services/promoMulti.service';

const PromoMultiPage = () => {
    const [data, setData] = useState<AdminPromoMulti[]>([]);
    const [loading, setLoading] = useState(true);

    // filtros
    const [isActive, setIsActive] = useState<boolean | undefined>();
    const [promoName, setPromoName] = useState<string | undefined>();

    // modal / form
    const [showForm, setShowForm] = useState(false);
    const [selectedPromo, setSelectedPromo] =
        useState<AdminPromoMulti | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadData();
        }, 300);

        return () => clearTimeout(timer);
    }, [isActive, promoName]);

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await getPromoMulti({
                is_active: isActive,
                promo_name: promoName
            });
            setData(result);
        } finally {
            setLoading(false);
        }
    };

    /* ===== Actions ===== */

    const onCreate = () => {
        setSelectedPromo(null);
        setShowForm(true);
    };

    const onEdit = (promo: AdminPromoMulti) => {
        setSelectedPromo(promo);
        setShowForm(true);
    };

    const onDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta promoción?')) return;
        await deletePromoMulti(id);
        loadData();
    };

    const onToggle = async (promo: AdminPromoMulti) => {
        await updatePromoMulti(promo.id, {
            is_active: !promo.is_active
        });
        loadData();
    };

    return (
        <div className="grid">
            <div className="col-12">
                {/* Header */}
                <div className="flex justify-content-between align-items-center mb-3">
                    <h4>Promociones Multiplicador</h4>

                    <Button
                        label="Nueva promoción"
                        icon="pi pi-plus"
                        onClick={onCreate}
                    />
                </div>

                {/* Filters */}
                <PromoMultiFilters
                    isActive={isActive}
                    promoName={promoName}
                    onChange={(f) => {
                        setIsActive(f.isActive);
                        setPromoName(f.promoName);
                    }}
                />

                {/* Table */}
                <div className="card">
                    <PromoMultiTable
                        data={data}
                        loading={loading}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggle={onToggle}
                    />
                </div>
            </div>

            {/* Modal Form */}
            <Dialog
                header={
                    selectedPromo
                        ? 'Editar promoción'
                        : 'Nueva promoción'
                }
                visible={showForm}
                style={{ width: '600px' }}
                modal
                onHide={() => setShowForm(false)}
            >
                <PromoMultiForm
                    initialData={selectedPromo}
                    onCancel={() => setShowForm(false)}
                    onSuccess={() => {
                        setShowForm(false);
                        loadData();
                    }}
                />
            </Dialog>
        </div>
    );
};

export default PromoMultiPage;
