export let patients = [
    {
        id: "MRN-847291",
        firstName: "Alice",
        lastName: "Smith",
        dob: "1975-08-22",
        age: 50,
        gender: "Female",
        bloodType: "A+",
        phone: "(555) 111-2222",
        vitals: {
            bp: { value: "118/76", unit: "mmHg", status: "normal" },
            hr: { value: "72", unit: "bpm", status: "normal" },
            temp: { value: "98.6", unit: "°F", status: "normal" },
            weight: { value: "154", unit: "lbs", status: "normal" },
            spo2: { value: "99", unit: "%", status: "normal" }
        },
        insurance: { provider: "Aetna", id: "A123", group: "G1" },
        pcp: "Dr. Sarah Chen",
        allergies: [
            { name: "Penicillin", reaction: "Hives", severity: "high" },
            { name: "Peanuts", reaction: "Anaphylaxis", severity: "critical" }
        ],
        medications: [
            { name: "Lisinopril", dose: "10mg", frequency: "Daily", purpose: "Hypertension", active: true },
            { name: "Atorvastatin", dose: "20mg", frequency: "Nightly", purpose: "Hyperlipidemia", active: true }
        ],
        familyHistory: [
            { relation: "Father", condition: "Type 2 Diabetes", ageOfOnset: 55 }
        ],
        encounters: [],
        messages: [],
        healthConcerns: [
            { concern: "Weight Management", status: "Active", dateIdentified: "2024-11-02" }
        ],
        diagnoses: {
            chronic: [
                { condition: "Essential Hypertension", icd10: "I10", onset: "2018-05-12" }
            ],
            acute: []
        },
        screenings: [
            { type: "Mammogram", date: "2025-10-15", result: "Normal", nextDue: "2026-10-15" }
        ],
        appointments: []
    },
    {
        id: "MRN-509981",
        firstName: "Jane",
        lastName: "Doe",
        dob: "1982-11-10",
        age: 43,
        gender: "Female",
        bloodType: "O+",
        phone: "(555) 333-4444",
        vitals: {
            bp: { value: "110/70", unit: "mmHg", status: "normal" },
            hr: { value: "68", unit: "bpm", status: "normal" },
            temp: { value: "98.2", unit: "°F", status: "normal" },
            weight: { value: "140", unit: "lbs", status: "normal" },
            spo2: { value: "100", unit: "%", status: "normal" }
        },
        insurance: { provider: "Cigna", id: "C456", group: "G2" },
        pcp: "Dr. Sarah Chen",
        allergies: [
            { name: "Latex", reaction: "Rash", severity: "moderate" }
        ],
        medications: [
            { name: "Levothyroxine", dose: "50mcg", frequency: "Daily", purpose: "Hypothyroidism", active: true }
        ],
        familyHistory: [
            { relation: "Mother", condition: "Hypothyroidism", ageOfOnset: 40 }
        ],
        encounters: [],
        messages: [],
        healthConcerns: [
            { concern: "Occasional Insomnia", status: "Active", dateIdentified: "2025-08-14" }
        ],
        diagnoses: {
            chronic: [
                { condition: "Hypothyroidism", icd10: "E03.9", onset: "2020-03-10" }
            ],
            acute: []
        },
        screenings: [
            { type: "Pap Smear", date: "2024-05-10", result: "Normal", nextDue: "2027-05-10" }
        ],
        appointments: []
    },
    {
        id: "MRN-966051",
        firstName: "John",
        lastName: "Roe",
        dob: "1990-01-05",
        age: 36,
        gender: "Male",
        bloodType: "B-",
        phone: "(555) 555-6666",
        vitals: {
            bp: { value: "125/82", unit: "mmHg", status: "normal" },
            hr: { value: "75", unit: "bpm", status: "normal" },
            temp: { value: "98.5", unit: "°F", status: "normal" },
            weight: { value: "185", unit: "lbs", status: "normal" },
            spo2: { value: "98", unit: "%", status: "normal" }
        },
        insurance: { provider: "UnitedHealthcare", id: "U789", group: "G3" },
        pcp: "Dr. Sarah Chen",
        allergies: [],
        medications: [
            { name: "Albuterol Inhaler", dose: "90mcg", frequency: "As needed", purpose: "Asthma", active: true }
        ],
        familyHistory: [
            { relation: "Brother", condition: "Asthma", ageOfOnset: 12 }
        ],
        encounters: [],
        messages: [],
        healthConcerns: [
            { concern: "Seasonal Allergies", status: "Active", dateIdentified: "2015-04-01" }
        ],
        diagnoses: {
            chronic: [
                { condition: "Mild Persistent Asthma", icd10: "J45.30", onset: "2010-09-01" }
            ],
            acute: []
        },
        screenings: [
            { type: "Annual Blood Work", date: "2025-01-15", result: "Normal", nextDue: "2026-01-15" }
        ],
        appointments: []
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
