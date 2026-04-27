const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        name: userData.name
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('parentId', data.parentId);
      localStorage.setItem('parentName', userData.name || data.name);
      localStorage.setItem('parentEmail', userData.email);
    }
    
    return data;
  },
  
async login(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('parentId', data.parentId || data.parent?.id);
    localStorage.setItem('parentName', data.name || data.parent?.name || "");
    localStorage.setItem('parentEmail', data.email || data.parent?.email || credentials.email); 
  }
  
  return data;
},
async updateParentProfile(name) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update profile');
  }
  
  // Update localStorage with new name
  if (data.name) {
    localStorage.setItem('parentName', data.name);
  }
  
  return data;
},
  async forgotPassword(email) {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send reset email');
    }
    
    return data;
  },

  async resetPassword(token, password) {
    const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }
    
    return data;
  },
  
  async getParentProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get profile');
    }
    
    // Store the data from API response
    if (data.name) {
      localStorage.setItem('parentName', data.name);
    }
    if (data.email) {
      localStorage.setItem('parentEmail', data.email);
    }
    
    return data;
  },
};