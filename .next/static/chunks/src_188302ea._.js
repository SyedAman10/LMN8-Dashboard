(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/database/indexeddb.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IndexedDBService",
    ()=>IndexedDBService,
    "db",
    ()=>db,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dexie$2f$import$2d$wrapper$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dexie/import-wrapper.mjs [app-client] (ecmascript)");
;
const db = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dexie$2f$import$2d$wrapper$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]('LuminateClinicianDB');
// Define database schema
db.version(1).stores({
    users: '++id, email, firstName, lastName, role, licenseNumber, passwordHash, createdAt, updatedAt, isOnline',
    patients: '++id, name, email, phone, dateOfBirth, diagnosis, medicalHistory, emergencyContact, emergencyPhone, therapist, totalSessions, notes, status, lastSession, nextSession, progress, sessionsCompleted, createdAt, updatedAt, isOnline',
    sessions: '++id, patientId, therapistId, date, duration, type, notes, status, createdAt, updatedAt, isOnline',
    treatmentPlans: '++id, patientId, therapistId, title, description, sessions, status, createdAt, updatedAt, isOnline',
    syncQueue: '++id, table, recordId, action, data, timestamp, retryCount'
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
            throw error;
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
}
const __TURBOPACK__default__export__ = IndexedDBService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/database/neon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NeonDBService",
    ()=>NeonDBService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_tagged_template_literal.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-client] (ecmascript)");
