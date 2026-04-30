'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export async function createPatient(patientData) {
    try {
        // Generate a random MRN
        const id = 'MRN-' + Math.floor(100000 + Math.random() * 900000);
        
        await sql`
            INSERT INTO patients (
                id, first_name, last_name, dob, gender, phone, email, 
                insurance_provider, policy_number, group_number, pcp
            )
            VALUES (
                ${id}, ${patientData.firstName}, ${patientData.lastName}, 
                ${patientData.dob}, ${patientData.gender}, ${patientData.phone}, 
                ${patientData.email || null}, ${patientData.insurance.provider}, 
                ${patientData.insurance.id}, ${patientData.insurance.group}, 
                ${patientData.pcp}
            )
        `;

        // Revalidate the patients directory path to show the new patient
        revalidatePath('/patients');
        revalidatePath('/');
        
        return { success: true, patientId: id };
    } catch (error) {
        console.error('Failed to create patient in database:', error);
        return { success: false, error: 'Failed to create patient.' };
    }
}
