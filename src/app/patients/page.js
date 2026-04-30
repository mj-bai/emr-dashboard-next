import { sql } from '@vercel/postgres';
import PatientList from '@/components/PatientList';

export const dynamic = 'force-dynamic';

export default async function PatientDirectoryPage() {
    const { rows: patients } = await sql`
        SELECT * FROM patients
        ORDER BY last_name ASC
    `;

    return <PatientList initialPatients={patients} />;
}
