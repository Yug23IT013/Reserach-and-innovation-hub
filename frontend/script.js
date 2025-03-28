// Main initialization
document.addEventListener("DOMContentLoaded", function() {
    const currentPage = window.location.pathname;
    
    // Initialize based on current page
    if (currentPage.includes('dashboard.html')) {
        initDashboard();
    } else if (currentPage.includes('login.html')) {
        initLogin();
    } else if (currentPage.includes('register.html')) {
        initRegister();
    }
});

// Login Page Initialization
function initLogin() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }
}

// Register Page Initialization
function initRegister() {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }
}

// Login Form Handler
async function handleLogin(event) {
            event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                
        if (response.ok) {
            // Store the token
            localStorage.setItem('token', data.token);
            // Store user role
            localStorage.setItem('userRole', data.role);
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Login failed. Please check your credentials.');
        }
            } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    }
}

// Register Form Handler
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Validate password length
    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }

    try {
        const response = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: username,
                email,
                password,
                role
            })
                });

                const data = await response.json();
                
        if (response.status === 201 || response.status === 200) {
            window.location.href = 'login.html';
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert(error.message || 'An error occurred during registration');
    }
}

// Authentication check
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    return token;
}

// Parse JWT token
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

// Dashboard Initialization
function initDashboard() {
    const token = checkAuth();
    if (!token) return;

    const userInfo = parseJwt(token);
    if (!userInfo) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
    }

    // Update user info display
    document.getElementById('userInfo').textContent = `Welcome, ${userInfo.role}`;
    showSectionsBasedOnRole(userInfo.role);
    fetchDashboardData();
}

// Show/hide sections based on role
function showSectionsBasedOnRole(role) {
    const researchSection = document.getElementById('researchSection');
    const startupsSection = document.getElementById('startupsSection');
    const iprSection = document.getElementById('iprSection');
    const addStartupButton = document.querySelector('#startupsSection .section-header button');

    // First hide all sections
    researchSection.style.display = 'none';
    startupsSection.style.display = 'none';
    iprSection.style.display = 'none';
    if (addStartupButton) addStartupButton.style.display = 'none';

    switch (role) {
        case 'Researcher':
            researchSection.style.display = 'block';
            break;
        case 'Entrepreneur':
            startupsSection.style.display = 'block';
            if (addStartupButton) addStartupButton.style.display = 'block';
            break;
        case 'Investor':
            startupsSection.style.display = 'block';
            break;
        case 'IPR Professional':
            iprSection.style.display = 'block';
            break;
        case 'Government Official':
            // Government Officials can only view research and IPR sections
            researchSection.style.display = 'block';
            iprSection.style.display = 'block';
            break;
    }
}

