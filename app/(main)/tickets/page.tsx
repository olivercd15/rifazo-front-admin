'use client';

import React, { useEffect, useState } from 'react';
import TicketsTable, { AdminTicket } from '@/components/tickets/TicketsTable';
import TicketFilters from '@/components/tickets/TicketsFilters';
import { getAdminTickets, cancelTicket } from '@/services/ticket.service';

const TicketsPage = () => {
    const [data, setData] = useState<AdminTicket[]>([]);
    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState<string | undefined>('pending');
    const [userName, setUserName] = useState<string | undefined>();
    const [userPhone, setUserPhone] = useState<string | undefined>();

    useEffect(() => {
        const timer = setTimeout(() => {
            loadData();
        }, 300);

        return () => clearTimeout(timer);
    }, [status, userName, userPhone]);


    const loadData = async () => {
        try {
            setLoading(true);
            const result = await getAdminTickets({
                status,
                user_name: userName,
                user_phone: userPhone
            });
            setData(result);
        } finally {
            setLoading(false);
        }
    };

    const onCancel = async (ticketId: string) => {
        if (!confirm('¿Cancelar la reserva de este ticket?')) return;
        await cancelTicket(ticketId);
        loadData();
    };

    return (
        <div className="grid">
            <div className="col-12">
                <h4 className="mb-3">Gestión de Tickets</h4>

                <TicketFilters
                    status={status}
                    userName={userName}
                    onChange={(f) => {
                        setStatus(f.status);
                        setUserName(f.userName);
                        setUserPhone(f.userPhone);
                    }}
                />

                <div className="card">
                    <TicketsTable data={data} loading={loading} onCancel={onCancel} />
                </div>
            </div>
        </div>
    );
};

export default TicketsPage;
