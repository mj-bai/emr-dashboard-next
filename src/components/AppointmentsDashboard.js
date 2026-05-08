'use client';

import { useState } from 'react';
import Link from 'next/link';
import CalendarView from './CalendarView';

export default function AppointmentsDashboard({ allAppointments }) {
    const [viewMode, setViewMode] = useState('calendar'); // 'list' or 'calendar'

    return (
        <main className="dashboard-area" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '0.25rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                    <button 
                        onClick={() => setViewMode('list')}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.5rem', 
                            padding: '0.5rem 1rem', 
                            borderRadius: 'var(--radius-md)', 
                            border: 'none', 
                            backgroundColor: viewMode === 'list' ? 'var(--bg-main)' : 'transparent',
                            color: viewMode === 'list' ? 'var(--primary-color)' : 'var(--text-muted)',
                            fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>format_list_bulleted</span> List
                    </button>
                    <button 
                        onClick={() => setViewMode('calendar')}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.5rem', 
                            padding: '0.5rem 1rem', 
                            borderRadius: 'var(--radius-md)', 
                            border: 'none', 
                            backgroundColor: viewMode === 'calendar' ? 'var(--bg-main)' : 'transparent',
                            color: viewMode === 'calendar' ? 'var(--primary-color)' : 'var(--text-muted)',
                            fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>calendar_month</span> Calendar
                    </button>
                </div>
            </div>

            {viewMode === 'calendar' ? (
                <CalendarView appointments={allAppointments} />
            ) : (
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
            )}
        </main>
    );
}
