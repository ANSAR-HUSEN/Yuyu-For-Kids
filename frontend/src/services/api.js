const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // ============================================
  // AUTH ENDPOINTS
  // ============================================
  
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
    
    if (data.name) {
      localStorage.setItem('parentName', data.name);
    }
    if (data.email) {
      localStorage.setItem('parentEmail', data.email);
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

  // ============================================
  // CHILD ENDPOINTS
  // ============================================

  async addChild(childData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/children`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(childData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add child');
    }
    
    return data;
  },

  async getChildren() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/children`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get children');
    }
    
    return data;
  },

  async updateChild(childId, childData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/children/${childId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: childData.name,
        age: childData.age
      }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update child');
    }
    
    return data;
  },

  async deleteChild(childId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/children/${childId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete child');
    }
    
    return data;
  },

  // ============================================
  // GAME PROGRESS ENDPOINTS (NEW)
  // ============================================

  // Save progress for any game (Candy Crush, Shape Sorter, Number Pop, Tic Tac Toe, Cloud Adventure)
  async saveGameProgress(childId, gameId, gameData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const { score, pointsEarned, level, movesUsed, timeSpent, metadata } = gameData;
    
    const response = await fetch(`${API_URL}/games/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        childId,
        gameId,
        score,
        pointsEarned,
        level,
        movesUsed,
        timeSpent,
        metadata
      }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save game progress');
    }
    
    // Update local storage with latest XP
    if (data.totalXP) {
      localStorage.setItem(`child_${childId}_xp`, data.totalXP);
    }
    
    return data;
  },
  
  // Get all games progress for a child (returns all 5 games: candy_crush, shape_sorter, number_pop, tic_tac_toe, cloud_adventure)
  async getAllGamesProgress(childId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/games/progress/${childId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get games progress');
    }
    
    return data;
  },
  
  // Get specific game progress (e.g., candy_crush, shape_sorter, number_pop, tic_tac_toe, cloud_adventure)
  async getGameProgress(childId, gameId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/games/progress/${childId}/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get game progress');
    }
    
    return data;
  },
  
  // Get child's total stats (XP, streak, badges, games played)
  async getChildStats(childId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/games/stats/${childId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get child stats');
    }
    
    return data;
  },
  
  // Get leaderboard for a specific game
  async getLeaderboard(gameId, limit = 10) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/games/leaderboard/${gameId}?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get leaderboard');
    }
    
    return data;
  },
  
  // Award badge manually (for special achievements)
  async awardBadge(childId, badgeName, source = 'manual') {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/games/badge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        childId,
        badgeName,
        source
      }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to award badge');
    }
    
    return data;
  },

  // ============================================
  // GAME STATS ENDPOINT (Legacy - keep for compatibility)
  // ============================================

  async updateGameStats(childId, score) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/children/${childId}/game-stats`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ score }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update game stats');
    }
    
    return data;
  },
};