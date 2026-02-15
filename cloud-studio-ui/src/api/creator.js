import axios from 'axios';

const API_BASE = '/api';

/**
 * 创作者相关接口
 */

// 获取创作者精选列表
export const getCreatorHighlights = async () => {
  try {
    const response = await axios.get(`${API_BASE}/creators/highlights`);
    return response.data;
  } catch (error) {
    console.error('获取创作者精选列表失败:', error);
    throw error;
  }
};

// 获取创作者详情
export const getCreatorDetail = async (creatorId) => {
  try {
    const response = await axios.get(`${API_BASE}/creators/${creatorId}`);
    return response.data;
  } catch (error) {
    console.error('获取创作者详情失败:', error);
    throw error;
  }
};

// 获取创作者的应用列表
export const getCreatorApplications = async (creatorId) => {
  try {
    const response = await axios.get(`${API_BASE}/creators/${creatorId}/applications`);
    return response.data;
  } catch (error) {
    console.error('获取创作者应用列表失败:', error);
    throw error;
  }
};

// 获取创作者的课程列表
export const getCreatorCourses = async (creatorId) => {
  try {
    const response = await axios.get(`${API_BASE}/creators/${creatorId}/courses`);
    return response.data;
  } catch (error) {
    console.error('获取创作者课程列表失败:', error);
    throw error;
  }
};

// 关注创作者
export const followCreator = async (creatorId) => {
  try {
    const response = await axios.post(`${API_BASE}/creators/${creatorId}/follow`);
    return response.data;
  } catch (error) {
    console.error('关注创作者失败:', error);
    throw error;
  }
};

// 取消关注创作者
export const unfollowCreator = async (creatorId) => {
  try {
    const response = await axios.delete(`${API_BASE}/creators/${creatorId}/follow`);
    return response.data;
  } catch (error) {
    console.error('取消关注失败:', error);
    throw error;
  }
};

// 搜索创作者
export const searchCreators = async (keyword) => {
  try {
    const response = await axios.get(`${API_BASE}/creators/search`, {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.error('搜索创作者失败:', error);
    throw error;
  }
};
