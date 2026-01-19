'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import RafflesTable, { Raffle } from '@/components/raffles/RafflesTable';
import RafflesForm from '@/components/raffles/RafflesForm';
import { getRaffles } from '@/services/raffle.service';
import { deleteRaffle } from '@/services/raffle.service';
import AssignWinnerModal from '@/components/raffles/AssignWinnerModal';
import { assignRaffleWinner } from '@/services/raffle.service';

import RafflesFilters from '@/components/raffles/RafflesFilters';
import { getRafflesFiltered } from '@/services/raffle.service';



const RafflesPage = () => {

    const [data, setData] = useState<Raffle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Raffle | null>(null);
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
    const [assigningWinner, setAssigningWinner] = useState(false);
    const [filterTitle, setFilterTitle] = useState('');



    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await getRafflesFiltered({
                title: filterTitle || undefined
            });
            setData(result);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta rifa?')) return;

        try {
            await deleteRaffle(id);
            loadData();
        } catch (e) {
            alert('Error al eliminar la rifa');
        }
    };

    const onAssignWinner = (raffle: Raffle) => {
        setSelectedRaffle(raffle);
        setShowWinnerModal(true);
    };


    return (
        <div className="grid">
            <div className="col-12">
                <div className="flex justify-content-between align-items-center mb-3">
                    <h4 className="m-0">Rifas</h4>
                    <Button
                        label="Nueva Rifa"
                        icon="pi pi-plus"
                        onClick={() => {
                            setEditing(null);
                            setShowForm(true);
                        }}
                    />
                </div>

                <RafflesFilters
                    title={filterTitle}
                    onChange={(f) => {
                        setFilterTitle(f.title || '');
                        setTimeout(loadData, 0);
                    }}
                />


                <div className="card">
                    <RafflesTable
                        data={data}
                        loading={loading}
                        onEdit={(row) => {
                            setEditing(row);
                            setShowForm(true);
                        }}
                        onDelete={onDelete}
                        onAssignWinner={onAssignWinner}
                    />
                </div>

                <Dialog header={editing ? 'Editar Rifa' : 'Nueva Rifa'} visible={showForm} style={{ width: '500px' }} modal onHide={() => setShowForm(false)}>
                    <RafflesForm
                        initialData={editing}
                        onCancel={() => setShowForm(false)}
                        onSuccess={() => {
                            setShowForm(false);
                            loadData();
                        }}
                    />
                </Dialog>

                {selectedRaffle && (
                    <AssignWinnerModal
                        raffleId={selectedRaffle.id}
                        visible={showWinnerModal}
                        onHide={() => {
                            setShowWinnerModal(false);
                            setSelectedRaffle(null);
                        }}
                        onConfirm={async (ticketNumber) => {
                            try {
                                setAssigningWinner(true);

                                await assignRaffleWinner({
                                    raffle_id: selectedRaffle.id,
                                    ticket_number: ticketNumber
                                });

                                setShowWinnerModal(false);
                                setSelectedRaffle(null);
                                loadData(); // 🔄 refresca tabla
                            } catch (e) {
                                alert('Error al asignar ganador');
                                console.error(e);
                            } finally {
                                setAssigningWinner(false);
                            }
                        }}
                    />
                )}


            </div>
        </div>
    );
};

export default RafflesPage;
