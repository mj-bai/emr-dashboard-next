'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export default function PatientDashboard({ patient }) {
    const [activeTab, setActiveTab] = useState('summary');
    const [timelineFilter, setTimelineFilter] = useState('encounters');

    if (!patient) {
        return (
            <div className="dashboard-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem'}}>
                <h1>Patient Not Found</h1>
                <Link href="/" style={{color: 'var(--primary-color)'}}>Return to Directory</Link>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-wrapper">
                {/* Patient Demographics Header */}
                <header className="patient-header">
                    <div className="patient-profile">
                        <div className="avatar">
                            {patient.first_name[0]}{patient.last_name[0]}
                        </div>
                        <div className="patient-info">
                            <h1 className="patient-name">{patient.last_name}, {patient.first_name}</h1>
                            <div className="patient-meta">
                                <span className="meta-item"><span className="material-symbols-outlined">badge</span> {patient.id}</span>
                                <span className="meta-item"><span className="material-symbols-outlined">cake</span> {formatDate(patient.dob)}</span>
                                <span className="meta-item"><span className="material-symbols-outlined">wc</span> {patient.gender}</span>
                            </div>
                        </div>
                    </div>
                    {/* Extended Demographics & Insurance */}
                    <div className="header-extended-info">
                        <div className="info-group">
                            <span className="info-label">Insurance</span>
                            <span className="info-value">{patient.insurance_provider || 'Self Pay'}</span>
                            <span className="item-sub">ID: {patient.policy_number || 'N/A'}</span>
                        </div>
                        <div className="info-group">
                            <span className="info-label">PCP</span>
                            <span className="info-value">{patient.pcp || 'Unassigned'}</span>
                        </div>
                        <div className="info-group">
                            <span className="info-label">Phone</span>
                            <span className="info-value">{patient.phone}</span>
                        </div>
                    </div>
                </header>

                {/* Main Content Tabs */}
                <nav className="content-tabs">
                    <button className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary</button>
                    <button className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>Timeline</button>
                    <button className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>Documents</button>
                    <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
                    <button className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`} onClick={() => setActiveTab('payment')}>Payment Collection</button>
                    <button className={`tab-btn ${activeTab === 'ledger' ? 'active' : ''}`} onClick={() => setActiveTab('ledger')}>Patient Ledger</button>
                    <button className="tab-btn" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>tune</span> Display settings
                    </button>
                </nav>

                {/* Main Content Area */}
                <main className="dashboard-area">
                    {/* Summary Tab */}
                    {activeTab === 'summary' && (
                        <div className="tab-content active">
                            <div className="dashboard-grid">
                                
                                <section className="widget encounters-widget">
                                    <div className="widget-header">
                                        <h2><span className="material-symbols-outlined">event_note</span> Encounters</h2>
                                        <button className="view-all btn-icon" style={{width: 'auto'}} onClick={() => { setActiveTab('timeline'); setTimelineFilter('encounters'); }}>See All Encounters</button>
                                    </div>
                                    <div className="widget-content card-list">
                                        {patient.encounters?.slice(0, 6).map((encounter, i) => (
                                            <div key={i} className="card">
                                                <div className="card-header">
                                                    <div>
                                                        <div className="card-title">{encounter.type}</div>
                                                        <div className="item-sub">{encounter.provider}</div>
                                                    </div>
                                                    <div className="card-date">{formatDate(encounter.date)}</div>
                                                </div>
                                                <div className="card-body"><strong>Chief Complaint:</strong> {encounter.notes}</div>
                                            </div>
                                        )) || <div className="item-sub">No encounters on record.</div>}
                                    </div>
                                </section>

                                <section className="widget allergies-widget">
                                    <div className="widget-header">
                                        <h2><span className="material-symbols-outlined">warning</span> Allergies</h2>
                                        <button className="btn-icon"><span className="material-symbols-outlined">add</span></button>
                                    </div>
                                    <div className="widget-content tag-list">
                                        {patient.allergies?.map((allergy, i) => {
                                            let icon = 'warning';
                                            if (allergy.severity === 'critical') icon = 'dangerous';
                                            else if (allergy.severity === 'low') icon = 'info';
                                            return (
                                                <span key={i} className={`tag ${allergy.severity}`}>
                                                    <span className="material-symbols-outlined" style={{fontSize: '1rem'}}>{icon}</span> {allergy.name} ({allergy.reaction})
                                                </span>
                                            );
                                        }) || <div className="item-sub">NKDA</div>}
                                    </div>
                                </section>

                                <section className="widget medications-widget">
                                    <div className="widget-header">
                                        <h2><span className="material-symbols-outlined">medication</span> Active Meds</h2>
                                        <button className="btn-icon"><span className="material-symbols-outlined">add</span></button>
                                    </div>
                                    <div className="widget-content data-list">
                                        {patient.medications?.map((med, i) => (
                                            <div key={i} className="list-item">
                                                <div className="item-main">
                                                    <span className="item-title">{med.name} {med.dose}</span>
                                                    <span className="item-sub">{med.frequency} • {med.purpose}</span>
                                                </div>
                                                <span className={`status-badge ${med.active ? 'active' : 'inactive'}`}>{med.active ? 'Active' : 'Past'}</span>
                                            </div>
                                        )) || <div className="item-sub">No active medications.</div>}
                                    </div>
                                </section>

                                <section className="widget family-history-widget">
                                    <div className="widget-header">
                                        <h2><span className="material-symbols-outlined">family_history</span> History</h2>
                                    </div>
                                    <div className="widget-content data-list">
                                        {patient.familyHistory?.map((history, i) => (
                                            <div key={i} className="list-item">
                                                <div className="item-main">
                                                    <span className="item-title">{history.condition}</span>
                                                    <span className="item-sub">{history.relation} (Onset: {history.ageOfOnset}yo)</span>
                                                </div>
                                            </div>
                                        )) || <div className="item-sub">No significant family history.</div>}
                                    </div>
                                </section>

                                <section className="widget messages-widget">
                                    <div className="widget-header">
                                        <h2><span className="material-symbols-outlined">chat</span> Messages</h2>
                                    </div>
                                    <div className="widget-content card-list">
                                        {patient.messages?.map((msg, i) => (
                                            <div key={i} className={`card ${!msg.read ? 'unread' : ''}`}>
                                                <div className="card-header">
                                                    <div>
                                                        <div className="card-title">{msg.subject}</div>
                                                        <div className="item-sub">From: {msg.sender}</div>
                                                    </div>
                                                    <div className="card-date">{formatDate(msg.date)}</div>
                                                </div>
                                                <div className="card-body">{msg.preview}</div>
                                            </div>
                                        )) || <div className="item-sub">No messages.</div>}
                                    </div>
                                </section>

                                <section className="widget health-concerns-widget">
                                    <div className="widget-header">
                                        <h2><span className="material-symbols-outlined">favorite</span> Health Concerns</h2>
                                    </div>
                                    <div className="widget-content data-list">
                                        {patient.healthConcerns?.map((concern, i) => (
                                            <div key={i} className="list-item">
                                                <div className="item-main">
                                                    <span className="item-title">{concern.concern}</span>
                                                    <span className="item-sub">Identified: {formatDate(concern.dateIdentified)}</span>
                                                </div>
                                                <span className="status-badge active">{concern.status}</span>
                                            </div>
                                        )) || <div className="item-sub">No active concerns.</div>}
                                    </div>
                                </section>

                                <section className="widget diagnoses-widget">
                                    <div className="widget-header">
                                        <h2><span className="material-symbols-outlined">medical_information</span> Diagnoses</h2>
                                    </div>
                                    <div className="widget-content data-list">
                                        {patient.diagnoses?.chronic?.map((diag, i) => (
                                            <div key={`chronic-${i}`} className="list-item">
                                                <div className="item-main">
                                                    <span className="item-title">{diag.condition} <span className="tag" style={{background:'#e0f2fe', color:'#0369a1', border:'1px solid #7dd3fc', fontSize:'0.6rem', padding:'0.1rem 0.3rem'}}>Chronic</span></span>
                                                    <span className="item-sub">ICD-10: {diag.icd10} • Onset: {formatDate(diag.onset)}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {patient.diagnoses?.acute?.map((diag, i) => (
                                            <div key={`acute-${i}`} className="list-item">
                                                <div className="item-main">
                                                    <span className="item-title">{diag.condition} <span className="tag" style={{background:'#ffedd5', color:'#c2410c', border:'1px solid #fdba74', fontSize:'0.6rem', padding:'0.1rem 0.3rem'}}>Acute</span></span>
                                                    <span className="item-sub">ICD-10: {diag.icd10} • Onset: {formatDate(diag.onset)} {diag.resolved ? `• Resolved: ${formatDate(diag.resolved)}` : ''}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!patient.diagnoses?.chronic?.length && !patient.diagnoses?.acute?.length) && <div className="item-sub">No diagnoses on record.</div>}
                                    </div>
                                </section>

                                <section className="widget screenings-widget">
                                    <div className="widget-header">
                                        <h2><span className="material-symbols-outlined">assignment_ind</span> Screenings</h2>
                                    </div>
                                    <div className="widget-content data-list">
                                        {patient.screenings?.map((screening, i) => {
                                            const nextDueObj = new Date(screening.nextDue);
                                            const soon = nextDueObj < new Date(new Date().setMonth(new Date().getMonth() + 1));
                                            const badgeColor = soon ? {backgroundColor: '#fee2e2', color: '#ef4444'} : {backgroundColor: '#e0f2fe', color: '#3b82f6'};
                                            return (
                                                <div key={i} className="list-item">
                                                    <div className="item-main">
                                                        <span className="item-title">{screening.type}</span>
                                                        <span className="item-sub">Last: {formatDate(screening.date)} • Result: {screening.result}</span>
                                                    </div>
                                                    <span className="status-badge" style={badgeColor}>Due: {formatDate(screening.nextDue)}</span>
                                                </div>
                                            );
                                        }) || <div className="item-sub">No screenings scheduled.</div>}
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                    {/* Timeline Tab */}
                    {activeTab === 'timeline' && (
                        <div className="tab-content active">
                            <div className="timeline-header" style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '0.75rem'}}>
                                <select 
                                    className="form-select" 
                                    value={timelineFilter} 
                                    onChange={(e) => setTimelineFilter(e.target.value)}
                                    style={{padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-widget)', fontFamily: 'var(--font-family)', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer', outline: 'none'}}
                                >
                                    <option value="encounters">Encounters</option>
                                    <option value="appointments">Appointments</option>
                                </select>
                            </div>
                            <div className="timeline-feed">
                                {timelineFilter === 'encounters' && patient.encounters?.map((event, i) => (
                                    <div key={i} className="timeline-event">
                                        <span className="material-symbols-outlined timeline-icon">event_note</span>
                                        <div className="timeline-card">
                                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem'}}>
                                                <div className="timeline-title" style={{margin: 0}}>{event.type} <span className="timeline-sub">with {event.provider}</span></div>
                                                <span className="timeline-date" style={{margin: 0, fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 700}}>{formatDate(event.date)}</span>
                                            </div>
                                            <div className="timeline-notes">
                                                <strong>Notes:</strong><br/>
                                                {event.notes}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {timelineFilter === 'appointments' && patient.appointments?.map((event, i) => (
                                    <div key={i} className="timeline-event">
                                        <span className="material-symbols-outlined timeline-icon">event</span>
                                        <div className="timeline-card">
                                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem'}}>
                                                <div className="timeline-title" style={{margin: 0}}>{event.type} <span className="timeline-sub">with {event.provider}</span></div>
                                                <span className="timeline-date" style={{margin: 0, fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 700}}>{formatDate(event.date)}</span>
                                            </div>
                                            <div className="timeline-notes">
                                                Status: {event.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!patient[timelineFilter] || patient[timelineFilter].length === 0) && (
                                    <div className="empty-state"><span className="material-symbols-outlined">info</span><p>No data available for {timelineFilter} yet.</p></div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Stub Tabs */}
                    {activeTab === 'documents' && (
                        <div className="tab-content active">
                            <div className="empty-state">
                                <span className="material-symbols-outlined">folder_open</span>
                                <h3>Documents</h3>
                                <p>No documents uploaded yet.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="tab-content active">
                            <div className="empty-state">
                                <span className="material-symbols-outlined">person</span>
                                <h3>Profile</h3>
                                <p>Patient profile settings and configurations.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payment' && (
                        <div className="tab-content active">
                            <div className="empty-state">
                                <span className="material-symbols-outlined">payments</span>
                                <h3>Payment Collection</h3>
                                <p>No pending payments.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ledger' && (
                        <div className="tab-content active">
                            <div className="empty-state">
                                <span className="material-symbols-outlined">receipt_long</span>
                                <h3>Patient Ledger</h3>
                                <p>Account balanced.</p>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
