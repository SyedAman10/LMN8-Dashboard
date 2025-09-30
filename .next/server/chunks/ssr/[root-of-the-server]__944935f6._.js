module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/database/indexeddb.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IndexedDBService",
    ()=>IndexedDBService,
    "db",
    ()=>db,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dexie$2f$import$2d$wrapper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dexie/import-wrapper.mjs [app-ssr] (ecmascript)");
;
const db = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dexie$2f$import$2d$wrapper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]('LuminateClinicianDB');
// Define database schema with versioning
db.version(1).stores({
    users: '++id, email, firstName, lastName, role, licenseNumber, passwordHash, createdAt, updatedAt, isOnline',
    patients: '++id, name, email, phone, dateOfBirth, diagnosis, medicalHistory, emergencyContact, emergencyPhone, therapist, totalSessions, notes, status, lastSession, nextSession, progress, sessionsCompleted, createdAt, updatedAt, isOnline',
    sessions: '++id, patientId, therapistId, date, duration, type, notes, status, createdAt, updatedAt, isOnline',
    treatmentPlans: '++id, patientId, therapistId, title, description, sessions, status, createdAt, updatedAt, isOnline',
    syncQueue: '++id, table, recordId, action, data, timestamp, retryCount'
});
// Add version 2 with proper error handling
db.version(2).stores({
    users: '++id, email, firstName, lastName, role, licenseNumber, passwordHash, createdAt, updatedAt, isOnline',
    patients: '++id, name, email, phone, dateOfBirth, diagnosis, medicalHistory, emergencyContact, emergencyPhone, therapist, totalSessions, notes, status, lastSession, nextSession, progress, sessionsCompleted, createdAt, updatedAt, isOnline',
    sessions: '++id, patientId, therapistId, date, duration, type, notes, status, createdAt, updatedAt, isOnline',
    treatmentPlans: '++id, patientId, therapistId, title, description, sessions, status, createdAt, updatedAt, isOnline',
    syncQueue: '++id, table, recordId, action, data, timestamp, retryCount'
}).upgrade(async (tx)=>{
    // Clear existing data to prevent constraint errors
    await tx.users.clear();
    await tx.patients.clear();
    await tx.sessions.clear();
    await tx.treatmentPlans.clear();
    await tx.syncQueue.clear();
});
class IndexedDBService {
    // User operations
    static async createUser(userData) {
        try {
            // Check if user already exists by email
            const existingUser = await db.users.where('email').equals(userData.email).first();
            if (existingUser) {
                // Update existing user
                await db.users.update(existingUser.id, {
                    ...userData,
                    updatedAt: new Date().toISOString()
                });
                return {
                    id: existingUser.id,
                    ...userData
                };
            } else {
                // Create new user
                const id = await db.users.add({
                    ...userData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isOnline: false
                });
                return {
                    id,
                    ...userData
                };
            }
        } catch (error) {
            console.error('Error creating user in IndexedDB:', error);
            throw error;
        }
    }
    static async getUserByEmail(email) {
        try {
            return await db.users.where('email').equals(email).first();
        } catch (error) {
            console.error('Error getting user by email from IndexedDB:', error);
            throw error;
        }
    }
    static async getUserById(id) {
        try {
            return await db.users.get(id);
        } catch (error) {
            console.error('Error getting user by ID from IndexedDB:', error);
            throw error;
        }
    }
    static async updateUser(id, userData) {
        try {
            await db.users.update(id, {
                ...userData,
                updatedAt: new Date().toISOString()
            });
            return await this.getUserById(id);
        } catch (error) {
            console.error('Error updating user in IndexedDB:', error);
            throw error;
        }
    }
    static async getUsers() {
        try {
            return await db.users.orderBy('createdAt').reverse().toArray();
        } catch (error) {
            console.error('Error getting users from IndexedDB:', error);
            throw error;
        }
    }
    static async deleteUser(id) {
        try {
            await db.users.delete(id);
            return true;
        } catch (error) {
            console.error('Error deleting user from IndexedDB:', error);
            throw error;
        }
    }
    // Patient operations
    static async createPatient(patientData) {
        try {
            // Check if patient already exists by name
            const existingPatient = await db.patients.where('name').equals(patientData.name).first();
            if (existingPatient) {
                // Update existing patient
                await db.patients.update(existingPatient.id, {
                    ...patientData,
                    updatedAt: new Date().toISOString()
                });
                return {
                    id: existingPatient.id,
                    ...patientData
                };
            } else {
                // Create new patient
                const id = await db.patients.add({
                    ...patientData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isOnline: false
                });
                return {
                    id,
                    ...patientData
                };
            }
        } catch (error) {
            console.error('Error creating patient in IndexedDB:', error);
            throw error;
        }
    }
    static async getPatients() {
        try {
            return await db.patients.orderBy('createdAt').reverse().toArray();
        } catch (error) {
            console.error('Error getting patients from IndexedDB:', error);
            throw error;
        }
    }
    static async getPatientById(id) {
        try {
            return await db.patients.get(id);
        } catch (error) {
            console.error('Error getting patient by ID from IndexedDB:', error);
            throw error;
        }
    }
    static async updatePatient(id, patientData) {
        try {
            await db.patients.update(id, {
                ...patientData,
                updatedAt: new Date().toISOString()
            });
            return await this.getPatientById(id);
        } catch (error) {
            console.error('Error updating patient in IndexedDB:', error);
            throw error;
        }
    }
    static async deletePatient(id) {
        try {
            await db.patients.delete(id);
            return true;
        } catch (error) {
            console.error('Error deleting patient from IndexedDB:', error);
            throw error;
        }
    }
    // Sync queue operations
    static async addToSyncQueue(table, recordId, action, data) {
        try {
            await db.syncQueue.add({
                table,
                recordId,
                action,
                data,
                timestamp: new Date().toISOString(),
                retryCount: 0
            });
        } catch (error) {
            console.error('Error adding to sync queue:', error);
            throw error;
        }
    }
    static async getSyncQueue() {
        try {
            return await db.syncQueue.orderBy('timestamp').toArray();
        } catch (error) {
            console.error('Error getting sync queue:', error);
            throw error;
        }
    }
    static async removeFromSyncQueue(id) {
        try {
            await db.syncQueue.delete(id);
        } catch (error) {
            console.error('Error removing from sync queue:', error);
            throw error;
        }
    }
    // Check if online
    static isOnline() {
        return navigator.onLine;
    }
    // Initialize database
    static async initialize() {
        try {
            await db.open();
            console.log('IndexedDB initialized successfully');
        } catch (error) {
            console.error('Error initializing IndexedDB:', error);
            // If it's a constraint error, try to clear and reinitialize
            if (error.name === 'ConstraintError' || error.message.includes('Key already exists')) {
                console.log('Constraint error detected, clearing database and retrying...');
                try {
                    await this.clearAll();
                    await db.open();
                    console.log('IndexedDB reinitialized successfully after clearing');
                } catch (retryError) {
                    console.error('Error reinitializing IndexedDB:', retryError);
                    throw retryError;
                }
            } else {
                throw error;
            }
        }
    }
    // Clear all data (useful for debugging)
    static async clearAll() {
        try {
            await db.users.clear();
            await db.patients.clear();
            await db.sessions.clear();
            await db.treatmentPlans.clear();
            await db.syncQueue.clear();
            console.log('IndexedDB cleared successfully');
        } catch (error) {
            console.error('Error clearing IndexedDB:', error);
            throw error;
        }
    }
    // Force delete and recreate database
    static async forceReset() {
        try {
            await db.close();
            await db.delete();
            console.log('IndexedDB deleted successfully');
            // Recreate the database
            await db.open();
            console.log('IndexedDB recreated successfully');
        } catch (error) {
            console.error('Error force resetting IndexedDB:', error);
            throw error;
        }
    }
}
const __TURBOPACK__default__export__ = IndexedDBService;
}),
"[project]/src/lib/database/neon.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NeonDBService",
    ()=>NeonDBService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-ssr] (ecmascript)");