;
function _templateObject() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        INSERT INTO users (first_name, last_name, email, password_hash, role, license_number, created_at, updated_at)\n        VALUES (",
        ", ",
        ", ",
        ", ",
        ", ",
        ", ",
        ", NOW(), NOW())\n        RETURNING id, first_name, last_name, email, role, license_number, created_at, updated_at\n      "
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function _templateObject1() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        SELECT id, first_name, last_name, email, password_hash, role, license_number, created_at, updated_at\n        FROM users \n        WHERE email = ",
        "\n      "
    ]);
    _templateObject1 = function() {
        return data;
    };
    return data;
}
function _templateObject2() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        SELECT id, first_name, last_name, email, password_hash, role, license_number, created_at, updated_at\n        FROM users \n        WHERE id = ",
        "\n      "
    ]);
    _templateObject2 = function() {
        return data;
    };
    return data;
}
function _templateObject3() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        UPDATE users \n        SET first_name = ",
        ", \n            last_name = ",
        ", \n            email = ",
        ", \n            role = ",
        ", \n            license_number = ",
        ",\n            updated_at = NOW()\n        WHERE id = ",
        "\n        RETURNING id, first_name, last_name, email, role, license_number, created_at, updated_at\n      "
    ]);
    _templateObject3 = function() {
        return data;
    };
    return data;
}
function _templateObject4() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        SELECT id, first_name, last_name, email, password_hash, role, license_number, created_at, updated_at\n        FROM users \n        ORDER BY created_at DESC\n      "
    ]);
    _templateObject4 = function() {
        return data;
    };
    return data;
}
function _templateObject5() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "DELETE FROM users WHERE id = ",
        ""
    ]);
    _templateObject5 = function() {
        return data;
    };
    return data;
}
function _templateObject6() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        INSERT INTO patients (\n          name, email, phone, date_of_birth, diagnosis, medical_history,\n          emergency_contact, emergency_phone, therapist, total_sessions, notes,\n          status, last_session, next_session, progress, sessions_completed,\n          created_at, updated_at\n        )\n        VALUES (\n          ",
        ", ",
        ", ",
        ", ",
        ", ",
        ", ",
        ",\n          ",
        ", ",
        ", ",
        ", ",
        ", ",
        ",\n          'active', 'N/A', 'TBD', 0, 0,\n          NOW(), NOW()\n        )\n        RETURNING id, name, email, phone, date_of_birth, diagnosis, medical_history,\n                  emergency_contact, emergency_phone, therapist, total_sessions, notes,\n                  status, last_session, next_session, progress, sessions_completed,\n                  created_at, updated_at\n      "
    ]);
    _templateObject6 = function() {
        return data;
    };
    return data;
}
function _templateObject7() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        SELECT id, name, email, phone, date_of_birth, diagnosis, medical_history,\n               emergency_contact, emergency_phone, therapist, total_sessions, notes,\n               status, last_session, next_session, progress, sessions_completed,\n               created_at, updated_at\n        FROM patients \n        ORDER BY created_at DESC\n      "
    ]);
    _templateObject7 = function() {
        return data;
    };
    return data;
}
function _templateObject8() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        SELECT id, name, email, phone, date_of_birth, diagnosis, medical_history,\n               emergency_contact, emergency_phone, therapist, total_sessions, notes,\n               status, last_session, next_session, progress, sessions_completed,\n               created_at, updated_at\n        FROM patients \n        WHERE id = ",
        "\n      "
    ]);
    _templateObject8 = function() {
        return data;
    };
    return data;
}
function _templateObject9() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        UPDATE patients \n        SET name = ",
        ", \n            email = ",
        ", \n            phone = ",
        ", \n            date_of_birth = ",
        ", \n            diagnosis = ",
        ", \n            medical_history = ",
        ",\n            emergency_contact = ",
        ", \n            emergency_phone = ",
        ", \n            therapist = ",
        ", \n            total_sessions = ",
        ", \n            notes = ",
        ",\n            status = ",
        ", \n            last_session = ",
        ", \n            next_session = ",
        ", \n            progress = ",
        ", \n            sessions_completed = ",
        ",\n            updated_at = NOW()\n        WHERE id = ",
        "\n        RETURNING id, name, email, phone, date_of_birth, diagnosis, medical_history,\n                  emergency_contact, emergency_phone, therapist, total_sessions, notes,\n                  status, last_session, next_session, progress, sessions_completed,\n                  created_at, updated_at\n      "
    ]);
    _templateObject9 = function() {
        return data;
    };
    return data;
}
function _templateObject10() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "DELETE FROM patients WHERE id = ",
        ""
    ]);
    _templateObject10 = function() {
        return data;
    };
    return data;
}
;
// Neon DB configuration
const sql = ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["neon"])(("TURBOPACK compile-time value", "postgresql://neondb_owner:npg_fIvBAb13GOzn@ep-shiny-mud-adwijmjc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")) : "TURBOPACK unreachable";
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
            const result = await sql(_templateObject(), firstName, lastName, email, passwordHash, role, licenseNumber || null);
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
            const result = await sql(_templateObject1(), email);
            return result[0] || null;
        } catch (error) {
            console.error('Error getting user by email from Neon DB:', error);
            throw error;
        }
    }
    static async getUserById(id) {
        try {
            const result = await sql(_templateObject2(), id);
            return result[0] || null;
        } catch (error) {
            console.error('Error getting user by ID from Neon DB:', error);
            throw error;
        }
    }
    static async updateUser(id, userData) {
        try {
            const { firstName, lastName, email, role, licenseNumber } = userData;
            const result = await sql(_templateObject3(), firstName, lastName, email, role, licenseNumber || null, id);
            return result[0];
        } catch (error) {
            console.error('Error updating user in Neon DB:', error);
            throw error;
        }
    }
    static async getUsers() {
        try {
            const result = await sql(_templateObject4());
            return result;
        } catch (error) {
            console.error('Error getting users from Neon DB:', error);
            throw error;
        }
    }
    static async deleteUser(id) {
        try {
            await sql(_templateObject5(), id);
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
            const result = await sql(_templateObject6(), name, email, phone || null, dateOfBirth, diagnosis, medicalHistory, emergencyContact, emergencyPhone, therapist, totalSessions, notes || '');
            return result[0];
        } catch (error) {
            console.error('Error creating patient in Neon DB:', error);
            throw error;
        }
    }
    static async getPatients() {
        try {
            const result = await sql(_templateObject7());
            return result;
        } catch (error) {
            console.error('Error getting patients from Neon DB:', error);
            throw error;
        }
    }
    static async getPatientById(id) {
        try {
            const result = await sql(_templateObject8(), id);
            return result[0] || null;
        } catch (error) {
            console.error('Error getting patient by ID from Neon DB:', error);
            throw error;
        }
    }
    static async updatePatient(id, patientData) {
        try {
            const { name, email, phone, dateOfBirth, diagnosis, medicalHistory, emergencyContact, emergencyPhone, therapist, totalSessions, notes, status, lastSession, nextSession, progress, sessionsCompleted } = patientData;
            const result = await sql(_templateObject9(), name, email, phone || null, dateOfBirth, diagnosis, medicalHistory, emergencyContact, emergencyPhone, therapist, totalSessions, notes || '', status || 'active', lastSession || 'N/A', nextSession || 'TBD', progress || 0, sessionsCompleted || 0, id);
            return result[0];
        } catch (error) {
            console.error('Error updating patient in Neon DB:', error);
            throw error;
        }
    }
    static async deletePatient(id) {
        try {
            await sql(_templateObject10(), id);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/database/sync.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SyncService",
    ()=>SyncService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/indexeddb.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/neon.js [app-client] (ecmascript)");
;
;
class SyncService {
    static async syncToOnline() {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline() || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].isAvailable()) {
            console.log('Device is offline or Neon DB not available, skipping sync');
            return;
        }
        try {
            const syncQueue = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].getSyncQueue();
            for (const item of syncQueue){
                try {
                    await this.syncItem(item);
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].removeFromSyncQueue(item.id);
                } catch (error) {
                    console.error("Error syncing item ".concat(item.id, ":"), error);
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
                console.warn("Unknown table for sync: ".concat(table));
        }
    }
    static async syncUser(recordId, action, data) {
        switch(action){
            case 'create':
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].createUser(data);
                break;
            case 'update':
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].updateUser(recordId, data);
                break;
            case 'delete':
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].deleteUser(recordId);
                break;
        }
    }
    static async syncPatient(recordId, action, data) {
        switch(action){
            case 'create':
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].createPatient(data);
                break;
            case 'update':
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].updatePatient(recordId, data);
                break;
            case 'delete':
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].deletePatient(recordId);
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
            console.log("Incrementing retry count for item ".concat(itemId));
        } catch (error) {
            console.error('Error incrementing retry count:', error);
        }
    }
    static async syncFromOnline() {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline() || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].isAvailable()) {
            console.log('Device is offline or Neon DB not available, skipping sync from online');
            return;
        }
        try {
            // Sync users
            const onlineUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].getUsers();
            for (const user of onlineUsers){
                try {
                    // Use createUser which handles duplicates
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].createUser(user);
                } catch (error) {
                    console.error('Error syncing user:', error);
                }
            }
            // Sync patients
            const onlinePatients = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].getPatients();
            for (const patient of onlinePatients){
                try {
                    // Use createPatient which handles duplicates
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].createPatient(patient);
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
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
            await this.syncFromOnline();
        }
    }
}
const __TURBOPACK__default__export__ = SyncService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/database/init.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatabaseInitializer",
    ()=>DatabaseInitializer,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_tagged_template_literal.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-client] (ecmascript)");
