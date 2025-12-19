import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { createQrImage, createQrImageEdge, updateQrImage } from '@/services/qr.service';

export type QrImage = {
    id?: string;
    name: string;
    url_image: string;
    is_enabled: boolean;
};

const QrForm = ({ initialData, onSuccess, onCancel }: { initialData?: QrImage | null; onSuccess: () => void; onCancel: () => void }) => {
    const [form, setForm] = useState<QrImage>({
        name: '',
        url_image: '',
        is_enabled: true
    });

    const [loading, setLoading] = useState(false);
    const [imageBase64, setImageBase64] = useState<string>('');

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        }
    }, [initialData]);

    const onSubmit = async () => {
        try {
            setLoading(true);

            if (!form.name.trim()) {
                alert('El nombre es obligatorio');
                return;
            }

            if (!form.id && !imageBase64) {
                alert('Debes seleccionar una imagen');
                return;
            }

            if (form.id) {
                // EDITAR (sin imagen nueva)
                await updateQrImage(form.id, {
                    name: form.name,
                    is_enabled: form.is_enabled,
                    url_image: ''
                });
            } else {
                // CREAR (con imagen)
                await createQrImageEdge({
                    name: form.name,
                    image_base64: imageBase64,
                    is_enabled: form.is_enabled
                });
            }

            onSuccess();
        } catch (e) {
            console.error(e);
            alert('Error al guardar');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="card mb-4">
            <h5 className="mb-4">{form.id ? 'Editar QR' : 'Nuevo QR'}</h5>

            {/* Nombre */}
            <div className="field mb-4">
                <label className="block mb-2 font-medium">Nombre</label>
                <InputText value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full" placeholder="Ej: QR YAPE" />
            </div>

            {/* Imagen */}
            <div className="field mb-4">
                <label className="block mb-2 font-medium">Imagen QR</label>

                <div className="flex align-items-center gap-3">
                    <label htmlFor="qr-upload" className="p-button p-component p-button-outlined" style={{ cursor: 'pointer' }}>
                        <i className="pi pi-upload mr-2" />
                        Seleccionar imagen
                    </label>

                    <input
                        id="qr-upload"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setImageBase64(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                        }}
                    />

                    {imageBase64 && (
                        <span className="text-sm text-green-600">
                            <i className="pi pi-check-circle mr-1" />
                            Imagen cargada
                        </span>
                    )}
                </div>

                {/* Preview */}
                {imageBase64 && (
                    <div className="mt-3">
                        <img
                            src={imageBase64}
                            alt="Preview QR"
                            style={{
                                maxWidth: '180px',
                                borderRadius: '8px',
                                border: '1px solid var(--surface-border)'
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Activo */}
            <div className="field-checkbox mb-4 flex align-items-center">
                <Checkbox checked={form.is_enabled} onChange={(e) => setForm({ ...form, is_enabled: !!e.checked })} />
                <label className="ml-2 font-medium">Activo</label>
            </div>

            {/* Acciones */}
            <div className="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" onClick={onCancel} outlined />
                <Button label="Guardar" icon="pi pi-save" loading={loading} onClick={onSubmit} />
            </div>
        </div>
    );

};

export default QrForm;
