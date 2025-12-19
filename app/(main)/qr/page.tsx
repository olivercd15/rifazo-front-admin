'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import QrTable, { QrImage } from '@/components/qr/QrTable';
import QrForm from '@/components/qr/QrForm';
import { getQrImages, deleteQrImage } from '@/services/qr.service';

const QrPage = () => {
    const [data, setData] = useState<QrImage[]>([]);
    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState<QrImage | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await getQrImages();
            setData(result);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id: string) => {
        if (!confirm('¿Eliminar este QR?')) return;
        await deleteQrImage(id);
        loadData();
    };

    const onOpenCreate = () => {
        setEditing(null);
        setShowForm(true);
    };

    const onOpenEdit = (row: QrImage) => {
        setEditing(row);
        setShowForm(true);
    };

    const onLocalUpdate = (id: string, value: boolean) => {
        setData((prev) => prev.map((item) => (item.id === id ? { ...item, is_enabled: value } : item)));
    };

    return (
        <div className="grid">
            <div className="col-12">
                {/* Header */}
                <div className="flex justify-content-between align-items-center mb-3">
                    <h4 className="m-0">QR disponibles</h4>
                    <Button label="Nuevo QR" icon="pi pi-plus" onClick={onOpenCreate} />
                </div>

                {/* Tabla */}
                <div className="card">
                    <QrTable data={data} loading={loading} onEdit={onOpenEdit} onDelete={onDelete} onLocalUpdate={onLocalUpdate} />
                </div>

                {/* MODAL */}
                <Dialog header={editing ? 'Editar QR' : 'Nuevo QR'} visible={showForm} style={{ width: '480px' }} modal closable={!loading} onHide={() => setShowForm(false)}>
                    <QrForm
                        initialData={editing}
                        onSuccess={() => {
                            setShowForm(false);
                            setEditing(null);
                            loadData();
                        }}
                        onCancel={() => {
                            setShowForm(false);
                            setEditing(null);
                        }}
                    />
                </Dialog>
            </div>
        </div>
    );
};

export default QrPage;
