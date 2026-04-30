'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CalendarView({ appointments }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const today = new Date();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const days = [];
    
    // Pad empty cells before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`pad-${i}`} className="calendar-cell empty"></div>);
    }

    // Render days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = new Date(year, currentDate.getMonth(), day).toDateString();
        const isToday = today.toDateString() === dateStr;
        
        // Find appointments for this day
        const dayAppointments = appointments.filter(apt => {
            return new Date(apt.date).toDateString() === dateStr;
        });

        days.push(
            <div key={day} className={`calendar-cell ${isToday ? 'today' : ''}`} style={{ 
                minHeight: '120px', 
                border: '1px solid var(--border-color)', 
                padding: '0.5rem',
                backgroundColor: isToday ? '#f0fdfa' : 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                borderTopLeftRadius: (day === 1 && firstDay === 0) ? 'var(--radius-md)' : '0',
                transition: 'background-color 0.2s',
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                }}>
                    <span style={{ 
                        fontWeight: isToday ? 800 : 600, 
                        color: isToday ? 'var(--primary-color)' : 'var(--text-main)',
                        backgroundColor: isToday ? '#ccfbf1' : 'transparent',
                        borderRadius: 'var(--radius-full)',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem'
                    }}>{day}</span>
                    {dayAppointments.length > 0 && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{dayAppointments.length}</span>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', flex: 1, maxHeight: '80px' }} className="no-scrollbar">
                    {dayAppointments.map((apt, idx) => {
                        const aptTime = new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        // Determine color based on appointment type
                        let bgColor = '#e0f2fe';
                        let textColor = '#0369a1';
                        
                        if (apt.type.includes('Follow-up')) {
                            bgColor = '#dcfce7';
                            textColor = '#166534';
                        } else if (apt.type.includes('Physical') || apt.type.includes('Annual')) {
                            bgColor = '#fef3c7';
                            textColor = '#92400e';
                        } else if (apt.type.includes('Urgent')) {
                            bgColor = '#fee2e2';
                            textColor = '#991b1b';
                        }

                        return (
                            <Link href={`/patients/${apt.patient_id}`} key={idx} style={{ textDecoration: 'none' }}>
                                <div style={{ 
                                    backgroundColor: bgColor, 
                                    color: textColor, 
                                    fontSize: '0.7rem', 
                                    padding: '0.2rem 0.4rem', 
                                    borderRadius: '4px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    border: `1px solid ${textColor}30`
                                }} title={`${aptTime} - ${apt.first_name} ${apt.last_name} (${apt.type})`}>
                                    {aptTime} {apt.last_name}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="calendar-wrapper" style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined">calendar_month</span>
                    {monthName} {year}
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setCurrentDate(new Date())} style={{ padding: '0.4rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Today</button>
                    <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <button onClick={prevMonth} className="btn-icon" style={{ borderRadius: 0, border: 'none', borderRight: '1px solid var(--border-color)' }}><span className="material-symbols-outlined">chevron_left</span></button>
                        <button onClick={nextMonth} className="btn-icon" style={{ borderRadius: 0, border: 'none' }}><span className="material-symbols-outlined">chevron_right</span></button>
                    </div>
                </div>
            </div>

            <div className="calendar-grid" style={{ padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0', borderLeft: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: '#f8fafc' }}>
                            {day}
                        </div>
                    ))}
                    {days.map((cell, index) => {
                        // We need to apply border right and bottom to make the grid perfect
                        const styleWithBorders = {
                            ...cell.props.style,
                            borderRight: '1px solid var(--border-color)',
                            borderBottom: '1px solid var(--border-color)',
                            borderTop: 'none',
                            borderLeft: 'none'
                        };
                        return { ...cell, props: { ...cell.props, style: styleWithBorders } };
                    })}
                </div>
            </div>
            
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .calendar-cell:hover {
                    background-color: #f8fafc !important;
                }
                .calendar-cell.today:hover {
                    background-color: #e6fdf9 !important;
                }
            `}</style>
        </div>
    );
}
