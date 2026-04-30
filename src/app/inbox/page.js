import { sql } from '@vercel/postgres';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

function formatDate(dateString) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
    const { rows: allMessages } = await sql`
        SELECT m.*, p.first_name, p.last_name 
        FROM messages m
        JOIN patients p ON m.patient_id = p.id
        ORDER BY m.date DESC
    `;

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-wrapper">
                <header className="patient-header">
                    <div className="patient-profile">
                        <div className="patient-info">
                            <h1 className="patient-name">Priority Inbox</h1>
                            <div className="patient-meta">
                                <span className="meta-item"><span className="material-symbols-outlined">mark_email_unread</span> {allMessages.filter(m => !m.read).length} Unread Messages</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="dashboard-area" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                    <div className="widget" style={{ padding: '0', overflow: 'hidden' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.25rem' }}>All Messages</button>
                                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', paddingBottom: '0.25rem' }}>Unread Only</button>
                                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', paddingBottom: '0.25rem' }}>Archived</button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.2rem' }}>search</span>
                                <input type="text" placeholder="Search inbox..." style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }} />
                            </div>
                        </div>

                        {allMessages.length === 0 ? (
                            <div className="empty-state" style={{ margin: '3rem' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '3rem' }}>done_all</span>
                                <h3>Inbox Zero!</h3>
                                <p>You're all caught up.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {allMessages.map((msg, i) => (
                                    <div key={i} style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'auto 200px 1fr auto', 
                                        gap: '1rem',
                                        alignItems: 'center', 
                                        padding: '1rem 1.5rem', 
                                        borderBottom: '1px solid var(--border-color)',
                                        backgroundColor: !msg.read ? '#f0fdfa' : 'white',
                                        borderLeft: !msg.read ? '4px solid var(--primary-color)' : '4px solid transparent',
                                        cursor: 'pointer',
                                        transition: 'var(--transition)'
                                    }}
                                    >
                                        <div style={{ color: !msg.read ? 'var(--primary-color)' : 'var(--text-muted)' }}>
                                            <span className="material-symbols-outlined">{!msg.read ? 'mark_email_unread' : 'drafts'}</span>
                                        </div>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: !msg.read ? 700 : 500, color: 'var(--text-main)', fontSize: '0.95rem' }}>{msg.sender}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(msg.date)}</span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: !msg.read ? 600 : 500, color: 'var(--text-main)', fontSize: '0.95rem' }}>{msg.subject}</span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.preview}</span>
                                        </div>

                                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <Link href={`/patients/${msg.patient_id}`} style={{ 
                                                fontSize: '0.8rem', 
                                                backgroundColor: 'var(--bg-main)', 
                                                padding: '0.25rem 0.75rem', 
                                                borderRadius: 'var(--radius-full)', 
                                                color: 'var(--text-main)',
                                                textDecoration: 'none',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                {msg.last_name}, {msg.first_name}
                                            </Link>
                                            <button className="btn-icon"><span className="material-symbols-outlined">more_vert</span></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
