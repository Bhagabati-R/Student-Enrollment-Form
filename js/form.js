/**
 * Student Enrollment Form Handler
 * 
 * This module handles all form interactions and validations.
 * It follows the exact workflow specified in the requirements.
 */

// DOM Elements
const elements = {
    form: document.getElementById('enrollmentForm'),
    rollNo: document.getElementById('rollNo'),
    fullName: document.getElementById('fullName'),
    className: document.getElementById('className'),
    birthDate: document.getElementById('birthDate'),
    address: document.getElementById('address'),
    enrollmentDate: document.getElementById('enrollmentDate'),
    saveBtn: document.getElementById('saveBtn'),
    updateBtn: document.getElementById('updateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    message: document.getElementById('message'),
    loading: document.getElementById('loading')
};

// Form State
let formState = {
    isNewRecord: true,
    isLoading: false
};

/**
 * Initialize the form on page load
 */
function initializeForm() {
    // Reset all fields
    clearAllFields();
    
    // Disable all fields except Roll-No
    disableAllFields();
    elements.rollNo.disabled = false;
    
    // Disable all buttons
    disableAllButtons();
    
    // Focus on Roll-No
    elements.rollNo.focus();
    
    // Add event listeners
    addEventListeners();
}

/**
 * Add event listeners to form elements
 */
function addEventListeners() {
    // Roll-No input change handler
    elements.rollNo.addEventListener('change', handleRollNoChange);
    elements.rollNo.addEventListener('blur', handleRollNoChange);
    
    // Button click handlers
    elements.saveBtn.addEventListener('click', handleSave);
    elements.updateBtn.addEventListener('click', handleUpdate);
    elements.resetBtn.addEventListener('click', handleReset);
    
    // Form submission prevention
    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        return false;
    });
}

/**
 * Handle Roll Number change - Check if record exists
 */
async function handleRollNoChange() {
    const rollNo = elements.rollNo.value.trim();
    
    // Clear previous messages
    hideMessage();
    
    // Validate Roll-No is not empty
    if (!rollNo) {
        // Reset to initial state if Roll-No is cleared
        clearAllFields();
        disableAllFields();
        elements.rollNo.disabled = false;
        disableAllButtons();
        return;
    }
    
    // Validate Roll-No is a positive number
    if (parseInt(rollNo) <= 0) {
        showMessage('Please enter a valid Roll Number (positive integer).', 'error');
        elements.rollNo.focus();
        return;
    }
    
    // Show loading indicator
    showLoading(true);
    
    try {
        // Check if record exists in database
        const result = await JPDB.checkRecordExists(rollNo);
        
        showLoading(false);
        
        if (result.exists) {
            // Case 2: Roll-No already exists - Populate existing record
            formState.isNewRecord = false;
            populateFields(result.record);
            
            // Disable Roll-No field (primary key cannot be changed)
            elements.rollNo.disabled = true;
            
            // Enable other fields for editing
            enableAllFields();
            
            // Enable Update and Reset buttons, disable Save
            elements.saveBtn.disabled = true;
            elements.updateBtn.disabled = false;
            elements.resetBtn.disabled = false;
            
            // Move cursor to Full-Name
            elements.fullName.focus();
            
            showMessage('Record found! You can update the details.', 'info');
        } else {
            // Case 1: Roll-No does not exist - Enable form for new entry
            formState.isNewRecord = true;
            
            // Clear other fields but keep Roll-No
            clearOtherFields();
            
            // Enable all other fields
            enableAllFields();
            
            // Enable Save and Reset buttons, disable Update
            elements.saveBtn.disabled = false;
            elements.updateBtn.disabled = true;
            elements.resetBtn.disabled = false;
            
            // Move cursor to Full-Name
            elements.fullName.focus();
            
            showMessage('New Roll Number! Please enter student details.', 'info');
        }
    } catch (error) {
        showLoading(false);
        showMessage('Database connection error. Please check if JsonPowerDB is running.', 'error');
        console.error('Database Error:', error);
    }
}

/**
 * Handle Save button click
 */
