'use client';

import { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useRouter } from 'next/navigation';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom Toolbar
const CustomToolbar = (toolbar) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    const label = () => {
        let text = toolbar.label;
        const currentYear = toolbar.date ? toolbar.date.getFullYear().toString() : new Date().getFullYear().toString();
        if (!text.includes(currentYear)) {
            text = `${text}, ${currentYear}`;
        }
        return (
            <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>
                {text}
            </span>
        );
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        if (!isNaN(newDate.getTime())) {
            const adjustedDate = new Date(newDate.getTime() + newDate.getTimezoneOffset() * 60000);
            toolbar.onNavigate('DATE', adjustedDate);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button onClick={goToCurrent} className="btn" style={{ padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', border: 'none', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', transition: 'all 0.2s' }}>Today</button>
                <div style={{ display: 'flex', backgroundColor: 'white', borderRadius: 'var(--radius-full)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <button onClick={goToBack} className="btn-icon" style={{ borderRadius: 0, border: 'none', padding: '0.5rem 0.75rem', borderRight: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer', transition: 'background-color 0.2s' }}><span className="material-symbols-outlined">chevron_left</span></button>
                    <button onClick={goToNext} className="btn-icon" style={{ borderRadius: 0, border: 'none', padding: '0.5rem 0.75rem', color: 'var(--text-main)', cursor: 'pointer', transition: 'background-color 0.2s' }}><span className="material-symbols-outlined">chevron_right</span></button>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {label()}
                <input 
                    type="date" 
                    onChange={handleDateChange} 
                    style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: 'var(--radius-full)', 
                        border: 'none',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                        outline: 'none',
                        color: 'var(--primary-dark)',
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        backgroundColor: 'var(--bg-main)'
                    }} 
                />
            </div>

            <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'white', padding: '0.25rem', borderRadius: 'var(--radius-full)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <button onClick={() => toolbar.onView('month')} style={{ padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', border: 'none', backgroundColor: toolbar.view === 'month' ? 'var(--primary-color)' : 'transparent', color: toolbar.view === 'month' ? 'white' : 'var(--text-main)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Month</button>
                <button onClick={() => toolbar.onView('week')} style={{ padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', border: 'none', backgroundColor: toolbar.view === 'week' ? 'var(--primary-color)' : 'transparent', color: toolbar.view === 'week' ? 'white' : 'var(--text-main)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Week</button>
                <button onClick={() => toolbar.onView('day')} style={{ padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', border: 'none', backgroundColor: toolbar.view === 'day' ? 'var(--primary-color)' : 'transparent', color: toolbar.view === 'day' ? 'white' : 'var(--text-main)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Day</button>
            </div>
        </div>
    );
};

export default function CalendarView({ appointments }) {
    const router = useRouter();
    const [view, setView] = useState(Views.WEEK);
    const [date, setDate] = useState(new Date());

    const events = appointments.map(apt => {
        const startDate = new Date(apt.date);
        const endDate = new Date(startDate);
        if (apt.type.includes('Physical') || apt.type.includes('Annual') || apt.type.includes('New Patient')) {
            endDate.setMinutes(endDate.getMinutes() + 60);
        } else {
            endDate.setMinutes(endDate.getMinutes() + 30);
        }

        return {
            id: apt.id,
            title: `${apt.first_name} ${apt.last_name} - ${apt.type}`,
            start: startDate,
            end: endDate,
            resource: apt,
            type: apt.type
        };
    });

    const eventPropGetter = (event) => {
        let backgroundColor = '#e0f2fe';
        let color = '#0369a1';
        let borderColor = '#bae6fd';
        
        if (event.type.includes('Follow-up')) {
            backgroundColor = '#dcfce7';
            color = '#166534';
            borderColor = '#bbf7d0';
        } else if (event.type.includes('Physical') || event.type.includes('Annual')) {
            backgroundColor = '#fef3c7';
            color = '#92400e';
            borderColor = '#fde68a';
        } else if (event.type.includes('Urgent')) {
            backgroundColor = '#fee2e2';
            color = '#991b1b';
            borderColor = '#fecaca';
        }

        return { 
            style: { 
                backgroundColor, 
                color, 
                border: `1px solid ${borderColor}`,
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '4px 6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                margin: '1px'
            } 
        };
    };

    const handleSelectEvent = (event) => {
        router.push(`/patients/${event.resource.patient_id}`);
    };

    return (
        <div className="widget" style={{ padding: '1rem', height: '800px', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ flex: 1 }}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                views={['month', 'week', 'day']}
                eventPropGetter={eventPropGetter}
                components={{
                    toolbar: CustomToolbar
                }}
                onSelectEvent={handleSelectEvent}
                min={new Date(0, 0, 0, 8, 0, 0)} 
                max={new Date(0, 0, 0, 18, 0, 0)} 
            />
            
            <style jsx global>{`
                .rbc-calendar {
                    font-family: inherit;
                }
                .rbc-header {
                    padding: 1rem 0.5rem;
                    font-weight: 700;
                    color: var(--text-main);
                    font-size: 0.9rem;
                    border-bottom: 1px solid var(--border-color);
                    background-color: rgba(249, 250, 251, 0.8);
                }
                .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    background-color: white;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                }
                .rbc-day-bg + .rbc-day-bg, .rbc-month-row + .rbc-month-row {
                    border-color: var(--border-color);
                }
                .rbc-time-content {
                    border-top: 1px solid var(--border-color);
                }
                .rbc-timeslot-group {
                    border-bottom: 1px dashed var(--border-color);
                }
                .rbc-time-header-content {
                    border-left: 1px solid var(--border-color);
                }
                .rbc-day-slot .rbc-time-slot {
                    border-top: none;
                }
                .rbc-today {
                    background-color: rgba(14, 165, 233, 0.05); /* very light primary */
                }
                .rbc-event {
                    padding: 0;
                    background-color: transparent;
                }
                .rbc-event-content {
                    font-size: 0.8rem;
                    line-height: 1.2;
                }
                .rbc-current-time-indicator {
                    background-color: var(--accent-red);
                    height: 2px;
                }
                .rbc-current-time-indicator::before {
                    content: '';
                    position: absolute;
                    left: -4px;
                    top: -4px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: var(--accent-red);
                }
                .btn-icon:hover {
                    background-color: var(--bg-main);
                }
            `}</style>
        </div>
    );
}
