/**
 * JsonPowerDB Configuration and Database Operations
 * 
 * This module handles all database operations for the Student Enrollment Form.
 * It uses JsonPowerDB REST APIs for CRUD operations.
 */

const JPDB = {
    // Database Configuration
    config: {
        // Replace with your JsonPowerDB connection token
        // IMPORTANT: In production, fetch this from a secure backend service
        // Never expose real tokens in publicly committed frontend code
        connToken: "YOUR_CONNECTION_TOKEN_HERE",
        
        // Database and Table names
        database: "SCHOOL-DB",
        relation: "STUDENT-TABLE",
        
        // JsonPowerDB Base URL
        // For local development: "http://localhost:8081"
        // For live server: Use your hosted JPDB URL
        baseUrl: "http://localhost:8081"
    },

    /**
     * Execute a PUT request to JPDB
     * @param {string} urlPath - API endpoint path
     * @param {object} data - Data to send
     * @returns {Promise<object>} Response from JPDB
     */
    executePutRequest: async function(urlPath, data) {
        const url = `${this.config.baseUrl}${urlPath}`;
        
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('PUT Request Error:', error);
            throw new Error('Failed to connect to database. Please check your connection.');
        }
    },

    /**
     * Execute a GET request to JPDB
     * @param {string} urlPath - API endpoint path
     * @returns {Promise<object>} Response from JPDB
     */
    executeGetRequest: async function(urlPath) {
        const url = `${this.config.baseUrl}${urlPath}`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('GET Request Error:', error);
            throw new Error('Failed to connect to database. Please check your connection.');
        }
    },

    /**
     * Check if a record exists by Roll Number (Primary Key)
     * @param {string} rollNo - Roll Number to check
     * @returns {Promise<object>} Object containing exists flag and record data
     */
    checkRecordExists: async function(rollNo) {
        const requestData = {
            token: this.config.connToken,
            dbName: this.config.database,
            rel: this.config.relation,
            cmd: "GET_BY_KEY",
            key: rollNo.toString()
        };
        
        const result = await this.executeGetRequest(
            `/api/irl?cmd=${requestData.cmd}&key=${requestData.key}&dbName=${requestData.dbName}&rel=${requestData.relation}&token=${requestData.token}`
        );
        
        // JPDB returns status 200 if record exists, 400/404 if not
        if (result.status === 200 && result.data && result.data.record) {
            return {
                exists: true,
                record: result.data.record
            };
        }
        
        return {
            exists: false,
            record: null
        };
    },

    /**
     * Insert a new student record
     * @param {object} studentData - Student information
     * @returns {Promise<object>} Response from JPDB
     */
    insertRecord: async function(studentData) {
        const requestData = {
            token: this.config.connToken,
            dbName: this.config.database,
            rel: this.config.relation,
            cmd: "PUT",
            jsonStr: JSON.stringify(studentData)
        };
        
        const result = await this.executePutRequest('/api/iml', requestData);
        
        if (result.status === 200) {
            return {
                success: true,
                message: "Student record saved successfully!",
                data: result.data
            };
        } else {
            return {
                success: false,
                message: result.message || "Failed to save record. Please try again."
            };
        }
    },

    /**
     * Update an existing student record
     * @param {string} rollNo - Roll Number (Primary Key)
     * @param {object} studentData - Updated student information
     * @returns {Promise<object>} Response from JPDB
     */
    updateRecord: async function(rollNo, studentData) {
        // First, we need to get the record to find its rec_no (internal JPDB identifier)
        const checkResult = await this.checkRecordExists(rollNo);
        
        if (!checkResult.exists) {
            return {
                success: false,
                message: "Record not found for update."
            };
        }
        
        const requestData = {
            token: this.config.connToken,
            dbName: this.config.database,
            rel: this.config.relation,
            cmd: "UPDATE",
            jsonStr: JSON.stringify(studentData),
            key: rollNo.toString()
        };
        
        // Using PUT with key parameter for update by primary key
        const result = await this.executePutRequest('/api/iml', requestData);
        
        if (result.status === 200) {
            return {
                success: true,
                message: "Student record updated successfully!",
                data: result.data
            };
        } else {
            return {
                success: false,
                message: result.message || "Failed to update record. Please try again."
            };
        }
    },

    /**
     * Validate connection to JsonPowerDB
     * @returns {Promise<boolean>} True if connection is valid
     */
    testConnection: async function() {
        try {
            const requestData = {
                token: this.config.connToken,
                dbName: this.config.database,
                rel: this.config.relation,
                cmd: "GET_ALL"
            };
            
            const result = await this.executeGetRequest(
                `/api/irl?cmd=${requestData.cmd}&dbName=${requestData.dbName}&rel=${requestData.rel}&token=${requestData.token}`
            );
            
            return result.status !== 401; // 401 means unauthorized
        } catch (error) {
            console.error('Connection Test Error:', error);
            return false;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JPDB;
}
