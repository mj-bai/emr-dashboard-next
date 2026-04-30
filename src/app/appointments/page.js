import { sql } from '@vercel/postgres';
import Sidebar from '@/components/Sidebar';
import AppointmentsDashboard from '@/components/AppointmentsDashboard';

export const dynamic = 'force-dynamic';

export default async function AppointmentsPage() {
    const { rows: allAppointments } = await sql`
        SELECT a.*, p.first_name, p.last_name 
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        ORDER BY a.date ASC
    `;

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-wrapper">
                <header className="patient-header">
                    <div className="patient-profile">
                        <div className="patient-info">
                            <h1 className="patient-name">Appointments Schedule</h1>
                            <div className="patient-meta">
                                <span className="meta-item"><span className="material-symbols-outlined">calendar_today</span> Full Practice Calendar</span>
                            </div>
                        </div>
                    </div>
                </header>

                <AppointmentsDashboard allAppointments={allAppointments} />
            </div>
        </div>
    );
}
