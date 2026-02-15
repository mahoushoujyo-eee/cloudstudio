/**
 * 获取当前用户ID
 * 目前返回默认值0，后续会从JWT或localStorage中读取
 * @returns {number} 用户ID
 */
export const getUserId = () => {
  // TODO: 从JWT token或localStorage中读取真实的用户ID
  // 示例实现：
  // const token = localStorage.getItem('token');
  // if (token) {
  //   const decoded = parseJWT(token);
  //   return decoded.userId || 0;
  // }
  // 或者从localStorage直接读取：
  // const userId = localStorage.getItem('userId');
  // return userId ? parseInt(userId, 10) : 0;
  
  return 0;
};

/**
 * 解析JWT token（示例实现）
 * @param {string} token - JWT token
 * @returns {object} 解析后的payload
 */
export const parseJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('解析JWT失败:', error);
    return {};
  }
};