;
function _templateObject() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        SELECT EXISTS (\n          SELECT FROM information_schema.tables \n          WHERE table_schema = 'public' \n          AND table_name = 'users'\n        );\n      "
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function _templateObject1() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        CREATE TABLE IF NOT EXISTS users (\n          id SERIAL PRIMARY KEY,\n          first_name VARCHAR(255) NOT NULL,\n          last_name VARCHAR(255) NOT NULL,\n          email VARCHAR(255) UNIQUE NOT NULL,\n          password_hash VARCHAR(255) NOT NULL,\n          role VARCHAR(50) NOT NULL,\n          license_number VARCHAR(255),\n          created_at TIMESTAMP DEFAULT NOW(),\n          updated_at TIMESTAMP DEFAULT NOW()\n        );\n      "
    ]);
    _templateObject1 = function() {
        return data;
    };
    return data;
}
function _templateObject2() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        CREATE TABLE IF NOT EXISTS patients (\n          id SERIAL PRIMARY KEY,\n          name VARCHAR(255) NOT NULL,\n          email VARCHAR(255),\n          phone VARCHAR(20),\n          date_of_birth DATE,\n          diagnosis TEXT,\n          medical_history TEXT,\n          emergency_contact VARCHAR(255),\n          emergency_phone VARCHAR(20),\n          therapist VARCHAR(255),\n          total_sessions INTEGER DEFAULT 0,\n          notes TEXT,\n          status VARCHAR(50) DEFAULT 'active',\n          last_session VARCHAR(100),\n          next_session VARCHAR(100),\n          progress INTEGER DEFAULT 0,\n          sessions_completed INTEGER DEFAULT 0,\n          created_at TIMESTAMP DEFAULT NOW(),\n          updated_at TIMESTAMP DEFAULT NOW()\n        );\n      "
    ]);
    _templateObject2 = function() {
        return data;
    };
    return data;
}
function _templateObject3() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        CREATE TABLE IF NOT EXISTS sessions (\n          id SERIAL PRIMARY KEY,\n          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,\n          therapist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,\n          date TIMESTAMP NOT NULL,\n          duration INTEGER NOT NULL,\n          type VARCHAR(100) NOT NULL,\n          notes TEXT,\n          status VARCHAR(50) DEFAULT 'scheduled',\n          created_at TIMESTAMP DEFAULT NOW(),\n          updated_at TIMESTAMP DEFAULT NOW()\n        );\n      "
    ]);
    _templateObject3 = function() {
        return data;
    };
    return data;
}
function _templateObject4() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        CREATE TABLE IF NOT EXISTS treatment_plans (\n          id SERIAL PRIMARY KEY,\n          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,\n          therapist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,\n          title VARCHAR(255) NOT NULL,\n          description TEXT,\n          sessions JSONB,\n          status VARCHAR(50) DEFAULT 'active',\n          created_at TIMESTAMP DEFAULT NOW(),\n          updated_at TIMESTAMP DEFAULT NOW()\n        );\n      "
    ]);
    _templateObject4 = function() {
        return data;
    };
    return data;
}
function _templateObject5() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);"
    ]);
    _templateObject5 = function() {
        return data;
    };
    return data;
}
function _templateObject6() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);"
    ]);
    _templateObject6 = function() {
        return data;
    };
    return data;
}
function _templateObject7() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);"
    ]);
    _templateObject7 = function() {
        return data;
    };
    return data;
}
function _templateObject8() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id);"
    ]);
    _templateObject8 = function() {
        return data;
    };
    return data;
}
function _templateObject9() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "CREATE INDEX IF NOT EXISTS idx_sessions_therapist_id ON sessions(therapist_id);"
    ]);
    _templateObject9 = function() {
        return data;
    };
    return data;
}
function _templateObject10() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "CREATE INDEX IF NOT EXISTS idx_treatment_plans_patient_id ON treatment_plans(patient_id);"
    ]);
    _templateObject10 = function() {
        return data;
    };
    return data;
}
function _templateObject11() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "\n        INSERT INTO users (first_name, last_name, email, password_hash, role, license_number) \n        VALUES (\n          'Admin', \n          'User', \n          'admin@luminate.com', \n          '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9yQKQK2',\n          'clinician', \n          'ADMIN001'\n        ) ON CONFLICT (email) DO NOTHING;\n      "
    ]);
    _templateObject11 = function() {
        return data;
    };
    return data;
}
function _templateObject12() {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])([
        "SELECT NOW() as current_time;"
    ]);
    _templateObject12 = function() {
        return data;
    };
    return data;
}
;
// Neon DB configuration
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["neon"])(("TURBOPACK compile-time value", "postgresql://neondb_owner:npg_fIvBAb13GOzn@ep-shiny-mud-adwijmjc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"));
class DatabaseInitializer {
    static async checkAndCreateTables() {
        try {
            // Check if users table exists
            const tableCheck = await sql(_templateObject());
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
            await sql(_templateObject1());
            // Create patients table
            await sql(_templateObject2());
            // Create sessions table
            await sql(_templateObject3());
            // Create treatment_plans table
            await sql(_templateObject4());
            // Create indexes for better performance
            await sql(_templateObject5());
            await sql(_templateObject6());
            await sql(_templateObject7());
            await sql(_templateObject8());
            await sql(_templateObject9());
            await sql(_templateObject10());
            // Insert a default admin user (password: admin123)
            await sql(_templateObject11());
        } catch (error) {
            console.error('Error creating tables:', error);
            throw error;
        }
    }
    static async testConnection() {
        try {
            const result = await sql(_templateObject12());
            console.log('Database connection successful:', result[0]);
            return true;
        } catch (error) {
            console.error('Database connection failed:', error);
            return false;
        }
    }
}
const __TURBOPACK__default__export__ = DatabaseInitializer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/database/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatabaseService",
    ()=>DatabaseService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/indexeddb.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/neon.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$sync$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/sync.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$init$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/init.js [app-client] (ecmascript)");
