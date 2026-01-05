// Package Data - All working properly
const packages = [
    {
        id: 1,
        name: "Bali Paradise",
        category: "luxury",
        basePrice: 999,
        image: "https://images.unsplash.com/photo-1516496636080-14fb876e029d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
        rating: 4.8,
        description: "All-inclusive tropical getaway"
    },
    {
        id: 2,
        name: "Santorini Escape",
        category: "luxury",
        basePrice: 1299,
        image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
        rating: 4.9,
        description: "Romantic Greek island holiday"
    },
    {
        id: 3,
        name: "Maldives Luxury",
        category: "luxury",
        basePrice: 2199,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
        rating: 4.7,
        description: "Overwater bungalow experience"
    },
    {
        id: 4,
        name: "Thai Adventure",
        category: "adventure",
        basePrice: 699,
        image: "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
        rating: 4.5,
        description: "Explore Thailand's best spots"
    },
    {
        id: 5,
        name: "Family Spain",
        category: "family",
        basePrice: 899,
        image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
        rating: 4.6,
        description: "Perfect for family fun"
    },
    {
        id: 6,
        name: "Budget Portugal",
        category: "budget",
        basePrice: 499,
        image: "https://travelwandergrow.com/wp-content/uploads/2023/10/Historical-Sites-in-Portugal-scaled.jpeg",
        rating: 4.3,
        description: "Affordable European escape"
    }
];


// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
    
    // Load Packages on Home Page
    if (document.querySelector('.packages-grid')) {
        loadPackages('all');
        setupFilterButtons();
    }
    
    // Package Page Functionality
    if (document.querySelector('.package-content')) {
        setupPackagePage();
    }
    
    // Booking Page Functionality
    if (document.querySelector('.booking-container')) {
        setupBookingPage();
    }
});

// Load and Filter Packages - FIXED
function loadPackages(filter = 'all') {
    const grid = document.querySelector('.packages-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const filteredPackages = filter === 'all' 
        ? packages 
        : packages.filter(p => p.category === filter);
    
    if (filteredPackages.length === 0) {
        grid.innerHTML = '<p class="no-packages">No packages found in this category.</p>';
        return;
    }
    
    filteredPackages.forEach(pkg => {
        const card = createPackageCard(pkg);
        grid.appendChild(card);
    });
}

function createPackageCard(pkg) {
    const div = document.createElement('div');
    div.className = 'package-card';
    div.innerHTML = `
        <img src="${pkg.image}" alt="${pkg.name}" loading="lazy">
        <div class="package-info">
            <div class="package-header">
                <h3>${pkg.name}</h3>
                <div class="package-price">From £${pkg.basePrice}</div>
            </div>
            <p class="package-description">${pkg.description}</p>
            <div class="package-meta">
                <span><i class="fas fa-star"></i> ${pkg.rating}/5</span>
                <span class="package-category ${pkg.category}">${pkg.category}</span>
            </div>
            <a href="package.html?id=${pkg.id}" class="btn-view">View Details</a>
        </div>
    `;
    return div;
}

function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            loadPackages(filter);
        });
    });
}

// Package Page Functionality
function setupPackagePage() {
    // Image Gallery
    const thumbnails = document.querySelectorAll('.thumbnails img');
    const mainImage = document.getElementById('main-image');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const newSrc = thumb.dataset.large;
            mainImage.src = newSrc;
            mainImage.alt = thumb.alt;
            
            thumbnails.forEach(t => t.style.borderColor = 'transparent');
            thumb.style.borderColor = '#0077cc';
        });
    });
    
    // Dynamic Pricing Calculator - FIXED
    setupPriceCalculator();
}

