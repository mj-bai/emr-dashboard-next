import { sql } from '@vercel/postgres';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

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

                <main className="dashboard-area" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                    <div className="widget" style={{ padding: '2rem' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className="material-symbols-outlined">calendar_month</span> 
                                Upcoming Appointments
                            </h2>
                            <button className="btn-icon" style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: 'var(--radius-lg)', width: 'auto', padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', fontWeight: 600 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>add</span> Schedule
                            </button>
                        </div>

                        {allAppointments.length === 0 ? (
                            <div className="empty-state">
                                <span className="material-symbols-outlined" style={{ fontSize: '3rem' }}>event_available</span>
                                <h3>No Upcoming Appointments</h3>
                                <p>Your schedule is clear!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {allAppointments.map((apt, i) => {
                                    const aptDate = new Date(apt.date);
                                    const isToday = aptDate.toDateString() === new Date().toDateString();

                                    return (
                                        <div key={i} style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center', 
                                            padding: '1.5rem', 
                                            borderRadius: 'var(--radius-md)',
                                            border: isToday ? '2px solid var(--primary-light)' : '1px solid var(--border-color)',
                                            backgroundColor: isToday ? '#f0fdfa' : 'white',
                                            boxShadow: 'var(--shadow-sm)',
                                            transition: 'var(--transition)'
                                        }}>
                                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    backgroundColor: isToday ? 'var(--primary-color)' : 'var(--bg-main)',
                                                    color: isToday ? 'white' : 'var(--text-main)',
                                                    borderRadius: 'var(--radius-md)',
                                                    padding: '0.5rem 1rem',
                                                    minWidth: '80px'
                                                }}>
                                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>{aptDate.toLocaleDateString(undefined, { month: 'short' })}</span>
                                                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{aptDate.getDate()}</span>
                                                </div>
                                                
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{aptDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                                        {isToday && <span style={{ backgroundColor: 'var(--accent-red)', color: 'white', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>TODAY</span>}
                                                    </div>
                                                    <div style={{ fontSize: '1rem', color: 'var(--primary-dark)', fontWeight: 600 }}>{apt.type}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Provider: {apt.provider}</div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Patient</div>
                                                    <Link href={`/patients/${apt.patient_id}`} style={{ fontWeight: 600, color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        {apt.last_name}, {apt.first_name} <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>open_in_new</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
