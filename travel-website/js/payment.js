document.addEventListener('DOMContentLoaded', () => {
    // Get booking data from session storage
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData'));
    
    // Check if booking data exists and is complete
    if (!bookingData || !isBookingDataComplete(bookingData)) {
        alert('Please complete the booking form first.');
        window.location.href = 'booking.html';
        return;
    }

    // Display booking details
    const bookingDetails = document.getElementById('booking-details');
    const totalAmount = document.getElementById('total-amount');
    
    // Calculate total amount based on package and number of travelers
    const packagePrices = {
        'basic': 100000,    // ₹1,00,000
        'premium': 150000,  // ₹1,50,000
        'luxury': 200000    // ₹2,00,000
    };

    const basePrice = packagePrices[bookingData.package] || 100000;
    const totalPrice = basePrice * parseInt(bookingData.travelers);

    // Populate booking details
    bookingDetails.innerHTML = `
        <div class="booking-detail">
            <h3>Traveler Information</h3>
            <p><strong>Name:</strong> ${bookingData.firstName} ${bookingData.lastName}</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Phone:</strong> ${bookingData.phone}</p>
        </div>
        <div class="booking-detail">
            <h3>Trip Details</h3>
            <p><strong>Destination:</strong> ${bookingData.destination}</p>
            <p><strong>Package:</strong> ${bookingData.package}</p>
            <p><strong>Dates:</strong> ${bookingData.startDate} to ${bookingData.endDate}</p>
            <p><strong>Travelers:</strong> ${bookingData.travelers}</p>
        </div>
    `;

    // Display total amount in rupees with proper formatting
    totalAmount.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

    // Populate payment form with card details
    document.getElementById('confirm-card-number').value = bookingData.cardNumber;
    document.getElementById('confirm-expiry').value = bookingData.expiryDate;
    document.getElementById('confirm-cvv').value = bookingData.cvv;

    // Handle payment confirmation
    const confirmPaymentBtn = document.getElementById('confirm-payment');
    const paymentSuccessModal = document.getElementById('payment-success');
    const bookingRef = document.getElementById('booking-ref');

    confirmPaymentBtn.addEventListener('click', () => {
        // Validate payment details before processing
        if (!validatePaymentDetails()) {
            return;
        }

        // Simulate payment processing
        const processingTime = 2000; // 2 seconds
        confirmPaymentBtn.disabled = true;
        confirmPaymentBtn.textContent = 'Processing...';

        setTimeout(() => {
            // Generate booking reference
            const ref = 'WL' + Math.random().toString(36).substr(2, 8).toUpperCase();
            bookingRef.textContent = ref;

            // Show success modal
            paymentSuccessModal.style.display = 'block';

            // Clear session storage
            sessionStorage.removeItem('bookingData');

            // Handle return to home button
            document.getElementById('return-home').addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }, processingTime);
    });

    // Add error handling for payment processing
    window.addEventListener('error', (event) => {
        console.error('Payment processing error:', event.error);
        alert('An error occurred during payment processing. Please try again.');
        confirmPaymentBtn.disabled = false;
        confirmPaymentBtn.textContent = 'Confirm Payment';
    });

    // Function to check if booking data is complete
    function isBookingDataComplete(data) {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone',
            'destination', 'package', 'startDate', 'endDate',
            'travelers'
        ];

        return requiredFields.every(field => 
            data[field] && data[field].toString().trim() !== ''
        );
    }

    // Function to validate payment details
    function validatePaymentDetails() {
        const cardNumber = document.getElementById('confirm-card-number').value.trim();
        const expiryDate = document.getElementById('confirm-expiry').value.trim();
        const cvv = document.getElementById('confirm-cvv').value.trim();

        if (!cardNumber || !expiryDate || !cvv) {
            alert('Please fill in all payment details.');
            return false;
        }

        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            alert('Please enter a valid 16-digit card number.');
            return false;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            alert('Please enter a valid expiry date (MM/YY).');
            return false;
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            alert('Please enter a valid CVV (3 or 4 digits).');
            return false;
        }

        return true;
    }
}); 