function setupPriceCalculator() {
    const durationSelect = document.getElementById('duration');
    const adultCount = document.getElementById('adult-count');
    const childCount = document.getElementById('child-count');
    
    // Get all counter buttons
    const adultDecrease = document.querySelector('[data-type="adult"][data-action="decrease"]');
    const adultIncrease = document.querySelector('[data-type="adult"][data-action="increase"]');
    const childDecrease = document.querySelector('[data-type="child"][data-action="decrease"]');
    const childIncrease = document.querySelector('[data-type="child"][data-action="increase"]');
    
    // Base prices for different durations
    const basePrices = { 7: 999, 10: 1299, 14: 1599 };
    
    // Function to update all prices
    function updatePrice() {
        const duration = parseInt(durationSelect.value) || 7;
        const adults = parseInt(adultCount.textContent) || 2;
        const children = parseInt(childCount.textContent) || 0;
        
        const adultPrice = basePrices[duration] * adults;
        const childPrice = Math.round((basePrices[duration] * 0.7) * children); // 30% off for children
        const baseTotal = adultPrice + childPrice;
        const taxes = Math.round((baseTotal * 0.1) + 100); // 10% + $100 fixed fees
        const total = baseTotal + taxes;
        
        // Update display on package page
        const basePriceEl = document.getElementById('base-price');
        const taxesEl = document.getElementById('taxes');
        const totalPriceEl = document.getElementById('total-price');
        
        if (basePriceEl) basePriceEl.textContent = `£${baseTotal}`;
        if (taxesEl) taxesEl.textContent = `£${taxes}`;
        if (totalPriceEl) totalPriceEl.textContent = `£${total}`;
        
        // Update duration options to show correct prices
        updateDurationOptions(duration);
    }
    
    function updateDurationOptions(selectedDuration) {
        const options = durationSelect.querySelectorAll('option');
        options.forEach(option => {
            const nights = parseInt(option.value);
            const price = basePrices[nights];
            option.textContent = `${nights} Nights (£${price})`;
            if (nights === selectedDuration) {
                option.selected = true;
            }
        });
    }
    
    // Event Listeners for counters
    adultDecrease?.addEventListener('click', () => {
        let count = parseInt(adultCount.textContent);
        if (count > 1) {
            adultCount.textContent = count - 1;
            updatePrice();
        }
    });
    
    adultIncrease?.addEventListener('click', () => {
        let count = parseInt(adultCount.textContent);
        adultCount.textContent = count + 1;
        updatePrice();
    });
    
    childDecrease?.addEventListener('click', () => {
        let count = parseInt(childCount.textContent);
        if (count > 0) {
            childCount.textContent = count - 1;
            updatePrice();
        }
    });
    
    childIncrease?.addEventListener('click', () => {
        let count = parseInt(childCount.textContent);
        childCount.textContent = count + 1;
        updatePrice();
    });
    
    // Event listener for duration change
    durationSelect?.addEventListener('change', updatePrice);
    
    // Initial price calculation
    updatePrice();
}

// Booking Page Functionality - FIXED with proper validation
function setupBookingPage() {
    // Step Navigation with Validation
    const nextButtons = document.querySelectorAll('.btn-next');
    const backButtons = document.querySelectorAll('.btn-back');
    
    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = btn.dataset.next;
            const currentStep = btn.closest('.booking-step').id;
            
            if (validateStep(currentStep)) {
                navigateToStep(nextStep);
            }
        });
    });
    
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = btn.dataset.back;
            navigateToStep(prevStep);
        });
    });
    
    // Phone number validation - numbers only
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        phoneInput.addEventListener('blur', function() {
            if (this.value && !/^\d{10,15}$/.test(this.value)) {
                showError(this, 'Phone number must be 10-15 digits');
            } else {
                clearError(this);
            }
        });
    }
    
    // Confirm Booking Button
    const confirmBtn = document.getElementById('confirm-booking');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', processBooking);
    }
    
    // Update sidebar prices
    updateBookingSidebar();
}

function navigateToStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show requested step
    const step = document.getElementById(stepId);
    if (step) {
        step.style.display = 'block';
        
        // Update step indicator
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        const stepNumber = stepId.replace('step', '');
        const stepIndicator = document.querySelector(`.step:nth-child(${stepNumber})`);
        if (stepIndicator) {
            stepIndicator.classList.add('active');
        }
    }
}