;
// Neon DB configuration
const sql = ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["neon"])(("TURBOPACK compile-time value", "postgresql://neondb_owner:npg_fIvBAb13GOzn@ep-shiny-mud-adwijmjc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")) : "TURBOPACK unreachable";
class NeonDBService {
    // Check if Neon DB is available
    static isAvailable() {
        return sql !== null;
    }
    // Helper method to check availability and throw error if not available
    static checkAvailability() {
        if (!this.isAvailable()) {
            throw new Error('Neon database not configured. Please set NEXT_PUBLIC_NEON_DATABASE_URL in your environment variables.');
        }
    }
    // User operations
    static async createUser(userData) {
        if (!this.isAvailable()) {
            throw new Error('Neon database not configured');
        }
        try {
            const { firstName, lastName, email, passwordHash, role, licenseNumber } = userData;
            const result = await sql`
        INSERT INTO users (first_name, last_name, email, password_hash, role, license_number, created_at, updated_at)
        VALUES (${firstName}, ${lastName}, ${email}, ${passwordHash}, ${role}, ${licenseNumber || null}, NOW(), NOW())
        RETURNING id, first_name, last_name, email, role, license_number, created_at, updated_at
      `;
            return result[0];
        } catch (error) {
            console.error('Error creating user in Neon DB:', error);
            throw error;
        }
    }
    static async getUserByEmail(email) {
        if (!this.isAvailable()) {
            throw new Error('Neon database not configured');
        }
        try {
            const result = await sql`
        SELECT id, first_name, last_name, email, password_hash, role, license_number, created_at, updated_at
        FROM users 
        WHERE email = ${email}
      `;
            return result[0] || null;
        } catch (error) {
            console.error('Error getting user by email from Neon DB:', error);
            throw error;
        }
    }
    static async getUserById(id) {
        try {
            const result = await sql`
        SELECT id, first_name, last_name, email, password_hash, role, license_number, created_at, updated_at
        FROM users 
        WHERE id = ${id}
      `;
            return result[0] || null;
        } catch (error) {
            console.error('Error getting user by ID from Neon DB:', error);
            throw error;
        }
    }
    static async updateUser(id, userData) {
        try {
            const { firstName, lastName, email, role, licenseNumber } = userData;
            const result = await sql`
        UPDATE users 
        SET first_name = ${firstName}, 
            last_name = ${lastName}, 
            email = ${email}, 
            role = ${role}, 
            license_number = ${licenseNumber || null},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, first_name, last_name, email, role, license_number, created_at, updated_at
      `;
            return result[0];
        } catch (error) {
            console.error('Error updating user in Neon DB:', error);
            throw error;
        }
    }
    static async getUsers() {
        try {
            const result = await sql`
        SELECT id, first_name, last_name, email, password_hash, role, license_number, created_at, updated_at
        FROM users 
        ORDER BY created_at DESC
      `;
            return result;
        } catch (error) {
            console.error('Error getting users from Neon DB:', error);
            throw error;
        }
    }
    static async deleteUser(id) {
        try {
            await sql`DELETE FROM users WHERE id = ${id}`;
            return true;
        } catch (error) {
            console.error('Error deleting user from Neon DB:', error);
            throw error;
        }
    }
    // Patient operations
    static async createPatient(patientData) {
        try {
            const { name, email, phone, dateOfBirth, diagnosis, medicalHistory, emergencyContact, emergencyPhone, therapist, totalSessions, notes } = patientData;
            const result = await sql`
        INSERT INTO patients (
          name, email, phone, date_of_birth, diagnosis, medical_history,
          emergency_contact, emergency_phone, therapist, total_sessions, notes,
          status, last_session, next_session, progress, sessions_completed,
          created_at, updated_at
        )
        VALUES (
          ${name}, ${email}, ${phone || null}, ${dateOfBirth}, ${diagnosis}, ${medicalHistory},
          ${emergencyContact}, ${emergencyPhone}, ${therapist}, ${totalSessions}, ${notes || ''},
          'active', 'N/A', 'TBD', 0, 0,
          NOW(), NOW()
        )
        RETURNING id, name, email, phone, date_of_birth, diagnosis, medical_history,
                  emergency_contact, emergency_phone, therapist, total_sessions, notes,
                  status, last_session, next_session, progress, sessions_completed,
                  created_at, updated_at
      `;
            return result[0];
        } catch (error) {
            console.error('Error creating patient in Neon DB:', error);
            throw error;
        }
    }
    static async getPatients() {
        try {
            const result = await sql`
        SELECT id, name, email, phone, date_of_birth, diagnosis, medical_history,
               emergency_contact, emergency_phone, therapist, total_sessions, notes,
               status, last_session, next_session, progress, sessions_completed,
               created_at, updated_at
        FROM patients 
        ORDER BY created_at DESC
      `;
            return result;
        } catch (error) {
            console.error('Error getting patients from Neon DB:', error);
            throw error;
        }
    }
    static async getPatientById(id) {
        try {
            const result = await sql`
        SELECT id, name, email, phone, date_of_birth, diagnosis, medical_history,
               emergency_contact, emergency_phone, therapist, total_sessions, notes,
               status, last_session, next_session, progress, sessions_completed,
               created_at, updated_at
        FROM patients 
        WHERE id = ${id}
      `;
            return result[0] || null;
        } catch (error) {
            console.error('Error getting patient by ID from Neon DB:', error);
            throw error;
        }
    }
    static async updatePatient(id, patientData) {
        try {
            const { name, email, phone, dateOfBirth, diagnosis, medicalHistory, emergencyContact, emergencyPhone, therapist, totalSessions, notes, status, lastSession, nextSession, progress, sessionsCompleted } = patientData;
            const result = await sql`
        UPDATE patients 
        SET name = ${name}, 
            email = ${email}, 
            phone = ${phone || null}, 
            date_of_birth = ${dateOfBirth}, 
            diagnosis = ${diagnosis}, 
            medical_history = ${medicalHistory},
            emergency_contact = ${emergencyContact}, 
            emergency_phone = ${emergencyPhone}, 
            therapist = ${therapist}, 
            total_sessions = ${totalSessions}, 
            notes = ${notes || ''},
            status = ${status || 'active'}, 
            last_session = ${lastSession || 'N/A'}, 
            next_session = ${nextSession || 'TBD'}, 
            progress = ${progress || 0}, 
            sessions_completed = ${sessionsCompleted || 0},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, name, email, phone, date_of_birth, diagnosis, medical_history,
                  emergency_contact, emergency_phone, therapist, total_sessions, notes,
                  status, last_session, next_session, progress, sessions_completed,
                  created_at, updated_at
      `;
            return result[0];
        } catch (error) {
            console.error('Error updating patient in Neon DB:', error);
            throw error;
        }
    }
    static async deletePatient(id) {
        try {
            await sql`DELETE FROM patients WHERE id = ${id}`;
            return true;
        } catch (error) {
            console.error('Error deleting patient from Neon DB:', error);
            throw error;
        }
    }
    // Check if online
    static isOnline() {
        return navigator.onLine;
    }
}
const __TURBOPACK__default__export__ = NeonDBService;
}),
"[project]/src/lib/database/sync.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SyncService",
    ()=>SyncService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/indexeddb.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/neon.js [app-ssr] (ecmascript)");
