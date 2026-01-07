'use client';

import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

import type { Raffle } from './RafflesTable';
import { createRaffle, updateRaffle, uploadRaffleCardEdge } from '@/services/raffle.service';



type Props = {
    initialData?: Raffle | null;
    onSuccess: () => void;
    onCancel: () => void;
};

const statusOptions = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
];

const timeSlotsOptions = [
    { label: 'Morning', value: 'morning' },
    { label: 'Afternoon', value: 'afternoon' },
    { label: 'Evening', value: 'evening' }
];

const RafflesForm = ({ initialData, onSuccess, onCancel }: Props) => {
    const [form, setForm] = useState<Partial<Raffle>>({
        title: '',
        description: '',
        prize_description: '',
        prize_value: '0',
        ticket_price: '0',
        max_tickets: '0',
        status: 'upcoming',
        draw_date: '',
        stream_url: '',
        time_slot: ''
    });

    const [loading, setLoading] = useState(false);

    const [cardFile, setCardFile] = useState<File | null>(null);

    async function uploadFileDirect(
        uploadUrl: string,
        file: File
    ) {
        const res = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type
            },
            body: file
        });

        if (!res.ok) {
            throw new Error('Upload failed');
        }
    }


    const getPublicMediaUrl = (path?: string) => {
        if (!path) return '';
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
    };

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    const onSubmit = async () => {
        try {
            setLoading(true);

            let payload = { ...form };

            if (cardFile && initialData?.id) {

                // 1️⃣ pedir signed upload
                const { upload_url, public_path } =
                    await uploadRaffleCardEdge({
                        raffle_id: initialData.id,
                        file_name: cardFile.name,
                        content_type: cardFile.type
                    });

                // 2️⃣ subir archivo directo
                await uploadFileDirect(upload_url, cardFile);

                // 3️⃣ guardar URL pública
                const publicUrl =
                    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/PAYMENTS/${public_path}`;

                payload.url_card_image = `PAYMENTS/${public_path}`;
            }



            if (initialData?.id) {
                await updateRaffle(initialData.id, payload);
            } else {
                await createRaffle(payload);
            }

            onSuccess();
        } catch (e) {
            console.error(e);
            alert('Error al guardar la rifa');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="grid">
            <div className="col-12">
                <label>Título</label>
                <InputText className="w-full" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="col-12">
                <label>Descripción</label>
                <InputText className="w-full" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="col-12">
                <label>Descripción Premio</label>
                <InputText className="w-full" value={form.prize_description} onChange={(e) => setForm({ ...form, prize_description: e.target.value })} />
            </div>

            <div className="col-6">
                <label>Valor Premio (BOB)</label>
                <InputNumber className="w-full" value={Number(form.prize_value)} onValueChange={(e) => setForm({ ...form, prize_value: String(e.value ?? 0) })} />
            </div>

            <div className="col-6">
                <label>Precio Ticket (BOB)</label>
                <InputNumber className="w-full" value={Number(form.ticket_price)} onValueChange={(e) => setForm({ ...form, ticket_price: String(e.value ?? 0) })} />
            </div>

            <div className="col-6">
                <label>Máx. Tickets</label>
                <InputNumber className="w-full" value={Number(form.max_tickets)} onValueChange={(e) => setForm({ ...form, max_tickets: String(e.value ?? 0) })} />
            </div>

            <div className="col-6">
                <label>Estado</label>
                <Dropdown className="w-full" value={form.status} options={statusOptions} onChange={(e) => setForm({ ...form, status: e.value })} />
            </div>

            <div className="col-6">
                <label>Fecha Sorteo</label>
                <Calendar className="w-full" showTime value={form.draw_date ? new Date(form.draw_date) : undefined} onChange={(e) => setForm({ ...form, draw_date: e.value?.toISOString() })} />
            </div>

            <div className="col-6">
                <label>Horario</label>
                <Dropdown className="w-full" value={form.time_slot} options={timeSlotsOptions} onChange={(e) => setForm({ ...form, time_slot: e.value })} />
            </div>

            <div className="col-12">
                <label>URL Streaming</label>
                <InputText className="w-full" value={form.stream_url} onChange={(e) => setForm({ ...form, stream_url: e.target.value })} />
            </div>

            <div className="col-12">
                <label>Imagen / Video de la Card</label>
                <input
                    id="cardFile"
                    type="file"
                    accept="image/*,video/mp4"
                    hidden
                    onChange={(e) => {
                        if (e.target.files?.length) {
                            setCardFile(e.target.files[0]);
                        }
                    }}
                />
                <Button
                    label={cardFile ? 'Cambiar archivo' : 'Seleccionar imagen / video'}
                    icon="pi pi-upload"
                    className="p-button-outlined p-button-secondary w-full"
                    onClick={() => document.getElementById('cardFile')?.click()}
                />
                {cardFile && (
                    <small className="block mt-2 text-gray-500">
                        Archivo seleccionado: <b>{cardFile.name}</b>
                    </small>
                )}
            </div>

            {form.url_card_image && (
                <div className="col-12 mt-2">
                    {form.url_card_image.endsWith('.mp4') ? (
                        <video
                            src={getPublicMediaUrl(form.url_card_image)}
                            controls
                            preload="metadata"
                            style={{ width: '100%', borderRadius: 10 }}
                        />
                    ) : (
                        <img
                            src={getPublicMediaUrl(form.url_card_image)}
                            style={{ width: '100%', borderRadius: 10 }}
                        />
                    )}
                </div>
            )}



            <div className="col-12 flex justify-content-end gap-2 mt-3">
                <Button label="Cancelar" outlined severity="secondary" onClick={onCancel} />
                <Button label="Guardar" icon="pi pi-save" loading={loading} onClick={onSubmit} />
            </div>
        </div>
    );
};

export default RafflesForm;
