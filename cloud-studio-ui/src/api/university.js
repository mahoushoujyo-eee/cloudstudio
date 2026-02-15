import axios from 'axios';

const API_BASE = '/api';

/**
 * 合作高校相关接口
 */

// 获取合作高校列表
export const getPartnerUniversities = async () => {
  try {
    const response = await axios.get(`${API_BASE}/universities`);
    return response.data;
  } catch (error) {
    console.error('获取合作高校列表失败:', error);
    throw error;
  }
};

// 获取高校详情
export const getUniversityDetail = async (universityId) => {
  try {
    const response = await axios.get(`${API_BASE}/universities/${universityId}`);
    return response.data;
  } catch (error) {
    console.error('获取高校详情失败:', error);
    throw error;
  }
};

// 获取高校的课程列表
export const getUniversityCourses = async (universityId) => {
  try {
    const response = await axios.get(`${API_BASE}/universities/${universityId}/courses`);
    return response.data;
  } catch (error) {
    console.error('获取高校课程列表失败:', error);
    throw error;
  }
};

// 搜索高校
export const searchUniversities = async (keyword) => {
  try {
    const response = await axios.get(`${API_BASE}/universities/search`, {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.error('搜索高校失败:', error);
    throw error;
  }
};