;
;
;
;
class DatabaseService {
    static async initialize() {
        try {
            // Initialize IndexedDB
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].initialize();
            // Check and create Neon DB tables if they don't exist
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$init$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DatabaseInitializer"].checkAndCreateTables();
                } catch (error) {
                    console.warn('Neon database setup failed, continuing with offline mode only:', error.message);
                }
            } else //TURBOPACK unreachable
            ;
            // Initialize sync service
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$sync$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SyncService"].initialize();
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
            const localUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].createUser(userData);
            // If online and Neon DB is available, also create in Neon DB
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline() && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].isAvailable()) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].createUser(userData);
                    // Update local user to mark as online
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].updateUser(localUser.id, {
                        isOnline: true
                    });
                } catch (error) {
                    console.error('Error creating user in Neon DB:', error);
                    // Add to sync queue for later
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('users', localUser.id, 'create', userData);
                }
            } else {
                // Add to sync queue for when online
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('users', localUser.id, 'create', userData);
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
            let user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].getUserByEmail(email);
            // If not found locally and online, try Neon DB
            if (!user && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].getUserByEmail(email);
                    if (user) {
                        // Store in IndexedDB for offline access
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].createUser(user);
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
            let user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].getUserById(id);
            // If not found locally and online, try Neon DB
            if (!user && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].getUserById(id);
                    if (user) {
                        // Store in IndexedDB for offline access
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].createUser(user);
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
            const localUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].updateUser(id, userData);
            // If online, also update in Neon DB
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].updateUser(id, userData);
                } catch (error) {
                    console.error('Error updating user in Neon DB:', error);
                    // Add to sync queue for later
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('users', id, 'update', userData);
                }
            } else {
                // Add to sync queue for when online
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('users', id, 'update', userData);
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
            const localPatient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].createPatient(patientData);
            // If online, also create in Neon DB
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].createPatient(patientData);
                    // Update local patient to mark as online
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].updatePatient(localPatient.id, {
                        isOnline: true
                    });
                } catch (error) {
                    console.error('Error creating patient in Neon DB:', error);
                    // Add to sync queue for later
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('patients', localPatient.id, 'create', patientData);
                }
            } else {
                // Add to sync queue for when online
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('patients', localPatient.id, 'create', patientData);
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
            let patients = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].getPatients();
            // If online, also sync from Neon DB
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    const onlinePatients = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].getPatients();
                    // Merge online patients with local ones
                    for (const onlinePatient of onlinePatients){
                        const localPatient = patients.find((p)=>p.id === onlinePatient.id);
                        if (!localPatient) {
                            // Add new patient from online
                            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].createPatient(onlinePatient);
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
            let patient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].getPatientById(id);
            // If not found locally and online, try Neon DB
            if (!patient && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    patient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].getPatientById(id);
                    if (patient) {
                        // Store in IndexedDB for offline access
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].createPatient(patient);
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
            const localPatient = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].updatePatient(id, patientData);
            // If online, also update in Neon DB
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].updatePatient(id, patientData);
                } catch (error) {
                    console.error('Error updating patient in Neon DB:', error);
                    // Add to sync queue for later
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('patients', id, 'update', patientData);
                }
            } else {
                // Add to sync queue for when online
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('patients', id, 'update', patientData);
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].deletePatient(id);
            // If online, also delete from Neon DB
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$neon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeonDBService"].deletePatient(id);
                } catch (error) {
                    console.error('Error deleting patient from Neon DB:', error);
                    // Add to sync queue for later
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('patients', id, 'delete', {});
                }
            } else {
                // Add to sync queue for when online
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].addToSyncQueue('patients', id, 'delete', {});
            }
            return true;
        } catch (error) {
            console.error('Error deleting patient:', error);
            throw error;
        }
    }
    // Sync operations
    static async sync() {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$sync$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SyncService"].syncToOnline();
    }
    static async isOnline() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline();
    }
}
const __TURBOPACK__default__export__ = DatabaseService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/database/debug.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatabaseDebug",
    ()=>DatabaseDebug,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/indexeddb.js [app-client] (ecmascript)");
