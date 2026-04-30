'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export default function PatientList({ initialPatients }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPatients = initialPatients.filter(p => {
        const query = searchQuery.toLowerCase();
        const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
        return fullName.includes(query) || p.id.toLowerCase().includes(query);
    });

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-wrapper">
                <header className="patient-header">
                    <div className="patient-profile">
                        <div className="patient-info">
                            <h1 className="patient-name">Patient Directory</h1>
                        </div>
                    </div>
                </header>

                <main className="dashboard-area" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                    
                    {/* Search Bar */}
                    <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>search</span>
                            <input 
                                type="text" 
                                placeholder="Search by patient name or MRN..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ 
                                    width: '100%', 
                                    padding: '1rem 1rem 1rem 3rem', 
                                    borderRadius: 'var(--radius-lg)', 
                                    border: '1px solid var(--border-color)', 
                                    boxShadow: 'var(--shadow-sm)',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <Link href="/patients/new" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            padding: '0 1.5rem', 
                            backgroundColor: 'var(--primary-color)', 
                            color: 'white', 
                            borderRadius: 'var(--radius-lg)',
                            fontWeight: 600,
                            textDecoration: 'none'
                        }}>
                            <span className="material-symbols-outlined">add</span>
                            New Patient
                        </Link>
                    </div>

                    {/* Patient Table */}
                    <div className="widget">
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                                        <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Patient Name</th>
                                        <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>MRN</th>
                                        <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>DOB</th>
                                        <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Phone</th>
                                        <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Primary Care</th>
                                        <th style={{ padding: '1rem' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>search_off</span>
                                                    <span>No patients found matching "{searchQuery}"</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPatients.map(patient => (
                                            <tr key={patient.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
                                                            {patient.first_name[0]}{patient.last_name[0]}
                                                        </div>
                                                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                                                            {patient.last_name}, {patient.first_name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{patient.id}</td>
                                                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{formatDate(patient.dob)}</td>
                                                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{patient.phone}</td>
                                                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{patient.pcp}</td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    <Link href={`/patients/${patient.id}`} style={{ 
                                                        display: 'inline-block',
                                                        padding: '0.4rem 0.8rem', 
                                                        backgroundColor: 'var(--primary-light)', 
                                                        color: 'var(--primary-dark)', 
                                                        borderRadius: 'var(--radius-full)',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                        textDecoration: 'none'
                                                    }}>
                                                        View Chart
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
