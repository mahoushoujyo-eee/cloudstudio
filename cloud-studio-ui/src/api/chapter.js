import axios from 'axios';

const API_BASE = '/api';

/**
 * 章节相关接口
 */

// 创建单个章节
export const createChapter = async (chapterDetail) => {
  try {
    const response = await axios.post(`${API_BASE}/chapter/create`, chapterDetail);
    return response.data.data;
  } catch (error) {
    console.error('创建章节失败:', error);
    throw error;
  }
};

// 批量创建课程章节
export const batchCreateChapters = async (param) => {
  try {
    const response = await axios.post(`${API_BASE}/chapter/batch-create`, param);
    return response.data.data;
  } catch (error) {
    console.error('批量创建章节失败:', error);
    throw error;
  }
};

// 根据ID获取章节详情
export const getChapterById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/chapter/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('获取章节详情失败:', error);
    throw error;
  }
};

// 根据课程ID获取章节列表
export const getChaptersByCourseId = async (courseId) => {
  try {
    const response = await axios.get(`${API_BASE}/chapter/list`, {
      params: { courseId }
    });
    return response.data.data;
  } catch (error) {
    console.error('获取章节列表失败:', error);
    throw error;
  }
};

// 分页获取章节列表
export const getChaptersByPagination = async (courseId, pageIndex = 0, pageOffset = 10) => {
  try {
    const response = await axios.get(`${API_BASE}/chapter/list-pagination`, {
      params: { courseId, pageIndex, pageOffset }
    });
    return response.data.data;
  } catch (error) {
    console.error('分页获取章节列表失败:', error);
    throw error;
  }
};

// 更新章节信息
export const updateChapter = async (chapterDetail) => {
  try {
    const response = await axios.post(`${API_BASE}/chapter/update`, chapterDetail);
    return response.data.data;
  } catch (error) {
    console.error('更新章节失败:', error);
    throw error;
  }
};

// 删除章节
export const deleteChapter = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE}/chapter/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('删除章节失败:', error);
    throw error;
  }
};

// 根据课程ID删除章节
export const deleteChaptersByCourseId = async (courseId) => {
  try {
    const response = await axios.delete(`${API_BASE}/chapter/by-course`, {
      params: { courseId }
    });
    return response.data.data;
  } catch (error) {
    console.error('删除课程章节失败:', error);
    throw error;
  }
};

// 批量设置章节 Markdown
export const batchSetChapterMarkdown = async (param) => {
  try {
    const response = await axios.post(`${API_BASE}/chapter/batch-markdown`, param);
    return response.data.data;
  } catch (error) {
    console.error('批量设置章节 Markdown 失败:', error);
    throw error;
  }
};

// 创建章节学习记录
export const createChapterRecord = async (recordData) => {
  try {
    const response = await axios.post(`${API_BASE}/chapter/record/create`, recordData);
    return response.data.data;
  } catch (error) {
    console.error('创建章节学习记录失败:', error);
    throw error;
  }
};

// 查询用户章节完成记录
export const getChapterRecordByUserAndChapter = async (userId, chapterId) => {
  try {
    const response = await axios.get(`${API_BASE}/chapter/record/user/${userId}/chapter/${chapterId}`);
    return response.data.data;
  } catch (error) {
    console.error('查询章节完成记录失败:', error);
    throw error;
  }
};

// 查询用户所有章节完成记录
export const getChapterRecordsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/chapter/record/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('查询用户所有章节完成记录失败:', error);
    throw error;
  }
};
