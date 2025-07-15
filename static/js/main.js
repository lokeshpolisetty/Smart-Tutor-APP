// Main JavaScript for SmartTutor

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading state to buttons on form submit
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        button.closest('form').addEventListener('submit', function() {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
        });
    });

    // Auto-scroll chat to bottom on load
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // If messages are dynamically added, you may want to observe and scroll:
    const observer = new MutationObserver(function() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });
    if (chatMessages) {
        observer.observe(chatMessages, { childList: true, subtree: true });
    }

    // New Chat button handler
    const newChatBtn = document.getElementById('newChatBtn');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', function() {
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.innerHTML = `
                    <div class="welcome-message text-center py-5">
                        <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                            <i class="fas fa-robot text-primary fs-1"></i>
                        </div>
                        <h4>Welcome to AI Tutor!</h4>
                        <p class="text-muted">I'm here to help you learn. Ask me anything about:</p>
                        <div class="row g-2 mt-3 justify-content-center">
                            <div class="col-6 col-md-3">
                                <div class="bg-light rounded p-2 small text-center">
                                    <i class="fas fa-calculator text-primary me-1"></i>Mathematics
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="bg-light rounded p-2 small text-center">
                                    <i class="fas fa-flask text-success me-1"></i>Science
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="bg-light rounded p-2 small text-center">
                                    <i class="fas fa-book text-warning me-1"></i>Literature
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="bg-light rounded p-2 small text-center">
                                    <i class="fas fa-laptop-code text-info me-1"></i>Programming
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                chatMessages.scrollTop = 0;
            }
        });
    }
});

// Utility functions
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toast = createToast(message, type);
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '1055';
    document.body.appendChild(container);
    return container;
}

function createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="toast-header">
            <i class="fas fa-${type === 'success' ? 'check-circle text-success' : 'exclamation-triangle text-warning'} me-2"></i>
            <strong class="me-auto">SmartTutor</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    return toast;
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('input[name="search"]');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                // Auto-submit search form after 500ms of no typing
                this.closest('form').submit();
            }, 500);
        });
    }
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', initializeSearch);

// Rating system
function setRating(rating, sessionId) {
    // This would typically send an AJAX request to update the rating
    console.log(`Setting rating ${rating} for session ${sessionId}`);
    
    // Update UI
    const stars = document.querySelectorAll(`[data-session="${sessionId}"] .rating-star`);
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
    
    showToast('Rating submitted successfully!');
}

// Price calculator for booking
function calculateSessionPrice(hourlyRate, duration) {
    return (hourlyRate * duration / 60).toFixed(2);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Confirmation dialogs
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Loading overlay
function showLoading() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '9999';
    overlay.innerHTML = '<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>';
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}