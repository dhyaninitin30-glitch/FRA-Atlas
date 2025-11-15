// API Configuration and HTTP Client
class APIClient {
    constructor() {
        this.baseURL = 'http://localhost:5001/api';
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    // Set authorization header
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Generic HTTP request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            // Handle authentication errors
            if (response.status === 401) {
                this.logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET'
        });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // File upload request
    async uploadFile(endpoint, formData) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {};
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData
            });

            const data = await response.json();

            if (response.status === 401) {
                this.logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            return data;
        } catch (error) {
            console.error('File Upload Error:', error);
            throw error;
        }
    }

    // Authentication methods
    async login(credentials) {
        try {
            const response = await this.post('/auth/login', credentials);
            
            if (response.success) {
                this.token = response.data.token;
                this.user = response.data.user;
                
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                
                return response;
            }
            
            throw new Error(response.message || 'Login failed');
        } catch (error) {
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await this.post('/auth/register', userData);
            
            if (response.success) {
                this.token = response.data.token;
                this.user = response.data.user;
                
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                
                return response;
            }
            
            throw new Error(response.message || 'Registration failed');
        } catch (error) {
            throw error;
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login or reload page
        if (typeof showLoginScreen === 'function') {
            showLoginScreen();
        } else {
            window.location.reload();
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Claims API methods
    async getClaims(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/claims?${queryParams}` : '/claims';
        return this.get(endpoint);
    }

    async getClaimById(id) {
        return this.get(`/claims/${id}`);
    }

    async createClaim(claimData, file = null) {
        if (file) {
            const formData = new FormData();
            Object.keys(claimData).forEach(key => {
                formData.append(key, claimData[key]);
            });
            formData.append('document', file);
            return this.uploadFile('/claims', formData);
        } else {
            return this.post('/claims', claimData);
        }
    }

    async updateClaimStatus(id, statusData) {
        return this.put(`/claims/${id}`, statusData);
    }

    async deleteClaim(id) {
        return this.delete(`/claims/${id}`);
    }

    // DSS API methods
    async getSchemeRecommendations(claimData) {
        return this.post('/dss/recommend', claimData);
    }

    async getAllSchemes() {
        return this.get('/dss/schemes');
    }

    // Feedback API methods
    async submitFeedback(feedbackData) {
        return this.post('/feedback', feedbackData);
    }

    async getFeedback(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/feedback?${queryParams}` : '/feedback';
        return this.get(endpoint);
    }

    async updateFeedback(id, updateData) {
        return this.put(`/feedback/${id}`, updateData);
    }

    // Issues API methods
    async reportIssue(issueData) {
        return this.post('/issues', issueData);
    }

    async getIssues(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/issues?${queryParams}` : '/issues';
        return this.get(endpoint);
    }

    async updateIssue(id, updateData) {
        return this.put(`/issues/${id}`, updateData);
    }

    async deleteIssue(id) {
        return this.delete(`/issues/${id}`);
    }

    // Reports API methods
    async generateDistrictReport(districtId) {
        return this.get(`/reports/district/${districtId}`);
    }

    async generateCustomReport(reportData) {
        return this.post('/reports/custom', reportData);
    }

    async getReports(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/reports?${queryParams}` : '/reports';
        return this.get(endpoint);
    }

    async downloadReport(filename) {
        const url = `${this.baseURL}/reports/download/${filename}`;
        const headers = this.getHeaders();
        
        try {
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                throw new Error('Download failed');
            }
            
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
            
            return { success: true, message: 'Download started' };
        } catch (error) {
            throw error;
        }
    }

    // Health check
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/api/health`);
            return await response.json();
        } catch (error) {
            throw new Error('Backend server is not responding');
        }
    }
}

// Create global API instance
const api = new APIClient();

// Global state management
class AppState {
    constructor() {
        this.state = {
            user: api.getCurrentUser(),
            isAuthenticated: api.isAuthenticated(),
            loading: false,
            error: null,
            claims: [],
            feedback: [],
            issues: [],
            reports: [],
            theme: localStorage.getItem('theme') || 'light'
        };
        this.listeners = [];
    }

    // Subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Update state and notify listeners
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.listeners.forEach(listener => listener(this.state));
    }

    // Get current state
    getState() {
        return this.state;
    }

    // Authentication actions
    async login(credentials) {
        this.setState({ loading: true, error: null });
        
        try {
            const response = await api.login(credentials);
            this.setState({
                user: api.getCurrentUser(),
                isAuthenticated: true,
                loading: false
            });
            return response;
        } catch (error) {
            this.setState({ loading: false, error: error.message });
            throw error;
        }
    }

    logout() {
        api.logout();
        this.setState({
            user: null,
            isAuthenticated: false,
            claims: [],
            feedback: [],
            issues: [],
            reports: []
        });
    }

    // Data fetching actions
    async fetchClaims(filters = {}) {
        this.setState({ loading: true });
        
        try {
            const response = await api.getClaims(filters);
            this.setState({
                claims: response.data.claims || [],
                loading: false
            });
            return response;
        } catch (error) {
            this.setState({ loading: false, error: error.message });
            throw error;
        }
    }

    async fetchFeedback(filters = {}) {
        this.setState({ loading: true });
        
        try {
            const response = await api.getFeedback(filters);
            this.setState({
                feedback: response.data.feedback || [],
                loading: false
            });
            return response;
        } catch (error) {
            this.setState({ loading: false, error: error.message });
            throw error;
        }
    }

    async fetchIssues(filters = {}) {
        this.setState({ loading: true });
        
        try {
            const response = await api.getIssues(filters);
            this.setState({
                issues: response.data.issues || [],
                loading: false
            });
            return response;
        } catch (error) {
            this.setState({ loading: false, error: error.message });
            throw error;
        }
    }

    // Theme management
    toggleTheme() {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        this.setState({ theme: newTheme });
        document.documentElement.setAttribute('data-theme', newTheme);
    }
}

// Create global app state
const appState = new AppState();

// Utility functions for UI feedback
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

function showLoader(show = true) {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// Error handling utility
function handleAPIError(error) {
    console.error('API Error:', error);
    
    if (error.message.includes('Session expired')) {
        showToast('Session expired. Please login again.', 'error');
        appState.logout();
    } else if (error.message.includes('Network')) {
        showToast('Network error. Please check your connection.', 'error');
    } else {
        showToast(error.message || 'An error occurred', 'error');
    }
}

// Export for global use
window.api = api;
window.appState = appState;
window.showToast = showToast;
window.showLoader = showLoader;
window.handleAPIError = handleAPIError;