import { sql } from '@vercel/postgres';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export default async function GlobalDashboard() {
    // Fetch global metrics
    const { rows: patientsCountResult } = await sql`SELECT COUNT(*) FROM patients`;
    const totalPatients = patientsCountResult[0].count;
    
    // Fetch all upcoming appointments
    const { rows: allAppointments } = await sql`
        SELECT a.*, p.first_name, p.last_name 
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        ORDER BY a.date ASC
    `;

    // Fetch all unread messages
    const { rows: unreadMessages } = await sql`
        SELECT m.*, p.first_name, p.last_name
        FROM messages m
        JOIN patients p ON m.patient_id = p.id
        WHERE m.read = false
        ORDER BY m.date DESC
    `;

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-wrapper">
                <header className="patient-header">
                    <div className="patient-profile">
                        <div className="patient-info">
                            <h1 className="patient-name">Clinic Overview</h1>
                            <div className="patient-meta">
                                <span className="meta-item"><span className="material-symbols-outlined">today</span> {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="dashboard-area" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                    
                    {/* Top Metrics Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <Link href="/patients" className="widget" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--primary-color)', textDecoration: 'none', cursor: 'pointer' }}>
                            <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '1rem', borderRadius: 'var(--radius-full)', display: 'flex' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>group</span>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Active Patients</div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{totalPatients}</div>
                            </div>
                        </Link>

                        <Link href="/appointments" className="widget" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--accent-blue)', textDecoration: 'none', cursor: 'pointer' }}>
                            <div style={{ backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', padding: '1rem', borderRadius: 'var(--radius-full)', display: 'flex' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>event</span>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Upcoming Appointments</div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{allAppointments.length}</div>
                            </div>
                        </Link>

                        <Link href="/inbox" className="widget" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--accent-red)', textDecoration: 'none', cursor: 'pointer' }}>
                            <div style={{ backgroundColor: 'var(--accent-red-light)', color: 'var(--accent-red)', padding: '1rem', borderRadius: 'var(--radius-full)', display: 'flex' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>mark_email_unread</span>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Action Required</div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{unreadMessages.length}</div>
                            </div>
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                        
                        {/* Upcoming Schedule */}
                        <div className="widget">
                            <div className="widget-header" style={{ padding: '1rem 1.5rem' }}>
                                <h2 style={{ fontSize: '1rem' }}><span className="material-symbols-outlined">calendar_month</span> Practice Schedule</h2>
                                <button className="btn-icon"><span className="material-symbols-outlined">more_vert</span></button>
                            </div>
                            <div className="widget-content" style={{ padding: '0', maxHeight: '500px' }}>
                                {allAppointments.length === 0 ? (
                                    <div className="empty-state" style={{ margin: '2rem' }}>
                                        <span className="material-symbols-outlined">event_available</span>
                                        <p>No upcoming appointments scheduled.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {allAppointments.map((apt, i) => (
                                            <div key={i} style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center', 
                                                padding: '1rem 1.5rem', 
                                                borderBottom: '1px solid var(--border-color)',
                                                backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(249, 250, 251, 0.5)'
                                            }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatDate(apt.date)}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{apt.type} with {apt.provider}</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{apt.last_name}, {apt.first_name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.patient_id}</div>
                                                    </div>
                                                    <Link href={`/patients/${apt.patient_id}`} style={{ 
                                                        backgroundColor: 'white', 
                                                        border: '1px solid var(--border-color)', 
                                                        padding: '0.4rem', 
                                                        borderRadius: 'var(--radius-md)', 
                                                        display: 'flex', 
                                                        color: 'var(--primary-color)',
                                                        textDecoration: 'none'
                                                    }}>
                                                        <span className="material-symbols-outlined">arrow_forward</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notifications / Inbox */}
                        <div className="widget">
                            <div className="widget-header" style={{ padding: '1rem 1.5rem' }}>
                                <h2 style={{ fontSize: '1rem' }}><span className="material-symbols-outlined">inbox</span> Priority Inbox</h2>
                            </div>
                            <div className="widget-content" style={{ padding: '1rem', maxHeight: '500px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {unreadMessages.length === 0 ? (
                                    <div className="empty-state">
                                        <span className="material-symbols-outlined">done_all</span>
                                        <p>Inbox zero!</p>
                                    </div>
                                ) : (
                                    unreadMessages.map((msg, i) => (
                                        <div key={i} className="card unread" style={{ padding: '1rem' }}>
                                            <div className="card-header">
                                                <div>
                                                    <div className="card-title" style={{ fontSize: '0.9rem' }}>{msg.subject}</div>
                                                    <div className="item-sub" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                                                        <Link href={`/patients/${msg.patient_id}`} style={{ 
                                                            fontSize: '0.85rem',
                                                            backgroundColor: 'var(--primary-light)',
                                                            color: 'var(--primary-dark)',
                                                            padding: '0.35rem 0.85rem',
                                                            borderRadius: 'var(--radius-full)',
                                                            textDecoration: 'none',
                                                            fontWeight: 600,
                                                            border: '1px solid var(--primary-color)',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            <span className="material-symbols-outlined" style={{fontSize: '1rem'}}>person</span>
                                                            {msg.last_name}, {msg.first_name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body" style={{ marginTop: '0.5rem' }}>{msg.preview}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
