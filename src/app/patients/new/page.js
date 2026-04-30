'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPatient } from '@/app/actions';
import Sidebar from '@/components/Sidebar';

export default function NewPatientPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'Female',
        bloodType: 'A+',
        phone: '',
        insuranceProvider: '',
        insuranceId: '',
        insuranceGroup: '',
        pcp: 'Dr. Brian Bai'
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const newPatient = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dob: formData.dob,
            gender: formData.gender,
            bloodType: formData.bloodType,
            phone: formData.phone,
            insurance: {
                provider: formData.insuranceProvider,
                id: formData.insuranceId,
                group: formData.insuranceGroup
            },
            pcp: formData.pcp
        };

        const result = await createPatient(newPatient);
        
        if (result.success) {
            router.push(`/patients/${result.patientId}`);
        } else {
            console.error(result.error);
            setIsSubmitting(false);
            alert("Failed to register patient. Please try again.");
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-wrapper">
                <header className="patient-header">
                    <div className="patient-profile">
                        <div className="patient-info">
                            <h1 className="patient-name">Register New Patient</h1>
                        </div>
                    </div>
                </header>

                <main className="dashboard-area" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <div className="widget" style={{ padding: '2rem' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            
                            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--primary-dark)' }}>Basic Demographics</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>First Name</label>
                                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Last Name</label>
                                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Date of Birth</label>
                                    <input type="date" name="dob" required value={formData.dob} onChange={handleChange} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Phone Number</label>
                                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                        <option>Female</option>
                                        <option>Male</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Blood Type</label>
                                    <select name="bloodType" value={formData.bloodType} onChange={handleChange} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                        <option>A+</option>
                                        <option>A-</option>
                                        <option>B+</option>
                                        <option>B-</option>
                                        <option>AB+</option>
                                        <option>AB-</option>
                                        <option>O+</option>
                                        <option>O-</option>
                                    </select>
                                </div>
                            </div>

                            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--primary-dark)', marginTop: '1rem' }}>Insurance Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Provider Name</label>
                                    <input type="text" name="insuranceProvider" required value={formData.insuranceProvider} onChange={handleChange} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Member ID</label>
                                    <input type="text" name="insuranceId" required value={formData.insuranceId} onChange={handleChange} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Group Number</label>
                                    <input type="text" name="insuranceGroup" required value={formData.insuranceGroup} onChange={handleChange} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                                <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 2rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                                    {isSubmitting ? 'Registering...' : 'Register Patient'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
