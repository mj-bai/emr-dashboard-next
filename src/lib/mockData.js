export let patients = [
    {
        id: "MRN-847291",
        firstName: "Eleanor",
        lastName: "Pena",
        dob: "1965-04-12",
        age: 59,
        gender: "Female",
        bloodType: "A+",
        phone: "(555) 123-4567",
        vitals: {
            bp: { value: "118/76", unit: "mmHg", status: "normal" },
            hr: { value: "72", unit: "bpm", status: "normal" },
            temp: { value: "98.6", unit: "°F", status: "normal" },
            weight: { value: "154", unit: "lbs", status: "normal" },
            spo2: { value: "99", unit: "%", status: "normal" }
        },
        insurance: { provider: "BlueCross BlueShield", id: "Memb-849302A", group: "GRP-4993" },
        pcp: "Dr. Brian Bai",
        allergies: [
            { name: "Penicillin", reaction: "Hives", severity: "high" },
            { name: "Peanuts", reaction: "Anaphylaxis", severity: "critical" },
            { name: "Latex", reaction: "Mild Rash", severity: "low" }
        ],
        medications: [
            { name: "Lisinopril", dose: "10mg", frequency: "Daily", purpose: "Hypertension", active: true },
            { name: "Metformin", dose: "500mg", frequency: "Twice daily", purpose: "Type 2 Diabetes", active: true },
            { name: "Atorvastatin", dose: "20mg", frequency: "Nightly", purpose: "Hyperlipidemia", active: true },
            { name: "Amoxicillin", dose: "250mg", frequency: "Every 8 hours", purpose: "Infection", active: false }
        ],
        familyHistory: [
            { relation: "Father", condition: "Type 2 Diabetes", ageOfOnset: 55 },
            { relation: "Mother", condition: "Breast Cancer", ageOfOnset: 62 },
            { relation: "Brother", condition: "Hypertension", ageOfOnset: 48 }
        ],
        encounters: [
            { date: "2026-03-15", provider: "Dr. Brian Bai", type: "Follow-up", chiefComplaint: "Medication refill and routine blood pressure check.", note: "Patient reports feeling well. BP well controlled on current Lisinopril dose. Refilled prescriptions for 90 days." },
            { date: "2025-11-02", provider: "Dr. Brian Bai", type: "Annual Physical", chiefComplaint: "Annual wellness exam and preventative screening.", note: "Routine physical. Labs ordered. Discussed weight management." },
            { date: "2025-06-18", provider: "Dr. Michael Chen", type: "Urgent Care", chiefComplaint: "Facial pain, congestion, and low-grade fever for 4 days.", note: "Presented with minor sinus infection. Prescribed Amoxicillin." },
            { date: "2025-04-10", provider: "Dr. Brian Bai", type: "Follow-up", chiefComplaint: "Discussion of recent A1C lab results and diet modifications.", note: "Patient's A1C has slightly elevated. Counseled extensively on carbohydrate counting and portion control." },
            { date: "2025-01-22", provider: "Dr. Elena Rodriguez", type: "Specialist Visit", chiefComplaint: "Evaluation for occasional episodes of racing heart at rest.", note: "Cardiology follow-up. EKG was normal. Suspect palpitations are benign stress-related PVCs. Advised Holter monitor if symptoms worsen." },
            { date: "2024-09-05", provider: "Dr. Brian Bai", type: "Follow-up", chiefComplaint: "3-month diabetes follow-up and chronic joint pain.", note: "Patient's joint pain is well managed with occasional Tylenol. Refilled Metformin and reviewed foot care best practices." },
            { date: "2024-06-12", provider: "Dr. Brian Bai", type: "Follow-up", chiefComplaint: "Hypertension medication adjustment review.", note: "Patient previously reported dizziness on higher dose. BP is stable at 122/80 on the reduced Lisinopril dose. Will continue current regimen." },
            { date: "2023-11-15", provider: "Dr. Brian Bai", type: "Annual Physical", chiefComplaint: "Yearly physical exam and required immunization updates.", note: "Normal physical exam. Administered seasonal flu vaccine. Recommended scheduling routine colonoscopy soon." }
        ],
        messages: [
            { date: "2026-03-19", sender: "Dr. Brian Bai", subject: "Lab Results", preview: "Hi Eleanor, your recent lipid panel looks much better...", read: false },
            { date: "2026-03-16", sender: "System", subject: "Appointment Reminder", preview: "Reminder: You have an upcoming appointment...", read: true },
            { date: "2026-02-10", sender: "Pharmacy Team", subject: "Prescription Ready", preview: "Your Lisinopril refill is ready for pickup at...", read: true }
        ],
        healthConcerns: [
            { concern: "Weight Management", status: "Active", dateIdentified: "2024-11-02" },
            { concern: "Occasional Insomnia", status: "Active", dateIdentified: "2025-08-14" }
        ],
        diagnoses: {
            chronic: [
                { condition: "Essential Hypertension", icd10: "I10", onset: "2018-05-12" },
                { condition: "Type 2 Diabetes Mellitus", icd10: "E11.9", onset: "2021-02-28" }
            ],
            acute: [
                { condition: "Acute Sinusitis", icd10: "J01.90", onset: "2025-06-18", resolved: "2025-07-01" }
            ]
        },
        screenings: [
            { type: "Mammogram", date: "2025-10-15", result: "Normal", nextDue: "2026-10-15" },
            { type: "Colonoscopy", date: "2021-04-20", result: "Normal", nextDue: "2031-04-20" },
            { type: "Bone Density", date: "2025-11-02", result: "Osteopenia", nextDue: "2027-11-02" }
        ],
        appointments: [
            { date: "2026-05-15T10:00:00", provider: "Dr. Brian Bai", type: "Follow-up", status: "Scheduled" },
            { date: "2026-04-20T14:30:00", provider: "Lab Diagnostics", type: "Blood Work", status: "Scheduled" }
        ]
    }
];

export const mockPatient = patients[0];

export function addPatient(patient) {
    // Generate a random MRN
    patient.id = `MRN-${Math.floor(Math.random() * 900000) + 100000}`;
    patient.age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
    
    // Add empty defaults for the dashboard arrays
    patient.vitals = {
        bp: { value: "--/--", unit: "mmHg", status: "normal" },
        hr: { value: "--", unit: "bpm", status: "normal" },
        temp: { value: "--", unit: "°F", status: "normal" },
        weight: { value: "--", unit: "lbs", status: "normal" },
        spo2: { value: "--", unit: "%", status: "normal" }
    };
    patient.allergies = [];
    patient.medications = [];
    patient.familyHistory = [];
    patient.encounters = [];
    patient.messages = [];
    patient.healthConcerns = [];
    patient.diagnoses = { chronic: [], acute: [] };
    patient.screenings = [];
    patient.appointments = [];

    patients.push(patient);
    return patient;
}
