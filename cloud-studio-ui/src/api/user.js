import axios from 'axios';

const API_BASE = '/api';

/**
 * 用户相关接口
 */

// 用户登录
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

// 用户注册
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

// 用户登出
export const logout = async () => {
  try {
    const response = await axios.post(`${API_BASE}/auth/logout`);
    return response.data;
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
};

// 获取当前用户信息
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_BASE}/users/me`);
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// 获取用户资料
export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error('获取用户资料失败:', error);
    throw error;
  }
};

// 更新用户资料
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(`${API_BASE}/users/${userId}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('更新用户资料失败:', error);
    throw error;
  }
};

// 获取用户统计数据
export const getUserStats = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/users/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error('获取用户统计失败:', error);
    throw error;
  }
};

// 获取用户时间线
export const getUserTimeline = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/users/${userId}/timeline`);
    return response.data;
  } catch (error) {
    console.error('获取用户时间线失败:', error);
    throw error;
  }
};

// 获取用户的课程
export const getUserCourses = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/users/${userId}/courses`);
    return response.data;
  } catch (error) {
    console.error('获取用户课程失败:', error);
    throw error;
  }
};

// 获取用户的应用
export const getUserApplications = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/users/${userId}/applications`);
    return response.data;
  } catch (error) {
    console.error('获取用户应用失败:', error);
    throw error;
  }
};

// 获取用户的收藏
export const getUserFavorites = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/users/${userId}/favorites`);
    return response.data;
  } catch (error) {
    console.error('获取用户收藏失败:', error);
    throw error;
  }
};

// 添加收藏
export const addFavorite = async (type, itemId) => {
  try {
    const response = await axios.post(`${API_BASE}/users/favorites`, { type, itemId });
    return response.data;
  } catch (error) {
    console.error('添加收藏失败:', error);
    throw error;
  }
};

// 取消收藏
export const removeFavorite = async (favoriteId) => {
  try {
    const response = await axios.delete(`${API_BASE}/users/favorites/${favoriteId}`);
    return response.data;
  } catch (error) {
    console.error('取消收藏失败:', error);
    throw error;
  }
};

// 修改密码
export const changePassword = async (passwordData) => {
  try {
    const response = await axios.put(`${API_BASE}/users/password`, passwordData);
    return response.data;
  } catch (error) {
    console.error('修改密码失败:', error);
    throw error;
  }
};

// 上传头像
export const uploadAvatar = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE}/users/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('上传头像失败:', error);
    throw error;
  }
};

// 更新用户设置
export const updateUserSettings = async (settings) => {
  try {
    const response = await axios.put(`${API_BASE}/users/settings`, settings);
    return response.data;
  } catch (error) {
    console.error('更新设置失败:', error);
    throw error;
  }
};

// 获取用户设置
export const getUserSettings = async () => {
  try {
    const response = await axios.get(`${API_BASE}/users/settings`);
    return response.data;
  } catch (error) {
    console.error('获取设置失败:', error);
    throw error;
  }
};
