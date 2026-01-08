'use client';

import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { getRafflesForSelect } from '@/services/raffle.service';


import {
    createPromoMulti,
    updatePromoMulti
} from '@/services/promoMulti.service';

export type PromoMulti = {
    id: string;
    raffle_id: string;
    name: string;
    description?: string;
    factor: number;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
};

type Props = {
    initialData?: PromoMulti | null;
    onSuccess: () => void;
    onCancel: () => void;
};

const statusOptions = [
    { label: 'Activa', value: true },
    { label: 'Inactiva', value: false }
];

const PromoMultiForm = ({ initialData, onSuccess, onCancel }: Props) => {
    const [form, setForm] = useState<Partial<PromoMulti>>({
        raffle_id: '',
        name: '',
        description: '',
        factor: 2,
        starts_at: '',
        ends_at: '',
        is_active: true
    });

    const [loading, setLoading] = useState(false);
    const [raffles, setRaffles] = useState<any[]>([]);


    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        loadRaffles();
    }, []);

    const loadRaffles = async () => {
        try {
            const result = await getRafflesForSelect();
            setRaffles(result);
        } catch (e) {
            console.error(e);
        }
    };


    const onSubmit = async () => {
        try {
            if (!form.raffle_id || !form.name || !form.factor) {
                alert('Completa los campos obligatorios');
                return;
            }

            if (form.factor <= 1) {
                alert('El factor debe ser mayor a 1');
                return;
            }

            setLoading(true);

            const payload = {
                ...form
            };

            if (initialData?.id) {
                await updatePromoMulti(initialData.id, payload);
            } else {
                await createPromoMulti(payload);
            }

            onSuccess();
        } catch (e) {
            console.error(e);
            alert('Error al guardar la promoción');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid">
            {/* Rifa */}
            <div className="col-12">
                <label>Rifa (ID)</label>
                <Dropdown
                    className="w-full"
                    value={form.raffle_id}
                    options={raffles}
                    optionLabel="title"
                    optionValue="id"
                    placeholder="Selecciona una rifa"
                    onChange={(e) =>
                        setForm({ ...form, raffle_id: e.value })
                    }
                />

            </div>

            {/* Nombre */}
            <div className="col-12">
                <label>Nombre</label>
                <InputText
                    className="w-full"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />
            </div>

            {/* Descripción */}
            <div className="col-12">
                <label>Descripción</label>
                <InputText
                    className="w-full"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
            </div>

            {/* Factor */}
            <div className="col-6">
                <label>Factor (ej: 2 = 2x1)</label>
                <InputNumber
                    className="w-full"
                    min={1.01}
                    step={0.1}
                    value={form.factor}
                    onValueChange={(e) =>
                        setForm({ ...form, factor: e.value ?? 2 })
                    }
                />
            </div>

            {/* Estado */}
            <div className="col-6">
                <label>Estado</label>
                <Dropdown
                    className="w-full"
                    value={form.is_active}
                    options={statusOptions}
                    onChange={(e) =>
                        setForm({ ...form, is_active: e.value })
                    }
                />
            </div>

            {/* Fechas */}
            <div className="col-6">
                <label>Inicio</label>
                <Calendar
                    className="w-full"
                    showTime
                    value={
                        form.starts_at
                            ? new Date(form.starts_at)
                            : undefined
                    }
                    onChange={(e) =>
                        setForm({
                            ...form,
                            starts_at: e.value?.toISOString()
                        })
                    }
                />
            </div>

            <div className="col-6">
                <label>Fin</label>
                <Calendar
                    className="w-full"
                    showTime
                    value={
                        form.ends_at
                            ? new Date(form.ends_at)
                            : undefined
                    }
                    onChange={(e) =>
                        setForm({
                            ...form,
                            ends_at: e.value?.toISOString()
                        })
                    }
                />
            </div>

            {/* Actions */}
            <div className="col-12 flex justify-content-end gap-2 mt-3">
                <Button
                    label="Cancelar"
                    outlined
                    severity="secondary"
                    onClick={onCancel}
                />
                <Button
                    label="Guardar"
                    icon="pi pi-save"
                    loading={loading}
                    onClick={onSubmit}
                />
            </div>
        </div>
    );
};

export default PromoMultiForm;
