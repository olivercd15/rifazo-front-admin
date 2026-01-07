'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { classNames } from 'primereact/utils';
import { getUserProfiles, createUserProfiles } from '@/services/userProfiles.service';
import {signUpUser} from '@/services/auth.service';
import {userProfiles as Profiles, updateUserProfile} from '@/types/userProfiles'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;


const user_role = [
  { value: 'admin', label: 'Admin' },
  { value: 'premium', label: 'Premium' },
  { value: 'gold', label: 'Gold' },
  { value: 'member', label: 'Member' }
]


const UserProfiles = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [password, setPassword] = useState('');
    const [data, setData] = useState<Profiles[]>([]);
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
            const result = await getUserProfiles();
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
            <h5 className="m-0">Usuarios registrados</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter} onChange={onGlobalFilterChange} placeholder="Buscar..." />
            </span>
        </div>
    );

    /**
     * 👉 Templates
     */


    const dateBodyTemplate = (row: Profiles) => {
        return new Date(row.created_at).toLocaleDateString('es-BO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const enabledBodyTemplate = (row: Profiles) => {
        return (
            <i
                className={classNames('pi', {
                    'pi-check-circle text-green-500': row.is_active,
                    'pi-times-circle text-red-500': !row.is_active
                })}
            />
        );
    };
    const actionBodyTemplate = (row: Profiles) => {
        return (
            <Button
                label={row.is_active ? 'Deshabilitar' : 'Habilitar'}
                icon={row.is_active ? 'pi pi-ban' : 'pi pi-check'}
                className={row.is_active ? 'p-button-danger' : 'p-button-success'}
                size="small"
                onClick={() => toggleUserStatus(row)}
            />
        );
    };
    const toggleUserStatus = async (user: Profiles) => {
        try {
            setLoading(true);
            const body:updateUserProfile = {
                full_name: user.full_name,
                phone:user.phone,
                role:user.role,
                is_active: !user.is_active
            }
            await createUserProfiles(body, user.email);
            await loadData();
        } catch (error: any) {
            throw new Error('Error al crear el usuario: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await signUpUser(email, password);
            const body:updateUserProfile = {
                full_name: fullName.trim(),
                phone:phone.trim(),
                role:role.trim(),
                is_active: isActive
            }
            await createUserProfiles(body, email);
            await loadData();
        } catch (error: any) {
            throw new Error('Error al crear el usuario: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    


    const clearForm = () => {
        setEmail('');
        setFullName('');
        setPhone('');
        setRole('');
        setIsActive(true);
    };

    return (
        <div className="grid">
            <div className="col-12">
                {/* Formulario para crear nuevo usuario */}
                <div className="card mb-4">
                    <h5 className="mb-4">Crear Nuevo Usuario</h5>
                    <form onSubmit={handleSubmit} className="p-fluid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="email">Email*</label>
                            <InputText
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@email.com"
                                required
                                className="w-full"
                            />
                        </div>
                        
                        <div className="field col-12 md:col-4">
                            <label htmlFor="fullName">Nombre Completo*</label>
                            <InputText
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Juan Pérez"
                                required
                                className="w-full"
                            />
                        </div>
                        
                        <div className="field col-12 md:col-4">
                            <label htmlFor="phone">Teléfono</label>
                            <InputText
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+591 70000000"
                                className="w-full"
                            />
                        </div>
                        
                        <div className="field col-12 md:col-3">
                            <label htmlFor="role">Rol*</label>
                            <Dropdown
                                id="role"
                                value={role}
                                options={user_role}
                                onChange={(e) => setRole(e.value)}
                                placeholder="Seleccionar rol"
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="password">Password*</label>
                            <InputText
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                type="password"
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="field col-12 md:col-3 flex align-items-center">
                            <div className="flex align-items-center mt-4">
                                <Checkbox
                                    inputId="isActive"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.checked ?? true)}
                                />
                                <label htmlFor="isActive" className="ml-2">
                                    Usuario Activo
                                </label>
                            </div>
                        </div>
                        
                        <div className="field col-12 md:col-6 flex align-items-end gap-2">
                            <Button 
                                type="submit" 
                                label="Crear Usuario" 
                                icon="pi pi-user-plus" 
                                loading={loading}
                                className="p-button-success"
                            />
                            <Button 
                                type="button" 
                                label="Limpiar" 
                                icon="pi pi-refresh" 
                                onClick={clearForm}
                                className="p-button-secondary"
                                disabled={loading}
                            />
                        </div>
                    </form>
                </div>
                <div className="card">
                    <DataTable value={data} paginator rows={10} loading={loading} filters={filters} globalFilterFields={['full_name','email']} header={header} emptyMessage="No se encontraron Usuarios" showGridlines responsiveLayout="scroll">
                        <Column field="email" header="Correo" sortable/>
                        <Column field="full_name" header="Nombre Completo" sortable/>
                        <Column field="phone" header="Celular"/>
                        <Column field="role" header="Rol"/>
                        <Column field="is_enabled" header="Activo" body={enabledBodyTemplate} style={{ textAlign: 'center' }} />
                        <Column field="created_at" header="Fecha creación" body={dateBodyTemplate} sortable />
                        <Column header="Acciones"body={actionBodyTemplate} style={{ textAlign: 'center', width: '12rem' }}/>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default UserProfiles;
