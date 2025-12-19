'use client';

import React, { useEffect, useState } from 'react';
import PaymentsTable, { AdminPayment } from '@/components/payments/PaymentsTable';
import PaymentFilters from '@/components/payments/PaymentsFilters';
import VoucherModal from '@/components/payments/VoucherModal';
import { getAdminPayments, approvePayment, rejectPayment } from '@/services/payment.service';
import TicketNumbersModal from '@/components/payments/TicketsNumbersModal';

const PaymentsPage = () => {
    const [data, setData] = useState<AdminPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string>('delivered');
    const [userName, setUserName] = useState<string>();
    const [userPhone, setUserPhone] = useState<string>();
    const [voucherUrl, setVoucherUrl] = useState<string>();
    const [showVoucher, setShowVoucher] = useState(false);
    const [showTickets, setShowTickets] = useState(false);
    const [ticketNumbers, setTicketNumbers] = useState<number[]>([]);

    const load = async () => {
        setLoading(true);
        const res = await getAdminPayments({ status, user_name: userName, user_phone: userPhone });
        setData(res);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, [status, userName, userPhone]);

    return (
        <div className="grid">
            <div className="col-12">
                <h4 className="mb-3">Pagos</h4>

                <PaymentFilters
                    status={status}
                    userName={userName}
                    userPhone={userPhone}
                    onChange={(f) => {
                        setStatus(f.status ?? 'delivered');
                        setUserName(f.userName);
                        setUserPhone(f.userPhone);
                    }}
                />

                <div className="card">
                    <PaymentsTable
                        data={data}
                        loading={loading}
                        onViewVoucher={(url) => {
                            setVoucherUrl(url);
                            setShowVoucher(true);
                        }}
                        onViewTickets={(numbers) => {
                            setTicketNumbers(numbers);
                            setShowTickets(true);
                        }}
                        onApprove={async (id) => {
                            if (confirm('¿Aprobar pago?')) {
                                await approvePayment(id);
                                load();
                            }
                        }}
                        onReject={async (id) => {
                            if (confirm('¿Rechazar pago?')) {
                                await rejectPayment(id);
                                load();
                            }
                        }}
                    />
                </div>

                <VoucherModal visible={showVoucher} url={voucherUrl} onHide={() => setShowVoucher(false)} />
                <TicketNumbersModal visible={showTickets} numbers={ticketNumbers} onHide={() => setShowTickets(false)} />
            </div>
        </div>
    );
};

export default PaymentsPage;
