import axios from 'axios';

const API_BASE = '/api';

/**
 * 模板相关接口
 */

// 获取模板列表
export const getTemplates = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/templates`, { params });
    return response.data;
  } catch (error) {
    console.error('获取模板列表失败:', error);
    throw error;
  }
};

// 获取模板详情
export const getTemplateDetail = async (templateId) => {
  try {
    const response = await axios.get(`${API_BASE}/templates/${templateId}`);
    return response.data;
  } catch (error) {
    console.error('获取模板详情失败:', error);
    throw error;
  }
};

// 获取模板分类
export const getTemplateCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE}/templates/categories`);
    return response.data;
  } catch (error) {
    console.error('获取模板分类失败:', error);
    throw error;
  }
};

// 按分类筛选模板
export const filterTemplatesByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE}/templates/filter`, {
      params: { category }
    });
    return response.data;
  } catch (error) {
    console.error('按分类筛选模板失败:', error);
    throw error;
  }
};

// 使用模板
export const useTemplate = async (templateId) => {
  try {
    const response = await axios.post(`${API_BASE}/templates/${templateId}/use`);
    return response.data;
  } catch (error) {
    console.error('使用模板失败:', error);
    throw error;
  }
};

// 搜索模板
export const searchTemplates = async (keyword) => {
  try {
    const response = await axios.get(`${API_BASE}/templates/search`, {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.error('搜索模板失败:', error);
    throw error;
  }
};

// 创建模板
export const createTemplate = async (templateData) => {
  try {
    const response = await axios.post(`${API_BASE}/templates`, templateData);
    return response.data;
  } catch (error) {
    console.error('创建模板失败:', error);
    throw error;
  }
};

// 更新模板
export const updateTemplate = async (templateId, templateData) => {
  try {
    const response = await axios.put(`${API_BASE}/templates/${templateId}`, templateData);
    return response.data;
  } catch (error) {
    console.error('更新模板失败:', error);
    throw error;
  }
};

// 删除模板
export const deleteTemplate = async (templateId) => {
  try {
    const response = await axios.delete(`${API_BASE}/templates/${templateId}`);
    return response.data;
  } catch (error) {
    console.error('删除模板失败:', error);
    throw error;
  }
};
