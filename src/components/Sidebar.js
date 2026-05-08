'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path) => {
        if (path === '/' && pathname !== '/') return false;
        return pathname.startsWith(path) && (path !== '/patients' || pathname === '/patients');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="material-symbols-outlined brand-icon">health_and_safety</span>
                <span className="brand-text">BB Clinic</span>
            </div>
            <nav className="sidebar-nav">
                <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
                    <span className="material-symbols-outlined">analytics</span>
                    Global Dashboard
                </Link>
                <Link href="/patients" className={`nav-item ${pathname === '/patients' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
                    <span className="material-symbols-outlined">group</span>
                    Patient Directory
                </Link>
                <Link href="/appointments" className={`nav-item ${pathname === '/appointments' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
                    <span className="material-symbols-outlined">calendar_month</span>
                    Appointments
                </Link>
                <Link href="/inbox" className={`nav-item ${pathname === '/inbox' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
                    <span className="material-symbols-outlined">inbox</span>
                    Inbox
                </Link>
                <Link href="/patients/new" className={`nav-item ${pathname === '/patients/new' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
                    <span className="material-symbols-outlined">person_add</span>
                    New Patient
                </Link>
                {pathname.startsWith('/patients/') && pathname !== '/patients/new' && pathname !== '/patients' && (
                    <button className="nav-item active" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <span className="material-symbols-outlined">dashboard</span>
                        Patient Chart
                    </button>
                )}
            </nav>
            <div className="sidebar-footer">
                <button className="nav-item logout" onClick={() => signOut()}>
                    <span className="material-symbols-outlined">logout</span>
                    Logout
                </button>
            </div>
        </aside>
    );
}
