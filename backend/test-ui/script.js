class APITester {
    constructor() {
        this.baseURL = 'http://localhost:3001/api';
        this.token = localStorage.getItem('authToken');
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.checkServerStatus();
                this.setupEventListeners();
                this.updateAuthStatus();
            });
        } else {
            // DOM is already loaded
            this.checkServerStatus();
            this.setupEventListeners();
            this.updateAuthStatus();
        }
        
        // Retry server status check after a few seconds
        setTimeout(() => {
            this.checkServerStatus();
        }, 2000);
    }

    async checkServerStatus() {
        try {
            console.log('🔍 Checking server status...');
            const response = await fetch(`${this.baseURL.replace('/api', '')}/health`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });
            
            console.log('Server response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Server health data:', data);
                this.updateServerStatus(true);
                
                // Also test the API endpoint
                this.testAPIConnection();
            } else {
                console.log('Server responded with error status:', response.status);
                this.updateServerStatus(false);
            }
        } catch (error) {
            console.error('Server status check failed:', error);
            this.updateServerStatus(false);
        }
    }

    async testAPIConnection() {
        try {
            console.log('🧪 Testing API connection...');
            const response = await fetch(`${this.baseURL}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ API connection successful:', data);
            } else {
                console.log('❌ API connection failed:', response.status);
            }
        } catch (error) {
            console.error('❌ API connection test failed:', error);
        }
    }

    updateServerStatus(online) {
        const statusElement = document.getElementById('server-status');
        const statusText = statusElement.querySelector('.status-text');
        
        if (online) {
            statusElement.classList.remove('offline');
            statusText.textContent = 'Server: Online';
        } else {
            statusElement.classList.add('offline');
            statusText.textContent = 'Server: Offline';
        }
    }

    updateAuthStatus() {
        const statusElement = document.getElementById('auth-status');
        const statusText = statusElement.querySelector('.status-text');
        
        if (this.token) {
            statusText.textContent = 'Auth: Logged in';
            statusElement.classList.remove('offline');
        } else {
            statusText.textContent = 'Auth: Not logged in';
            statusElement.classList.add('offline');
        }
    }

    setupEventListeners() {
        // Authentication forms
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Profile forms
        document.getElementById('create-profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createProfile();
        });

        document.getElementById('upload-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.uploadImage();
        });

        // Buttons
        document.getElementById('get-user-btn').addEventListener('click', () => this.getCurrentUser());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.getElementById('get-profile-btn').addEventListener('click', () => this.getProfile());
        document.getElementById('update-profile-btn').addEventListener('click', () => this.updateProfile());
        document.getElementById('delete-profile-btn').addEventListener('click', () => this.deleteProfile());
        document.getElementById('search-btn').addEventListener('click', () => this.searchProfiles());
        document.getElementById('clear-response').addEventListener('click', () => this.clearResponse());
        document.getElementById('refresh-server-status').addEventListener('click', () => this.checkServerStatus());
    }

    async makeRequest(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();
            
            this.logResponse({
                url,
                method: options.method || 'GET',
                status: response.status,
                data
            });

            return { response, data };
        } catch (error) {
            this.logResponse({
                url,
                method: options.method || 'GET',
                error: error.message
            });
            throw error;
        }
    }

    logResponse(info) {
        const responseArea = document.getElementById('response-area');
        const timestamp = new Date().toLocaleTimeString();
        
        let logText = `[${timestamp}] ${info.method} ${info.url}\n`;
        
        if (info.status) {
            logText += `Status: ${info.status}\n`;
        }
        
        if (info.error) {
            logText += `Error: ${info.error}\n`;
        } else {
            logText += `Response: ${JSON.stringify(info.data, null, 2)}\n`;
        }
        
        logText += '\n' + '='.repeat(50) + '\n\n';
        
        responseArea.textContent = logText + responseArea.textContent;
    }

    clearResponse() {
        document.getElementById('response-area').textContent = 'No requests made yet...';
    }

    // Authentication methods
    async register() {
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        const { response, data } = await this.makeRequest(`${this.baseURL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            this.token = data.token;
            localStorage.setItem('authToken', this.token);
            this.updateAuthStatus();
            this.showSuccess('Registration successful!');
        } else {
            this.showError(data.message || 'Registration failed');
        }
    }

    async login() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const { response, data } = await this.makeRequest(`${this.baseURL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            this.token = data.token;
            localStorage.setItem('authToken', this.token);
            this.updateAuthStatus();
            this.showSuccess('Login successful!');
        } else {
            this.showError(data.message || 'Login failed');
        }
    }

    async getCurrentUser() {
        const { response, data } = await this.makeRequest(`${this.baseURL}/auth/me`);
        
        if (!response.ok) {
            this.showError(data.message || 'Failed to get current user');
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
        this.updateAuthStatus();
        this.showInfo('Logged out successfully');
    }

    // Profile methods
    async createProfile() {
        const profileData = {
            name: document.getElementById('profile-name').value,
            bio: document.getElementById('profile-bio').value,
            location: document.getElementById('profile-location').value,
            interests: document.getElementById('profile-interests').value,
            skills: document.getElementById('profile-skills').value,
            experience: document.getElementById('profile-experience').value,
            education: document.getElementById('profile-education').value,
            social_links: document.getElementById('profile-social').value,
            projects: document.getElementById('profile-projects').value
        };

        const { response, data } = await this.makeRequest(`${this.baseURL}/profile`, {
            method: 'POST',
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            this.showSuccess('Profile created successfully!');
        } else {
            this.showError(data.message || 'Failed to create profile');
        }
    }

    async getProfile() {
        const { response, data } = await this.makeRequest(`${this.baseURL}/profile/me`);
        
        if (!response.ok) {
            this.showError(data.message || 'Failed to get profile');
        }
    }

    async updateProfile() {
        const profileData = {
            name: document.getElementById('profile-name').value,
            bio: document.getElementById('profile-bio').value,
            location: document.getElementById('profile-location').value,
            interests: document.getElementById('profile-interests').value,
            skills: document.getElementById('profile-skills').value,
            experience: document.getElementById('profile-experience').value,
            education: document.getElementById('profile-education').value,
            social_links: document.getElementById('profile-social').value,
            projects: document.getElementById('profile-projects').value
        };

        const { response, data } = await this.makeRequest(`${this.baseURL}/profile/me`, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            this.showSuccess('Profile updated successfully!');
        } else {
            this.showError(data.message || 'Failed to update profile');
        }
    }

    async deleteProfile() {
        if (!confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
            return;
        }

        const { response, data } = await this.makeRequest(`${this.baseURL}/profile/me`, {
            method: 'DELETE'
        });

        if (response.ok) {
            this.showSuccess('Profile deleted successfully!');
        } else {
            this.showError(data.message || 'Failed to delete profile');
        }
    }

    async searchProfiles() {
        const query = document.getElementById('search-query').value;
        
        if (!query.trim()) {
            this.showError('Please enter a search query');
            return;
        }

        const { response, data } = await this.makeRequest(`${this.baseURL}/profile/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            this.showError(data.message || 'Failed to search profiles');
        }
    }

    async uploadImage() {
        const fileInput = document.getElementById('profile-image');
        const file = fileInput.files[0];

        if (!file) {
            this.showError('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`${this.baseURL}/upload/profile-picture`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });

            const data = await response.json();
            
            this.logResponse({
                url: `${this.baseURL}/upload/profile-picture`,
                method: 'POST',
                status: response.status,
                data
            });

            if (response.ok) {
                this.showSuccess('Image uploaded successfully!');
            } else {
                this.showError(data.message || 'Failed to upload image');
            }
        } catch (error) {
            this.logResponse({
                url: `${this.baseURL}/upload/profile-picture`,
                method: 'POST',
                error: error.message
            });
            this.showError('Upload failed: ' + error.message);
        }
    }

    // Utility methods
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#28a745';
                break;
            case 'error':
                notification.style.backgroundColor = '#dc3545';
                break;
            case 'info':
                notification.style.backgroundColor = '#17a2b8';
                break;
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the API tester when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new APITester();
}); 