;
;
class SyncService {
    static async syncToOnline() {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline() || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].isAvailable()) {
            console.log('Device is offline or Neon DB not available, skipping sync');
            return;
        }
        try {
            const syncQueue = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].getSyncQueue();
            for (const item of syncQueue){
                try {
                    await this.syncItem(item);
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].removeFromSyncQueue(item.id);
                } catch (error) {
                    console.error(`Error syncing item ${item.id}:`, error);
                    // Increment retry count
                    await this.incrementRetryCount(item.id);
                }
            }
        } catch (error) {
            console.error('Error during sync to online:', error);
        }
    }
    static async syncItem(item) {
        const { table, recordId, action, data } = item;
        switch(table){
            case 'users':
                await this.syncUser(recordId, action, data);
                break;
            case 'patients':
                await this.syncPatient(recordId, action, data);
                break;
            case 'sessions':
                await this.syncSession(recordId, action, data);
                break;
            case 'treatmentPlans':
                await this.syncTreatmentPlan(recordId, action, data);
                break;
            default:
                console.warn(`Unknown table for sync: ${table}`);
        }
    }
    static async syncUser(recordId, action, data) {
        switch(action){
            case 'create':
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].createUser(data);
                break;
            case 'update':
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].updateUser(recordId, data);
                break;
            case 'delete':
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].deleteUser(recordId);
                break;
        }
    }
    static async syncPatient(recordId, action, data) {
        switch(action){
            case 'create':
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].createPatient(data);
                break;
            case 'update':
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].updatePatient(recordId, data);
                break;
            case 'delete':
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].deletePatient(recordId);
                break;
        }
    }
    static async syncSession(recordId, action, data) {
        // Implement session sync logic
        console.log('Syncing session:', {
            recordId,
            action,
            data
        });
    }
    static async syncTreatmentPlan(recordId, action, data) {
        // Implement treatment plan sync logic
        console.log('Syncing treatment plan:', {
            recordId,
            action,
            data
        });
    }
    static async incrementRetryCount(itemId) {
        try {
            // This would need to be implemented in IndexedDBService
            console.log(`Incrementing retry count for item ${itemId}`);
        } catch (error) {
            console.error('Error incrementing retry count:', error);
        }
    }
    static async syncFromOnline() {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline() || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].isAvailable()) {
            console.log('Device is offline or Neon DB not available, skipping sync from online');
            return;
        }
        try {
            // Sync users
            const onlineUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].getUsers();
            for (const user of onlineUsers){
                try {
                    // Use createUser which handles duplicates
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].createUser(user);
                } catch (error) {
                    console.error('Error syncing user:', error);
                }
            }
            // Sync patients
            const onlinePatients = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].getPatients();
            for (const patient of onlinePatients){
                try {
                    // Use createPatient which handles duplicates
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].createPatient(patient);
                } catch (error) {
                    console.error('Error syncing patient:', error);
                }
            }
        } catch (error) {
            console.error('Error during sync from online:', error);
        }
    }
    // Initialize sync service
    static async initialize() {
        // Set up online/offline event listeners
        window.addEventListener('online', ()=>{
            console.log('Device came online, starting sync...');
            this.syncToOnline();
            this.syncFromOnline();
        });
        window.addEventListener('offline', ()=>{
            console.log('Device went offline');
        });
        // Initial sync if online
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
            await this.syncFromOnline();
        }
    }
}
const __TURBOPACK__default__export__ = SyncService;
}),
"[project]/src/lib/database/init.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatabaseInitializer",
    ()=>DatabaseInitializer,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-ssr] (ecmascript)");
