// Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Dark Mode Toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
    }
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form Validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// Add fade-in animation to elements
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
        }
    });
};

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Set initial opacity for fade-in elements
    document.querySelectorAll('.fade-in').forEach(element => {
        element.style.opacity = '0';
    });
    
    // Add scroll event listener for animations
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});

// Store booking information
function storeBookingInfo(info) {
    sessionStorage.setItem('bookingInfo', JSON.stringify(info));
}

// Retrieve booking information
function getBookingInfo() {
    const info = sessionStorage.getItem('bookingInfo');
    return info ? JSON.parse(info) : null;
}

// Clear booking information
function clearBookingInfo() {
    sessionStorage.removeItem('bookingInfo');
}

// Handle form submissions
document.addEventListener('submit', (e) => {
    if (e.target.matches('form')) {
        e.preventDefault();
        
        if (validateForm(e.target)) {
            const formData = new FormData(e.target);
            const formObject = {};
            
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            if (e.target.id === 'booking-form') {
                storeBookingInfo(formObject);
                window.location.href = 'payment.html';
            } else {
                // Handle other form submissions
                console.log('Form submitted:', formObject);
                e.target.reset();
                alert('Thank you for your submission!');
            }
        }
    }
}); 