// Step Validation - FIXED: All fields must be filled
function validateStep(stepId) {
    let isValid = true;
    const step = document.getElementById(stepId);
    
    if (!step) return false;
    
    // Clear previous errors
    step.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    step.querySelectorAll('.error-message').forEach(el => el.remove());
    
    if (stepId === 'step1') {
        // Validate Traveler Details
        const fullName = document.getElementById('full-name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        
        const requiredFields = [fullName, email, phone];
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            }
        });
        
        // Email validation
        if (email.value && !isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        }
        
        // Phone validation
        if (phone.value && !/^\d{10,15}$/.test(phone.value)) {
            showError(phone, 'Phone number must be 10-15 digits');
            isValid = false;
        }
        
    } else if (stepId === 'step2') {
        // Validate Payment Details
        const cardNumber = document.getElementById('card-number');
        const expiry = document.getElementById('expiry');
        const cvv = document.getElementById('cvv');
        const cardName = document.getElementById('card-name');
        
        const requiredFields = [cardNumber, expiry, cvv, cardName];
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            }
        });
        
        // Card number validation (16 digits, spaces allowed)
        if (cardNumber.value) {
            const cleanCard = cardNumber.value.replace(/\s/g, '');
            if (!/^\d{16}$/.test(cleanCard)) {
                showError(cardNumber, 'Card number must be 16 digits');
                isValid = false;
            }
        }
        
        // Expiry date validation (MM/YY)
        if (expiry.value && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.value)) {
            showError(expiry, 'Please enter in MM/YY format');
            isValid = false;
        }
        
        // CVV validation (3-4 digits)
        if (cvv.value && !/^\d{3,4}$/.test(cvv.value)) {
            showError(cvv, 'CVV must be 3-4 digits');
            isValid = false;
        }
        
    } else if (stepId === 'step3') {
        // Validate Terms & Conditions
        const termsCheckbox = document.getElementById('terms');
        
        if (!termsCheckbox.checked) {
            showError(termsCheckbox, 'You must agree to the Terms & Conditions');
            isValid = false;
        }
    }
    
    return isValid;
}

function showError(field, message) {
    field.classList.add('error');
    
    // Create error message element
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    errorMsg.style.color = '#dc3545';
    errorMsg.style.fontSize = '0.85rem';
    errorMsg.style.marginTop = '5px';
    
    // Insert error message after the field
    field.parentNode.appendChild(errorMsg);
}

function clearError(field) {
    field.classList.remove('error');
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function updateBookingSidebar() {
    // Calculate prices dynamically
    const adults = 2; // Default
    const children = 0; // Default
    const basePricePerPerson = 999;
    const nights = 7;
    
    const adultTotal = basePricePerPerson * adults;
    const childTotal = Math.round((basePricePerPerson * 0.7) * children);
    const baseTotal = adultTotal + childTotal;
    const taxes = Math.round((baseTotal * 0.1) + 100);
    const total = baseTotal + taxes;
    
    // Update sidebar
    const baseEl = document.getElementById('sidebar-base');
    const taxesEl = document.getElementById('sidebar-taxes');
    const totalEl = document.getElementById('sidebar-total');
    
    if (baseEl) baseEl.textContent = `£${baseTotal}.00`;
    if (taxesEl) taxesEl.textContent = `£${taxes}.00`;
    if (totalEl) totalEl.textContent = `£${total}.00`;
    
    // Update summary in step 3
    const summaryPackage = document.getElementById('summary-package');
    const summaryTravelers = document.getElementById('summary-travelers');
    const summaryTotal = document.getElementById('summary-total');
    
    if (summaryPackage) summaryPackage.textContent = `Bali Paradise (${nights} Nights)`;
    if (summaryTravelers) {
        let travelerText = `${adults} Adult${adults !== 1 ? 's' : ''}`;
        if (children > 0) travelerText += `, ${children} Child${children !== 1 ? 'ren' : ''}`;
        summaryTravelers.textContent = travelerText;
    }
    if (summaryTotal) summaryTotal.textContent = `£${total}.00`;
}

function processBooking() {
    // Validate step 3 first
    if (!validateStep('step3')) {
        return;
    }
    
    // Show loading state
    const confirmBtn = document.getElementById('confirm-booking');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    confirmBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate random booking reference
        const bookingRef = Math.floor(10000 + Math.random() * 90000);
        const bookingRefElement = document.getElementById('booking-ref');
        if (bookingRefElement) {
            bookingRefElement.textContent = bookingRef;
        }
        
        // Show success message
        document.querySelectorAll('.booking-step').forEach(step => {
            step.style.display = 'none';
        });
        
        const successMsg = document.getElementById('success-message');
        if (successMsg) {
            successMsg.style.display = 'block';
        }
        
        // Reset button
        confirmBtn.innerHTML = originalText;
        confirmBtn.disabled = false;
        
        // Update URL without reloading
        history.pushState({}, '', 'booking.html?confirmed=true');
        
        // Send confirmation email (simulated)
        console.log('Confirmation email sent for booking HLD-' + bookingRef);
    }, 2000);
}