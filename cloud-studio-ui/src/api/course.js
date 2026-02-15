import axios from 'axios';

const API_BASE = '/api';

/**
 * 课程相关接口
 */

// 获取课程列表(分页)
export const getCourseList = async (param) => {
  try {
    const response = await axios.get(`${API_BASE}/course/list`, { params: param });
    return response.data.data;
  } catch (error) {
    console.error('获取课程列表失败:', error);
    throw error;
  }
};

// 获取课程详情
export const getCourseInfo = async (courseId) => {
  try {
    const response = await axios.get(`${API_BASE}/course/${courseId}`);
    return response.data.data;
  } catch (error) {
    console.error('获取课程详情失败:', error);
    throw error;
  }
};

// 创建课程
export const createCourse = async (courseInfo) => {
  try {
    const response = await axios.post(`${API_BASE}/course/create`, courseInfo);
    return response.data.data;
  } catch (error) {
    console.error('创建课程失败:', error);
    throw error;
  }
};

// 更新课程信息
export const updateCourse = async (courseInfo) => {
  try {
    const response = await axios.post(`${API_BASE}/course/update`, courseInfo);
    return response.data.data;
  } catch (error) {
    console.error('更新课程失败:', error);
    throw error;
  }
};

// 删除课程
export const deleteCourse = async (courseId) => {
  try {
    const response = await axios.delete(`${API_BASE}/course/delete`, {
      params: { courseId }
    });
    return response.data.data;
  } catch (error) {
    console.error('删除课程失败:', error);
    throw error;
  }
};

// 设置课程封面
export const setCourseCover = async (coverParam) => {
  try {
    const response = await axios.post(`${API_BASE}/course/cover`, coverParam);
    return response.data.data;
  } catch (error) {
    console.error('设置课程封面失败:', error);
    throw error;
  }
};

// 添加课程评论
export const addCourseComment = async (courseComment) => {
  try {
    const response = await axios.post(`${API_BASE}/course/comment`, courseComment);
    return response.data.data;
  } catch (error) {
    console.error('添加课程评论失败:', error);
    throw error;
  }
};

// 获取课程评论(分页)
export const getCourseComments = async (param) => {
  try {
    const response = await axios.get(`${API_BASE}/course/comment`, { params: param });
    return response.data.data;
  } catch (error) {
    console.error('获取课程评论失败:', error);
    throw error;
  }
};

// 删除课程评论
export const deleteCourseComment = async (commentId) => {
  try {
    const response = await axios.delete(`${API_BASE}/course/comment`, {
      params: { commentId }
    });
    return response.data.data;
  } catch (error) {
    console.error('删除课程评论失败:', error);
    throw error;
  }
};
