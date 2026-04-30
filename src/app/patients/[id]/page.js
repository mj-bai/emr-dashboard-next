import { sql } from '@vercel/postgres';
import PatientDashboard from '@/components/PatientDashboard';
import { patients as mockPatients } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export default async function PatientPage({ params }) {
    const { id } = await params;
    
    const { rows: patientRows } = await sql`
        SELECT * FROM patients WHERE id = ${id}
    `;

    if (patientRows.length === 0) {
        return <PatientDashboard patient={null} />;
    }

    const patient = patientRows[0];

    const { rows: encounters } = await sql`
        SELECT * FROM encounters WHERE patient_id = ${id} ORDER BY date DESC
    `;
    
    const { rows: appointments } = await sql`
        SELECT * FROM appointments WHERE patient_id = ${id} ORDER BY date DESC
    `;
    
    const { rows: messages } = await sql`
        SELECT * FROM messages WHERE patient_id = ${id} ORDER BY date DESC
    `;

    // Merge core DB data with patient
    patient.encounters = encounters;
    patient.appointments = appointments;
    patient.messages = messages;

    // Merge mock data for unmodeled sections if it's our original mock patient
    const mockPatient = mockPatients.find(p => p.id === id);
    if (mockPatient) {
        patient.allergies = mockPatient.allergies;
        patient.medications = mockPatient.medications;
        patient.familyHistory = mockPatient.familyHistory;
        patient.healthConcerns = mockPatient.healthConcerns;
        patient.diagnoses = mockPatient.diagnoses;
        patient.screenings = mockPatient.screenings;
    }

    return <PatientDashboard patient={patient} />;
}