;
class DatabaseDebug {
    // Clear all local data
    static async clearLocalData() {
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].clearAll();
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
            const users = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].getUsers();
            const patients = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].getPatients();
            const syncQueue = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].getSyncQueue();
            return {
                success: true,
                stats: {
                    users: users.length,
                    patients: patients.length,
                    syncQueue: syncQueue.length,
                    isOnline: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].isOnline()
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBService"].initialize();
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
}
// Make debug functions available globally for console debugging
if ("TURBOPACK compile-time truthy", 1) {
    window.DatabaseDebug = DatabaseDebug;
    console.log('🔧 Database debug tools available:');
    console.log('  - DatabaseDebug.clearLocalData() - Clear all local data');
    console.log('  - DatabaseDebug.getStats() - Get database statistics');
    console.log('  - DatabaseDebug.reset() - Reset database');
}
const __TURBOPACK__default__export__ = DatabaseDebug;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/DatabaseInitializer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DatabaseInitializer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$debug$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database/debug.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function DatabaseInitializer(param) {
    let { children } = param;
    _s();
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DatabaseInitializer.useEffect": ()=>{
            const initializeDatabase = {
                "DatabaseInitializer.useEffect.initializeDatabase": async ()=>{
                    try {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DatabaseService"].initialize();
                        setIsInitialized(true);
                    } catch (error) {
                        console.error('Error initializing database:', error);
                        setError(error.message);
                        // Still set as initialized to prevent blocking the app
                        setIsInitialized(true);
                    }
                }
            }["DatabaseInitializer.useEffect.initializeDatabase"];
            initializeDatabase();
        }
    }["DatabaseInitializer.useEffect"], []);
    if (!isInitialized) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-8 h-8 text-white",
                            fill: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-white mb-2",
                        children: "Initializing Database"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DatabaseInitializer.js",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s(DatabaseInitializer, "IQyRC1Ko0mQIfjL9MuBiqM+M+IQ=");
_c = DatabaseInitializer;
var _c;
__turbopack_context__.k.register(_c, "DatabaseInitializer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_188302ea._.js.map