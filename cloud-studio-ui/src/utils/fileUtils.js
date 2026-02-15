/**
 * 文件处理工具函数
 */

/**
 * 根据文件名获取 Content-Type
 * @param {string} fileName - 文件名
 * @returns {string} Content-Type
 */
export const getContentTypeByFileName = (fileName) => {
  if (!fileName || typeof fileName !== 'string') {
    return 'application/octet-stream';
  }

  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return 'application/octet-stream';
  }

  const extension = fileName.substring(lastDotIndex + 1).toLowerCase();

  const contentTypeMap = {
    // 图片格式
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    
    // 文档格式
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // 文本格式
    txt: 'text/plain',
    html: 'text/html',
    htm: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    xml: 'application/xml',
    md: 'text/markdown',
    markdown: 'text/markdown',
    
    // 视频格式
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv',
    webm: 'video/webm',
    
    // 音频格式
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    aac: 'audio/aac',
    
    // 压缩格式
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
  };

  return contentTypeMap[extension] || 'application/octet-stream';
};

/**
 * 格式化文件大小
 * @param {number} bytes - 文件字节数
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes || bytes < 0) return 'N/A';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * 验证文件类型
 * @param {File} file - 文件对象
 * @param {string[]} allowedTypes - 允许的文件类型数组
 * @returns {boolean} 是否为允许的类型
 */
export const validateFileType = (file, allowedTypes = []) => {
  if (!file || !file.name) return false;
  if (allowedTypes.length === 0) return true;

  const fileName = file.name.toLowerCase();
  return allowedTypes.some(type => fileName.endsWith(`.${type.toLowerCase()}`));
};

/**
 * 验证文件大小
 * @param {File} file - 文件对象
 * @param {number} maxSizeInMB - 最大文件大小（MB）
 * @returns {boolean} 是否符合大小限制
 */
export const validateFileSize = (file, maxSizeInMB) => {
  if (!file || !file.size) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * 获取文件扩展名
 * @param {string} fileName - 文件名
 * @returns {string} 文件扩展名（小写，不含点）
 */
export const getFileExtension = (fileName) => {
  if (!fileName || typeof fileName !== 'string') return '';
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return fileName.substring(lastDotIndex + 1).toLowerCase();
};

/**
 * 判断是否为图片文件
 * @param {string} fileName - 文件名或扩展名
 * @returns {boolean} 是否为图片
 */
export const isImageFile = (fileName) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'];
  const ext = getFileExtension(fileName);
  return imageExtensions.includes(ext);
};

/**
 * 判断是否为视频文件
 * @param {string} fileName - 文件名或扩展名
 * @returns {boolean} 是否为视频
 */
export const isVideoFile = (fileName) => {
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
  const ext = getFileExtension(fileName);
  return videoExtensions.includes(ext);
};

/**
 * 判断是否为音频文件
 * @param {string} fileName - 文件名或扩展名
 * @returns {boolean} 是否为音频
 */
export const isAudioFile = (fileName) => {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
  const ext = getFileExtension(fileName);
  return audioExtensions.includes(ext);
};

/**
 * 判断是否为文档文件
 * @param {string} fileName - 文件名或扩展名
 * @returns {boolean} 是否为文档
 */
export const isDocumentFile = (fileName) => {
  const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md'];
  const ext = getFileExtension(fileName);
  return docExtensions.includes(ext);
};

/**
 * 生成唯一文件名
 * @param {string} originalFileName - 原始文件名
 * @param {string} prefix - 前缀
 * @returns {string} 唯一文件名
 */
export const generateUniqueFileName = (originalFileName, prefix = '') => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalFileName);
  const nameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
  
  const sanitizedName = nameWithoutExt
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')
    .substring(0, 50);
  
  return `${prefix}${sanitizedName}_${timestamp}_${randomStr}.${extension}`;
};

/**
 * 读取文件为 Base64
 * @param {File} file - 文件对象
 * @returns {Promise<string>} Base64 字符串
 */
export const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * 读取文件为文本
 * @param {File} file - 文件对象
 * @returns {Promise<string>} 文本内容
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

/**
 * 下载文件
 * @param {Blob|string} data - Blob 对象或 URL
 * @param {string} fileName - 文件名
 */
export const downloadFile = (data, fileName) => {
  const url = typeof data === 'string' ? data : URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  if (typeof data !== 'string') {
    URL.revokeObjectURL(url);
  }
};

/**
 * 压缩图片
 * @param {File} file - 图片文件
 * @param {number} maxWidth - 最大宽度
 * @param {number} maxHeight - 最大高度
 * @param {number} quality - 图片质量 (0-1)
 * @returns {Promise<Blob>} 压缩后的图片 Blob
 */
export const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 计算缩放比例
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('图片压缩失败'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
};

export default {
  getContentTypeByFileName,
  formatFileSize,
  validateFileType,
  validateFileSize,
  getFileExtension,
  isImageFile,
  isVideoFile,
  isAudioFile,
  isDocumentFile,
  generateUniqueFileName,
  readFileAsBase64,
  readFileAsText,
  downloadFile,
  compressImage,
};
