document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('booking-form');
    const formSections = form.querySelectorAll('.form-section:not(.payment-section)');
    let isFormValid = false;

    // Add validation classes to inputs
    formSections.forEach(section => {
        const inputs = section.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearError);
            input.addEventListener('input', checkFormValidity);
        });
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Always prevent default first
        
        // Validate all fields before submission
        let allValid = true;
        let firstInvalidField = null;

        formSections.forEach(section => {
            const inputs = section.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!validateInput({ target: input })) {
                    allValid = false;
                    if (!firstInvalidField) {
                        firstInvalidField = input;
                    }
                }
            });
        });

        if (!allValid) {
            // Scroll to the first invalid field
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }
            alert('Please fill in all the required details correctly before submitting.');
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const bookingData = {};
        
        for (let [key, value] of formData.entries()) {
            bookingData[key] = value;
        }

        // Store booking data in sessionStorage
        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

        // If all validations pass, show success message and redirect to payment page
        alert('Form submitted successfully!');
        window.location.href = 'payment.html';
    });

    // Check if all required fields are valid
    function checkFormValidity() {
        let allValid = true;
        formSections.forEach(section => {
            const inputs = section.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!validateInput({ target: input })) {
                    allValid = false;
                }
            });
        });
        isFormValid = allValid;
    }

    // Input validation function
    function validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove any existing error messages
        clearError({ target: input });

        // Skip validation for payment section fields
        if (input.closest('.payment-section')) {
            return true;
        }

        // Validation rules
        switch(input.id) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    errorMessage = 'This field is required';
                    isValid = false;
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    errorMessage = 'Only letters and spaces allowed';
                    isValid = false;
                }
                break;
            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMessage = 'Please enter a valid email';
                    isValid = false;
                }
                break;
            case 'phone':
                if (!value) {
                    errorMessage = 'Phone number is required';
                    isValid = false;
                } else if (!/^[0-9+\-\s()]{10,}$/.test(value)) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
                break;
            case 'destination':
            case 'package':
                if (!value) {
                    errorMessage = 'Please select an option';
                    isValid = false;
                }
                break;
            case 'startDate':
            case 'endDate':
                if (!value) {
                    errorMessage = 'Please select a date';
                    isValid = false;
                } else if (input.id === 'endDate') {
                    const startDate = new Date(document.getElementById('startDate').value);
                    const endDate = new Date(value);
                    if (endDate <= startDate) {
                        errorMessage = 'End date must be at least one day after start date';
                        isValid = false;
                    }
                }
                break;
            case 'travelers':
                if (!value) {
                    errorMessage = 'Please enter number of travelers';
                    isValid = false;
                } else if (value < 1 || value > 10) {
                    errorMessage = 'Number of travelers must be between 1 and 10';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            showError(input, errorMessage);
        } else {
            input.classList.add('valid');
        }

        return isValid;
    }

    // Show error message
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
        input.classList.add('error');
        input.classList.remove('valid');
    }

    // Clear error message
    function clearError(e) {
        const input = e.target;
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        if (errorMessage) {
            errorMessage.remove();
        }
        
        input.classList.remove('error');
    }
}); 