// Fetch dashboard data
async function fetchDashboardData() {
    const token = checkAuth();
    if (!token) return;

    try {
        const researchSection = document.getElementById('researchSection');
        const startupsSection = document.getElementById('startupsSection');
        const iprSection = document.getElementById('iprSection');

        // Fetch research projects
        if (researchSection.style.display === 'block') {
            const researchResponse = await fetch('http://localhost:5001/api/research', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (researchResponse.ok) {
                const researchData = await researchResponse.json();
                displayResearchProjects(researchData);
            }
        }

        // Fetch startups
        if (startupsSection.style.display === 'block') {
            const startupsResponse = await fetch('http://localhost:5001/api/startups', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (startupsResponse.ok) {
                const startupsData = await startupsResponse.json();
                displayStartups(startupsData);
            }
        }

        // Fetch IPR records
        if (iprSection.style.display === 'block') {
            const iprResponse = await fetch('http://localhost:5001/api/ipr', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (iprResponse.ok) {
                const iprData = await iprResponse.json();
                displayIPRRecords(iprData);
            }
        }
    } catch (error) {
        // Handle errors silently or show a user-friendly message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Unable to load data. Please refresh the page.';
        document.querySelector('.container').prepend(errorMessage);
    }
}

// Initialize Bootstrap modals
const startupModal = new bootstrap.Modal(document.getElementById('startupModal'));
const researchModal = new bootstrap.Modal(document.getElementById('researchModal'));
const iprModal = new bootstrap.Modal(document.getElementById('iprModal'));

// Modal functions
function openStartupModal() {
    startupModal.show();
}

function closeStartupModal() {
    startupModal.hide();
    document.getElementById('addStartupForm').reset();
}

function showAddResearchModal() {
    researchModal.show();
}

function closeResearchModal() {
    researchModal.hide();
    document.getElementById('addResearchForm').reset();
}

function showAddIPRModal() {
    iprModal.show();
}

function closeIPRModal() {
    iprModal.hide();
    document.getElementById('addIPRForm').reset();
}

// Display functions
function displayResearchProjects(projects) {
    const container = document.getElementById('researchProjects');
    if (!projects || projects.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="no-data">No research projects available.</div></div>';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h3 class="h5 card-title mb-0">${project.title}</h3>
                        <span class="field-badge">${project.field}</span>
                    </div>
                    <p class="card-description">${project.description}</p>
                    <div class="card-details">
                        <div class="detail-item">
                            <span class="detail-label">Status</span>
                            <span class="status-badge status-${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Researchers</span>
                            <div class="tags-container">
                                ${project.researchers.map(researcher => `
                                    <span class="tag">${researcher}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function displayStartups(startups) {
    const container = document.getElementById('startups');
    if (!startups || startups.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="no-data">No startups available.</div></div>';
        return;
    }

    container.innerHTML = startups.map(startup => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h3 class="h5 card-title mb-0">${startup.name}</h3>
                        <span class="field-badge">${startup.industry}</span>
                    </div>
                    <p class="card-description">${startup.description || 'No description available'}</p>
                    <div class="card-details">
                        <div class="detail-item">
                            <span class="detail-label">Founded</span>
                            <span class="detail-value">${new Date(startup.foundedDate).toLocaleDateString()}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Founder</span>
                            <span class="detail-value">${startup.founderName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Funding</span>
                            <span class="funding-amount">${startup.funding}</span>
                        </div>
                    </div>
                    ${startup.website ? `
                        <div class="mt-3">
                            <a href="${startup.website}" target="_blank" class="website-link">
                                <i class="fas fa-external-link-alt me-2"></i>Visit Website
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function displayIPRRecords(records) {
    const container = document.getElementById('iprRecords');
    if (!records || records.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="no-data">No IPR records available.</div></div>';
        return;
    }

    container.innerHTML = records.map(record => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h3 class="h5 card-title mb-0">${record.title}</h3>
                        <span class="type-badge">${record.type}</span>
                    </div>
                    <p class="card-description">${record.description}</p>
                    <div class="card-details">
                        <div class="detail-item">
                            <span class="detail-label">Status</span>
                            <span class="status-badge status-${record.status.toLowerCase().replace(' ', '-')}">${record.status}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Filing Date</span>
                            <span class="detail-value">${new Date(record.filingDate).toLocaleDateString()}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Inventors</span>
                            <div class="tags-container">
                                ${record.inventors.map(inventor => `
                                    <span class="tag">${inventor}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Message display function
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    messageDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.alert');
    existingMessages.forEach(msg => msg.remove());
    
    // Add the new message at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    // Remove the message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

// Handle startup form submission
async function handleStartupSubmit(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Creating...';
    
    const startupData = {
        name: document.getElementById('startupName').value,
        industry: document.getElementById('industry').value,
        funding: document.getElementById('funding').value,
        foundedDate: document.getElementById('foundedDate').value,
        founderName: document.getElementById('founderName').value,
        description: document.getElementById('description').value,
        website: document.getElementById('website').value || null
    };

    try {
        const response = await fetch('http://localhost:5001/api/startups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(startupData)
        });

        const data = await response.json();

        if (response.ok) {
            closeStartupModal();
            fetchDashboardData(); // Refresh the startup list
            showMessage('Startup created successfully!', 'success');
        } else {
            throw new Error(data.message || 'Failed to create startup');
        }
    } catch (error) {
        showMessage(error.message, 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Create Startup';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Handle research form submission
async function handleResearchSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('Please log in to create a research project', 'error');
        return;
    }

    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Creating...';

    try {
        // Get form values
        const title = document.getElementById('researchTitle').value.trim();
        const description = document.getElementById('researchDescription').value.trim();
        const field = document.getElementById('researchField').value;
        const status = document.getElementById('researchStatus').value;
        const researchers = document.getElementById('researchers').value
            .split(',')
            .map(r => r.trim())
            .filter(r => r);

        // Validate required fields
        if (!title) {
            throw new Error('Title is required');
        }
        if (!description) {
            throw new Error('Description is required');
        }
        if (!field) {
            throw new Error('Field is required');
        }
        if (!researchers.length) {
            throw new Error('At least one researcher is required');
        }

        // Create research data object
        const researchData = {
            title,
            description,
            field,
            status,
            researchers
        };

        console.log('Sending research data:', researchData);

        const response = await fetch('http://localhost:5001/api/research', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(researchData)
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (response.ok) {
            showMessage('Research project created successfully!', 'success');
            closeResearchModal();
            fetchDashboardData(); // Refresh the research list
        } else {
            throw new Error(data.message || 'Failed to create research project');
        }
    } catch (error) {
        console.error('Error creating research:', error);
        showMessage(error.message, 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Create Research Project';
    }
}

// Handle IPR form submission
async function handleIPRSubmit(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Creating...';
    
    try {
        // Get form values
        const title = document.getElementById('iprTitle').value.trim();
        const description = document.getElementById('iprDescription').value.trim();
        const type = document.getElementById('iprType').value;
        const filingDate = document.getElementById('filingDate').value;
        const inventors = document.getElementById('inventors').value
            .split(',')
            .map(i => i.trim())
            .filter(i => i);
        const status = document.getElementById('iprStatus').value;

        // Validate required fields
        if (!title || !description || !type || !filingDate || !inventors.length) {
            throw new Error('Please fill in all required fields');
        }

        // Create IPR data object
        const iprData = {
            title,
            description,
            type,
            filingDate,
            inventors,
            status
        };

        const response = await fetch('http://localhost:5001/api/ipr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(iprData)
        });

        const data = await response.json();

        if (response.ok) {
            closeIPRModal();
            fetchDashboardData(); // Refresh the IPR list
            showMessage('IPR record created successfully!', 'success');
        } else {
            throw new Error(data.message || 'Failed to create IPR record');
        }
    } catch (error) {
        showMessage(error.message, 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Create IPR Record';
    }
}

// Utility function to check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Function to get user role
function getUserRole() {
    return localStorage.getItem('userRole');
}

// Check if user is already logged in when visiting login/register pages
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    if ((currentPage.includes('login.html') || currentPage.includes('register.html')) && isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
});
