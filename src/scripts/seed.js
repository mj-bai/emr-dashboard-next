const { sql } = require('@vercel/postgres');
const { patients } = require('../lib/mockData.js');

async function seedPatients() {
    try {
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        
        await sql`
            CREATE TABLE IF NOT EXISTS patients (
                id VARCHAR(255) PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                dob DATE NOT NULL,
                gender VARCHAR(50) NOT NULL,
                phone VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                address TEXT,
                insurance_provider VARCHAR(255),
                policy_number VARCHAR(255),
                group_number VARCHAR(255),
                pcp VARCHAR(255)
            );
        `;

        console.log(`Created "patients" table`);

        const insertedPatients = await Promise.all(
            patients.map(async (patient) => {
                return sql`
                    INSERT INTO patients (
                        id, first_name, last_name, dob, gender, phone, email, address, insurance_provider, policy_number, group_number, pcp
                    )
                    VALUES (
                        ${patient.id}, ${patient.firstName}, ${patient.lastName}, ${patient.dob}, ${patient.gender}, ${patient.phone}, ${patient.email}, ${patient.address}, ${patient.insurance.provider}, ${patient.insurance.policyNumber}, ${patient.insurance.groupNumber}, ${patient.pcp}
                    )
                    ON CONFLICT (id) DO NOTHING;
                `;
            })
        );

        console.log(`Seeded ${insertedPatients.length} patients`);
    } catch (error) {
        console.error('Error seeding patients:', error);
        throw error;
    }
}

async function seedAppointments() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                patient_id VARCHAR(255) REFERENCES patients(id),
                date TIMESTAMP NOT NULL,
                provider VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                status VARCHAR(50) NOT NULL
            );
        `;

        console.log(`Created "appointments" table`);

        const allAppointments = patients.flatMap(p => 
            p.appointments.map(a => ({ ...a, patient_id: p.id }))
        );

        const insertedAppointments = await Promise.all(
            allAppointments.map(async (apt) => {
                return sql`
                    INSERT INTO appointments (patient_id, date, provider, type, status)
                    VALUES (${apt.patient_id}, ${apt.date}, ${apt.provider}, ${apt.type}, ${apt.status})
                    ON CONFLICT DO NOTHING;
                `;
            })
        );

        console.log(`Seeded ${insertedAppointments.length} appointments`);
    } catch (error) {
        console.error('Error seeding appointments:', error);
        throw error;
    }
}

async function seedEncounters() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS encounters (
                id SERIAL PRIMARY KEY,
                patient_id VARCHAR(255) REFERENCES patients(id),
                date DATE NOT NULL,
                provider VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                notes TEXT
            );
        `;

        console.log(`Created "encounters" table`);

        const allEncounters = patients.flatMap(p => 
            p.encounters.map(e => ({ ...e, patient_id: p.id }))
        );

        const insertedEncounters = await Promise.all(
            allEncounters.map(async (enc) => {
                return sql`
                    INSERT INTO encounters (patient_id, date, provider, type, notes)
                    VALUES (${enc.patient_id}, ${enc.date}, ${enc.provider}, ${enc.type}, ${enc.notes})
                    ON CONFLICT DO NOTHING;
                `;
            })
        );

        console.log(`Seeded ${insertedEncounters.length} encounters`);
    } catch (error) {
        console.error('Error seeding encounters:', error);
        throw error;
    }
}

async function seedMessages() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                patient_id VARCHAR(255) REFERENCES patients(id),
                sender VARCHAR(255) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                preview TEXT,
                date DATE NOT NULL,
                read BOOLEAN DEFAULT false
            );
        `;

        console.log(`Created "messages" table`);

        const allMessages = patients.flatMap(p => 
            p.messages.map(m => ({ ...m, patient_id: p.id }))
        );

        const insertedMessages = await Promise.all(
            allMessages.map(async (msg) => {
                return sql`
                    INSERT INTO messages (patient_id, sender, subject, preview, date, read)
                    VALUES (${msg.patient_id}, ${msg.sender}, ${msg.subject}, ${msg.preview}, ${msg.date}, ${msg.read})
                    ON CONFLICT DO NOTHING;
                `;
            })
        );

        console.log(`Seeded ${insertedMessages.length} messages`);
    } catch (error) {
        console.error('Error seeding messages:', error);
        throw error;
    }
}

async function main() {
    console.log('Starting seed process...');
    
    await seedPatients();
    await seedAppointments();
    await seedEncounters();
    await seedMessages();
    
    console.log('Seed process finished successfully!');
}

main().catch((err) => {
    console.error('An error occurred while attempting to seed the database:', err);
});