async function handleSave() {
    // Validate all fields
    const validationResult = validateAllFields();
    
    if (!validationResult.isValid) {
        showMessage(validationResult.message, 'error');
        return;
    }
    
    // Collect form data
    const studentData = collectFormData();
    
    // Show loading indicator
    showLoading(true);
    
    try {
        // Insert record into database
        const result = await JPDB.insertRecord(studentData);
        
        showLoading(false);
        
        if (result.success) {
            showMessage(result.message, 'success');
            
            // Reset form to initial state after successful save
            setTimeout(() => {
                handleReset();
            }, 1500);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showLoading(false);
        showMessage('Failed to save record. Please try again.', 'error');
        console.error('Save Error:', error);
    }
}

/**
 * Handle Update button click
 */
async function handleUpdate() {
    // Validate all fields
    const validationResult = validateAllFields();
    
    if (!validationResult.isValid) {
        showMessage(validationResult.message, 'error');
        return;
    }
    
    // Collect form data
    const studentData = collectFormData();
    const rollNo = elements.rollNo.value.trim();
    
    // Show loading indicator
    showLoading(true);
    
    try {
        // Update record in database
        const result = await JPDB.updateRecord(rollNo, studentData);
        
        showLoading(false);
        
        if (result.success) {
            showMessage(result.message, 'success');
            
            // Reset form to initial state after successful update
            setTimeout(() => {
                handleReset();
            }, 1500);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showLoading(false);
        showMessage('Failed to update record. Please try again.', 'error');
        console.error('Update Error:', error);
    }
}

/**
 * Handle Reset button click
 */
function handleReset() {
    // Clear all input fields
    clearAllFields();
    
    // Disable all fields except Roll-No
    disableAllFields();
    elements.rollNo.disabled = false;
    
    // Disable all buttons
    disableAllButtons();
    
    // Hide any messages
    hideMessage();
    
    // Reset form state
    formState.isNewRecord = true;
    
    // Move cursor back to Roll-No
    elements.rollNo.focus();
}

/**
 * Validate all form fields
 * @returns {object} Validation result with isValid flag and message
 */
function validateAllFields() {
    const rollNo = elements.rollNo.value.trim();
    const fullName = elements.fullName.value.trim();
    const className = elements.className.value.trim();
    const birthDate = elements.birthDate.value;
    const address = elements.address.value.trim();
    const enrollmentDate = elements.enrollmentDate.value;
    
    if (!rollNo) {
        return { isValid: false, message: 'Roll Number is required.' };
    }
    
    if (!fullName) {
        return { isValid: false, message: 'Full Name is required.' };
    }
    
    if (!className) {
        return { isValid: false, message: 'Class is required.' };
    }
    
    if (!birthDate) {
        return { isValid: false, message: 'Birth Date is required.' };
    }
    
    if (!address) {
        return { isValid: false, message: 'Address is required.' };
    }
    
    if (!enrollmentDate) {
        return { isValid: false, message: 'Enrollment Date is required.' };
    }
    
    // Validate Roll-No is a positive number
    if (parseInt(rollNo) <= 0) {
        return { isValid: false, message: 'Roll Number must be a positive integer.' };
    }
    
    // Validate Full Name (at least 2 characters)
    if (fullName.length < 2) {
        return { isValid: false, message: 'Full Name must be at least 2 characters long.' };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Collect form data into an object
 * @returns {object} Student data object
 */
function collectFormData() {
    return {
        'Roll-No': elements.rollNo.value.trim(),
        'Full-Name': elements.fullName.value.trim(),
        'Class': elements.className.value.trim(),
        'Birth-Date': elements.birthDate.value,
        'Address': elements.address.value.trim(),
        'Enrollment-Date': elements.enrollmentDate.value
    };
}

/**
 * Populate form fields with existing record data
 * @param {object} record - Student record from database
 */
function populateFields(record) {
    elements.fullName.value = record['Full-Name'] || '';
    elements.className.value = record['Class'] || '';
    elements.birthDate.value = record['Birth-Date'] || '';
    elements.address.value = record['Address'] || '';
    elements.enrollmentDate.value = record['Enrollment-Date'] || '';
}

/**
 * Clear all form fields
 */
function clearAllFields() {
    elements.rollNo.value = '';
    elements.fullName.value = '';
    elements.className.value = '';
    elements.birthDate.value = '';
    elements.address.value = '';
    elements.enrollmentDate.value = '';
}

/**
 * Clear all fields except Roll-No
 */
function clearOtherFields() {
    elements.fullName.value = '';
    elements.className.value = '';
    elements.birthDate.value = '';
    elements.address.value = '';
    elements.enrollmentDate.value = '';
}

/**
 * Enable all input fields
 */
function enableAllFields() {
    elements.fullName.disabled = false;
    elements.className.disabled = false;
    elements.birthDate.disabled = false;
    elements.address.disabled = false;
    elements.enrollmentDate.disabled = false;
}

/**
 * Disable all input fields
 */
function disableAllFields() {
    elements.rollNo.disabled = true;
    elements.fullName.disabled = true;
    elements.className.disabled = true;
    elements.birthDate.disabled = true;
    elements.address.disabled = true;
    elements.enrollmentDate.disabled = true;
}

/**
 * Disable all buttons
 */
function disableAllButtons() {
    elements.saveBtn.disabled = true;
    elements.updateBtn.disabled = true;
    elements.resetBtn.disabled = true;
}

/**
 * Show message to user
 * @param {string} text - Message text
 * @param {string} type - Message type (success, error, info)
 */
function showMessage(text, type = 'info') {
    elements.message.textContent = text;
    elements.message.className = `message ${type}`;
}

/**
 * Hide message
 */
function hideMessage() {
    elements.message.textContent = '';
    elements.message.className = 'message';
}

/**
 * Show/Hide loading indicator
 * @param {boolean} show - Whether to show loading
 */
function showLoading(show) {
    formState.isLoading = show;
    if (show) {
        elements.loading.classList.add('show');
    } else {
        elements.loading.classList.remove('show');
    }
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeForm);
