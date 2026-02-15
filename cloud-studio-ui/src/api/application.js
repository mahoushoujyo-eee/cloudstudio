import axios from 'axios';

const API_BASE = '/api';

/**
 * 应用相关接口
 */

// 获取应用列表
export const getApplications = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/applications`, { params });
    return response.data;
  } catch (error) {
    console.error('获取应用列表失败:', error);
    throw error;
  }
};

// 获取应用详情
export const getApplicationDetail = async (appId) => {
  try {
    const response = await axios.get(`${API_BASE}/applications/${appId}`);
    return response.data;
  } catch (error) {
    console.error('获取应用详情失败:', error);
    throw error;
  }
};

// 获取应用评论
export const getApplicationComments = async (appId, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/applications/${appId}/comments`, { params });
    return response.data;
  } catch (error) {
    console.error('获取应用评论失败:', error);
    throw error;
  }
};

// 添加应用评论
export const addApplicationComment = async (appId, content) => {
  try {
    const response = await axios.post(`${API_BASE}/applications/${appId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error('添加应用评论失败:', error);
    throw error;
  }
};

// 点赞应用
export const likeApplication = async (appId) => {
  try {
    const response = await axios.post(`${API_BASE}/applications/${appId}/like`);
    return response.data;
  } catch (error) {
    console.error('点赞应用失败:', error);
    throw error;
  }
};

// 取消点赞应用
export const unlikeApplication = async (appId) => {
  try {
    const response = await axios.delete(`${API_BASE}/applications/${appId}/like`);
    return response.data;
  } catch (error) {
    console.error('取消点赞失败:', error);
    throw error;
  }
};

// 复刻应用
export const copyApplication = async (appId) => {
  try {
    const response = await axios.post(`${API_BASE}/applications/${appId}/copy`);
    return response.data;
  } catch (error) {
    console.error('复刻应用失败:', error);
    throw error;
  }
};

// 分享应用
export const shareApplication = async (appId) => {
  try {
    const response = await axios.post(`${API_BASE}/applications/${appId}/share`);
    return response.data;
  } catch (error) {
    console.error('分享应用失败:', error);
    throw error;
  }
};

// 获取应用标签
export const getApplicationTags = async () => {
  try {
    const response = await axios.get(`${API_BASE}/applications/tags`);
    return response.data;
  } catch (error) {
    console.error('获取应用标签失败:', error);
    throw error;
  }
};

// 按标签筛选应用
export const filterApplicationsByTags = async (tags) => {
  try {
    const response = await axios.get(`${API_BASE}/applications/filter`, {
      params: { tags: tags.join(',') }
    });
    return response.data;
  } catch (error) {
    console.error('按标签筛选应用失败:', error);
    throw error;
  }
};

// 搜索应用
export const searchApplications = async (keyword, filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/applications/search`, {
      params: { keyword, ...filters }
    });
    return response.data;
  } catch (error) {
    console.error('搜索应用失败:', error);
    throw error;
  }
};

// 创建应用
export const createApplication = async (appData) => {
  try {
    const response = await axios.post(`${API_BASE}/applications`, appData);
    return response.data;
  } catch (error) {
    console.error('创建应用失败:', error);
    throw error;
  }
};

// 更新应用
export const updateApplication = async (appId, appData) => {
  try {
    const response = await axios.put(`${API_BASE}/applications/${appId}`, appData);
    return response.data;
  } catch (error) {
    console.error('更新应用失败:', error);
    throw error;
  }
};

// 删除应用
export const deleteApplication = async (appId) => {
  try {
    const response = await axios.delete(`${API_BASE}/applications/${appId}`);
    return response.data;
  } catch (error) {
    console.error('删除应用失败:', error);
    throw error;
  }
};
