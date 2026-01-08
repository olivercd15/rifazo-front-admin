'use client';

import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

type Props = {
    isActive?: boolean;
    promoName?: string;
    onChange: (filters: { isActive?: boolean; promoName?: string }) => void;
};

const statusOptions = [
    { label: 'Activas', value: true },
    { label: 'Inactivas', value: false }
];

const PromoMultiFilters = ({ isActive, promoName, onChange }: Props) => {
    return (
        <div className="card mb-3">
            <div className="grid align-items-center">
                {/* Estado */}
                <div className="col-12 md:col-3">
                    <label className="block mb-2 font-medium">Estado</label>
                    <Dropdown
                        value={isActive}
                        options={statusOptions}
                        placeholder="Todas"
                        showClear
                        className="w-full"
                        onChange={(e) =>
                            onChange({
                                isActive: e.value,
                                promoName
                            })
                        }
                    />
                </div>

                {/* Nombre de promoción */}
                <div className="col-12 md:col-9">
                    <label className="block mb-2 font-medium">
                        Nombre de la promoción
                    </label>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-tag" />
                        <InputText
                            value={promoName}
                            placeholder="Ej: Promo 2x1"
                            className="w-full"
                            onChange={(e) =>
                                onChange({
                                    isActive,
                                    promoName: e.target.value
                                })
                            }
                        />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PromoMultiFilters;