;
// Neon DB configuration
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["neon"])(("TURBOPACK compile-time value", "postgresql://neondb_owner:npg_fIvBAb13GOzn@ep-shiny-mud-adwijmjc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"));
class DatabaseInitializer {
    static async checkAndCreateTables() {
        try {
            // Check if users table exists
            const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `;
            if (!tableCheck[0].exists) {
                console.log('Creating database tables...');
                await this.createTables();
                console.log('Database tables created successfully!');
            } else {
                console.log('Database tables already exist.');
            }
        } catch (error) {
            console.error('Error checking/creating database tables:', error);
            throw error;
        }
    }
    static async createTables() {
        try {
            // Create users table
            await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          license_number VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
            // Create patients table
            await sql`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(20),
          date_of_birth DATE,
          diagnosis TEXT,
          medical_history TEXT,
          emergency_contact VARCHAR(255),
          emergency_phone VARCHAR(20),
          therapist VARCHAR(255),
          total_sessions INTEGER DEFAULT 0,
          notes TEXT,
          status VARCHAR(50) DEFAULT 'active',
          last_session VARCHAR(100),
          next_session VARCHAR(100),
          progress INTEGER DEFAULT 0,
          sessions_completed INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
            // Create sessions table
            await sql`
        CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
          therapist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          date TIMESTAMP NOT NULL,
          duration INTEGER NOT NULL,
          type VARCHAR(100) NOT NULL,
          notes TEXT,
          status VARCHAR(50) DEFAULT 'scheduled',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
            // Create treatment_plans table
            await sql`
        CREATE TABLE IF NOT EXISTS treatment_plans (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
          therapist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          sessions JSONB,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
            // Create indexes for better performance
            await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`;
            await sql`CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);`;
            await sql`CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);`;
            await sql`CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id);`;
            await sql`CREATE INDEX IF NOT EXISTS idx_sessions_therapist_id ON sessions(therapist_id);`;
            await sql`CREATE INDEX IF NOT EXISTS idx_treatment_plans_patient_id ON treatment_plans(patient_id);`;
            // Insert a default admin user (password: admin123)
            await sql`
        INSERT INTO users (first_name, last_name, email, password_hash, role, license_number) 
        VALUES (
          'Admin', 
          'User', 
          'admin@luminate.com', 
          '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9yQKQK2',
          'clinician', 
          'ADMIN001'
        ) ON CONFLICT (email) DO NOTHING;
      `;
        } catch (error) {
            console.error('Error creating tables:', error);
            throw error;
        }
    }
    static async testConnection() {
        try {
            const result = await sql`SELECT NOW() as current_time;`;
            console.log('Database connection successful:', result[0]);
            return true;
        } catch (error) {
            console.error('Database connection failed:', error);
            return false;
        }
    }
}
const __TURBOPACK__default__export__ = DatabaseInitializer;
}),
"[project]/src/lib/database/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatabaseService",
    ()=>DatabaseService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/indexeddb.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/neon.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$sync$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/sync.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$init$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/init.js [app-ssr] (ecmascript)");
;
;
;
;
class DatabaseService {
    static async initialize() {
        try {
            // Initialize IndexedDB
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].initialize();
            // Check and create Neon DB tables if they don't exist
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$init$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatabaseInitializer"].checkAndCreateTables();
                } catch (error) {
                    console.warn('Neon database setup failed, continuing with offline mode only:', error.message);
                }
            } else //TURBOPACK unreachable
            ;
            // Initialize sync service
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$sync$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SyncService"].initialize();
            console.log('Database service initialized successfully');
        } catch (error) {
            console.error('Error initializing database service:', error);
            throw error;
        }
    }
    // User operations with dual database support
    static async createUser(userData) {
        try {
            // Always create in IndexedDB first (offline-first approach)
            const localUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].createUser(userData);
            // If online and Neon DB is available, also create in Neon DB
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline() && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].isAvailable()) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].createUser(userData);
                    // Update local user to mark as online
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].updateUser(localUser.id, {
                        isOnline: true
                    });
                } catch (error) {
                    console.error('Error creating user in Neon DB:', error);
                    // Add to sync queue for later
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('users', localUser.id, 'create', userData);
                }
            } else {
                // Add to sync queue for when online
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('users', localUser.id, 'create', userData);
            }
            return localUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
    static async getUserByEmail(email) {
        try {
            // Try to get from IndexedDB first
            let user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].getUserByEmail(email);
            // If not found locally and online, try Neon DB
            if (!user && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].getUserByEmail(email);
                    if (user) {
                        // Store in IndexedDB for offline access
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].createUser(user);
                    }
                } catch (error) {
                    console.error('Error getting user from Neon DB:', error);
                }
            }
            return user;
        } catch (error) {
            console.error('Error getting user by email:', error);
            throw error;
        }
    }
    static async getUserById(id) {
        try {
            // Try to get from IndexedDB first
            let user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].getUserById(id);
            // If not found locally and online, try Neon DB
            if (!user && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].getUserById(id);
                    if (user) {
                        // Store in IndexedDB for offline access
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].createUser(user);
                    }
                } catch (error) {
                    console.error('Error getting user from Neon DB:', error);
                }
            }
            return user;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            throw error;
        }
    }
    static async updateUser(id, userData) {
        try {
            // Update in IndexedDB first
            const localUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].updateUser(id, userData);
            // If online, also update in Neon DB
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].updateUser(id, userData);
                } catch (error) {
                    console.error('Error updating user in Neon DB:', error);
                    // Add to sync queue for later
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('users', id, 'update', userData);
                }
            } else {
                // Add to sync queue for when online
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('users', id, 'update', userData);
            }
            return localUser;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
    // Patient operations with dual database support
    static async createPatient(patientData) {
        try {
            // Always create in IndexedDB first (offline-first approach)
            const localPatient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].createPatient(patientData);
            // If online, also create in Neon DB
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].createPatient(patientData);
                    // Update local patient to mark as online
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].updatePatient(localPatient.id, {
                        isOnline: true
                    });
                } catch (error) {
                    console.error('Error creating patient in Neon DB:', error);
                    // Add to sync queue for later
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('patients', localPatient.id, 'create', patientData);
                }
            } else {
                // Add to sync queue for when online
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('patients', localPatient.id, 'create', patientData);
            }
            return localPatient;
        } catch (error) {
            console.error('Error creating patient:', error);
            throw error;
        }
    }
    static async getPatients() {
        try {
            // Get from IndexedDB first
            let patients = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].getPatients();
            // If online, also sync from Neon DB
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    const onlinePatients = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].getPatients();
                    // Merge online patients with local ones
                    for (const onlinePatient of onlinePatients){
                        const localPatient = patients.find((p)=>p.id === onlinePatient.id);
                        if (!localPatient) {
                            // Add new patient from online
                            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].createPatient(onlinePatient);
                            patients.push(onlinePatient);
                        }
                    }
                } catch (error) {
                    console.error('Error getting patients from Neon DB:', error);
                }
            }
            return patients;
        } catch (error) {
            console.error('Error getting patients:', error);
            throw error;
        }
    }
    static async getPatientById(id) {
        try {
            // Try to get from IndexedDB first
            let patient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].getPatientById(id);
            // If not found locally and online, try Neon DB
            if (!patient && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    patient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].getPatientById(id);
                    if (patient) {
                        // Store in IndexedDB for offline access
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].createPatient(patient);
                    }
                } catch (error) {
                    console.error('Error getting patient from Neon DB:', error);
                }
            }
            return patient;
        } catch (error) {
            console.error('Error getting patient by ID:', error);
            throw error;
        }
    }
    static async updatePatient(id, patientData) {
        try {
            // Update in IndexedDB first
            const localPatient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].updatePatient(id, patientData);
            // If online, also update in Neon DB
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].updatePatient(id, patientData);
                } catch (error) {
                    console.error('Error updating patient in Neon DB:', error);
                    // Add to sync queue for later
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('patients', id, 'update', patientData);
                }
            } else {
                // Add to sync queue for when online
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('patients', id, 'update', patientData);
            }
            return localPatient;
        } catch (error) {
            console.error('Error updating patient:', error);
            throw error;
        }
    }
    static async deletePatient(id) {
        try {
            // Delete from IndexedDB first
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].deletePatient(id);
            // If online, also delete from Neon DB
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeonDBService"].deletePatient(id);
                } catch (error) {
                    console.error('Error deleting patient from Neon DB:', error);
                    // Add to sync queue for later
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('patients', id, 'delete', {});
                }
            } else {
                // Add to sync queue for when online
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('patients', id, 'delete', {});
            }
            return true;
        } catch (error) {
            console.error('Error deleting patient:', error);
            throw error;
        }
    }
    // Sync operations
    static async sync() {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$sync$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SyncService"].syncToOnline();
    }
    static async isOnline() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline();
    }
}
const __TURBOPACK__default__export__ = DatabaseService;
}),
"[project]/src/lib/database/debug.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatabaseDebug",
    ()=>DatabaseDebug,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/indexeddb.js [app-ssr] (ecmascript)");
;
class DatabaseDebug {
    // Clear all local data
    static async clearLocalData() {
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].clearAll();
            console.log('✅ Local database cleared successfully');
            return {
                success: true,
                message: 'Local database cleared successfully'
            };
        } catch (error) {
            console.error('❌ Error clearing local database:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    // Get database statistics
    static async getStats() {
        try {
            const users = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].getUsers();
            const patients = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].getPatients();
            const syncQueue = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].getSyncQueue();
            return {
                success: true,
                stats: {
                    users: users.length,
                    patients: patients.length,
                    syncQueue: syncQueue.length,
                    isOnline: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()
                }
            };
        } catch (error) {
            console.error('❌ Error getting database stats:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    // Reset database (clear and reinitialize)
    static async reset() {
        try {
            await this.clearLocalData();
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].initialize();
            console.log('✅ Database reset successfully');
            return {
                success: true,
                message: 'Database reset successfully'
            };
        } catch (error) {
            console.error('❌ Error resetting database:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    // Force reset database (delete and recreate)
    static async forceReset() {
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndexedDBService"].forceReset();
            console.log('✅ Database force reset successfully');
            return {
                success: true,
                message: 'Database force reset successfully'
            };
        } catch (error) {
            console.error('❌ Error force resetting database:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}
// Make debug functions available globally for console debugging
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const __TURBOPACK__default__export__ = DatabaseDebug;
}),
"[project]/src/components/DatabaseInitializer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DatabaseInitializer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$debug$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/debug.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function DatabaseInitializer({ children }) {
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initializeDatabase = async ()=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatabaseService"].initialize();
                setIsInitialized(true);
            } catch (error) {
                console.error('Error initializing database:', error);
                setError(error.message);
                // Still set as initialized to prevent blocking the app
                setIsInitialized(true);
            }
        };
        initializeDatabase();
    }, []);
    if (!isInitialized) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-8 h-8 text-white",
                            fill: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DatabaseInitializer.js",
                                lineNumber: 33,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/DatabaseInitializer.js",
                            lineNumber: 32,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/DatabaseInitializer.js",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-white mb-2",
                        children: "Initializing Database"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DatabaseInitializer.js",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-400",
                        children: "Setting up offline and online storage..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/DatabaseInitializer.js",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DatabaseInitializer.js",
                lineNumber: 30,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/DatabaseInitializer.js",
            lineNumber: 29,
            columnNumber: 7
        }, this);
    }
    if (error) {
        console.warn('Database initialization warning:', error);
    }
    return children;
}
}),
"[project]/src/components/DatabaseStatus.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DatabaseStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$debug$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/debug.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function DatabaseStatus() {
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadStats = async ()=>{
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$debug$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatabaseDebug"].getStats();
            if (result.success) {
                setStats(result.stats);
            }
        };
        loadStats();
    }, []);
    const handleClearData = async ()=>{
        if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$debug$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatabaseDebug"].clearLocalData();
            if (result.success) {
                alert('Local data cleared successfully!');
                window.location.reload();
            } else {
                alert('Error clearing data: ' + result.error);
            }
        }
    };
    const handleReset = async ()=>{
        if (confirm('Are you sure you want to reset the database? This will clear all local data and reinitialize.')) {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$debug$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatabaseDebug"].reset();
            if (result.success) {
                alert('Database reset successfully!');
                window.location.reload();
            } else {
                alert('Error resetting database: ' + result.error);
            }
        }
    };
    const handleForceReset = async ()=>{
        if (confirm('Are you sure you want to FORCE reset the database? This will completely delete and recreate the database. This is more aggressive and should fix constraint errors.')) {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$debug$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatabaseDebug"].forceReset();
            if (result.success) {
                alert('Database force reset successfully!');
                window.location.reload();
            } else {
                alert('Error force resetting database: ' + result.error);
            }
        }
    };
    if (!isVisible) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: ()=>setIsVisible(true),
            className: "fixed bottom-4 right-4 bg-slate-700 text-white p-2 rounded-full shadow-lg hover:bg-slate-600 transition-colors z-50",
            title: "Database Status",
            children: "🗄️"
        }, void 0, false, {
            fileName: "[project]/src/components/DatabaseStatus.js",
            lineNumber: 58,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-4 right-4 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl z-50 max-w-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-white font-semibold",
                        children: "Database Status"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DatabaseStatus.js",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsVisible(false),
                        className: "text-slate-400 hover:text-white",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DatabaseStatus.js",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DatabaseStatus.js",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 text-sm text-slate-300 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Users:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DatabaseStatus.js",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-cyan-400",
                                children: stats.users
                            }, void 0, false, {
                                fileName: "[project]/src/components/DatabaseStatus.js",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DatabaseStatus.js",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Patients:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DatabaseStatus.js",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-cyan-400",
                                children: stats.patients
                            }, void 0, false, {
                                fileName: "[project]/src/components/DatabaseStatus.js",
                                lineNumber: 88,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DatabaseStatus.js",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Sync Queue:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DatabaseStatus.js",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-cyan-400",
                                children: stats.syncQueue
                            }, void 0, false, {
                                fileName: "[project]/src/components/DatabaseStatus.js",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DatabaseStatus.js",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Status:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DatabaseStatus.js",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: stats.isOnline ? 'text-green-400' : 'text-yellow-400',
                                children: stats.isOnline ? 'Online' : 'Offline'
                            }, void 0, false, {
                                fileName: "[project]/src/components/DatabaseStatus.js",
                                lineNumber: 96,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DatabaseStatus.js",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DatabaseStatus.js",
                lineNumber: 81,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleClearData,
                        className: "w-full bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded transition-colors",
                        children: "Clear Local Data"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DatabaseStatus.js",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleReset,
                        className: "w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-2 px-3 rounded transition-colors",
                        children: "Reset Database"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DatabaseStatus.js",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DatabaseStatus.js",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DatabaseStatus.js",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__944935f6._.js.map