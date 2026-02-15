export const learningPaths = [
  {
    id: 'lp-programming',
    title: '编程语言基础',
    items: [
      { label: 'Python 入门', value: 'python' },
      { label: 'C/C++ 基础', value: 'cpp' },
      { label: 'Java 基础', value: 'java' },
      { label: 'Go 语言', value: 'go' },
    ],
  },
  {
    id: 'lp-ai',
    title: '人工智能与 LLM',
    items: [
      { label: '机器学习', value: 'ml' },
      { label: '深度学习', value: 'dl' },
      { label: 'LLM 实战', value: 'llm' },
      { label: 'Agent 应用', value: 'agent' },
    ],
  },
  {
    id: 'lp-web',
    title: 'Web 全栈开发',
    items: [
      { label: 'HTML + CSS', value: 'html-css' },
      { label: 'JavaScript 进阶', value: 'js' },
      { label: 'React 框架', value: 'react' },
      { label: '全栈项目', value: 'fullstack' },
    ],
  },
];

export const featuredCourses = [
  {
    id: 1,
    title: '从零构建 AI Agent 实战营',
    description: '学习如何构建可落地的多 Agent 协作系统，支撑真实业务场景。',
    coverImage: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=60',
    tags: ['#人工智能', '#Agent'],
    chapters: 24,
    studentsCount: 25600,
  },
  {
    id: 2,
    title: 'React 进阶组件与性能优化',
    description: '构建高性能前端项目，掌握现代工程化与交互设计。',
    coverImage: 'https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&w=900&q=60',
    tags: ['#Web开发', '#React'],
    chapters: 18,
    studentsCount: 18800,
  },
  {
    id: 3,
    title: '机器学习工程师成长路线',
    description: '打通数学基础、模型训练、部署上线的全链路技能。',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=60',
    tags: ['#机器学习', '#算法'],
    chapters: 30,
    studentsCount: 31200,
  },
  {
    id: 4,
    title: '全栈开发者的第一款产品',
    description: '从需求分析到上线维护，构建具备商业价值的 Web 产品。',
    coverImage: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?auto=format&fit=crop&w=900&q=60',
    tags: ['#全栈', '#创业'],
    chapters: 20,
    studentsCount: 9800,
  },
];

export const partnerUniversities = [
  { id: 'xjtu', name: '西安交通大学', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Xi%27an_Jiaotong_University_logo.svg', courses: 132 },
  { id: 'szpt', name: '深圳大学', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Shenzhen_University_logo.svg', courses: 108 },
  { id: 'whu', name: '武汉大学', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Wuhan_University_logo.svg', courses: 156 },
  { id: 'sjtu', name: '上海交通大学', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Shanghai_Jiao_Tong_University_logo.svg', courses: 176 },
  { id: 'thu', name: '清华大学', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tsinghua_University_Logo.svg', courses: 210 },
];

export const templateGallery = [
  {
    id: 'all-in-one',
    title: 'All in One',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
    description: '集成多种编程语言和工具，适合多技术栈项目。',
    usage: 84605,
    category: 'all',
  },
  {
    id: 'python',
    title: 'Python',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
    description: '适合 Python 开发，提供解释器支持。',
    usage: 26330,
    category: 'language',
  },
  {
    id: 'cpp',
    title: 'C/C++',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg',
    description: '适合 C/C++ 开发，提供编译器支持。',
    usage: 12616,
    category: 'language',
  },
  {
    id: 'pytorch',
    title: 'Pytorch',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/10/PyTorch_logo_icon.svg',
    description: '提供 PyTorch 官方示例环境，适合 AI 训练。',
    usage: 12053,
    category: 'ai',
  },
  {
    id: 'ubuntu',
    title: 'Ubuntu',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo-ubuntu_cof-orange-hex.svg',
    description: '提供 Linux 环境，满足特定操作系统需求。',
    usage: 7096,
    category: 'backend',
  },
  {
    id: 'vue',
    title: 'Vue.js',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg',
    description: '用于快速搭建 Vue 前端项目，默认 Vite 服务。',
    usage: 3875,
    category: 'frontend',
  },
];

export const applications = [
  {
    id: 'app-1',
    title: 'infinitelalk 超长数字人 MV',
    category: ['#AI应用', '#AI生成应用'],
    author: '勇敢归归',
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=60',
    description: '制作超长 MV，可生成 30-60 秒 AI 数字人剧情。',
    stats: { views: '1.8k', comments: 20, likes: 593, copies: 82 },
  },
  {
    id: 'app-2',
    title: 'ComfyUI - CPU 爽玩版',
    category: ['#网页', '#AI应用', '#AI生成应用'],
    author: 'aiden',
    cover: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1000&q=60',
    description: '服务器放宽，更新了启动方式，适合零门槛体验。',
    stats: { views: '2.0k', comments: 17, likes: 936, copies: 67 },
  },
  {
    id: 'app-3',
    title: 'ComfyUI【GPU 基础完善版】',
    category: ['#网页', '#AI应用', '#AI生成应用'],
    author: 'aiden',
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=60',
    description: 'GPU 版本，快速进行图像生成项目。',
    stats: { views: '1.2k', comments: 25, likes: 952, copies: 90 },
  },
];

export const creatorHighlights = [
  { id: 'creator-1', name: 'aiden', avatar: 'https://i.pravatar.cc/120?u=aiden', bio: 'ComfyUI 模板专家', tags: ['#AI应用'] },
  { id: 'creator-2', name: 'Lain', avatar: 'https://i.pravatar.cc/120?u=lain', bio: '数据科学场景开发者', tags: ['#数据科学'] },
  { id: 'creator-3', name: 'Leo', avatar: 'https://i.pravatar.cc/120?u=leo', bio: 'Spec-Driven 开发倡导者', tags: ['#Spec-Dev'] },
];

export const appTags = ['全部', 'AI生成应用', 'AI应用', '网页', '数据科学', '1024 画龙点睛', '小游戏'];

export const templateTabs = [
  { id: 'all', label: '全部' },
  { id: 'ai', label: 'AI 模板' },
  { id: 'language', label: '语言环境' },
  { id: 'frontend', label: '前端开发' },
  { id: 'backend', label: '后端开发' },
  { id: 'static', label: '静态网站' },
];

export const courseDetailMock = {
  id: 'course-ai-agent',
  title: 'AI Agent 全链路实战营',
  description:
    '掌握从需求分析、数据处理到模型部署、Agent 联动的全链路能力，结合真实企业案例完成一次可交付的 AI 应用建设。',
  coverImage:
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=60',
  category: '人工智能',
  totalChapters: 12,
  stats: {
    students: 25600,
    rating: 4.9,
  },
};

export const courseChapters = [
  {
    id: 'ch-01',
    title: '1. 课程导学：AI Agent 能力地图',
    description:
      '课程结构讲解、项目背景介绍、核心能力拆解以及本课程将产出的最终成果，帮助你建立清晰的知识心智。',
  },
  {
    id: 'ch-02',
    title: '2. 需求分析与数据准备',
    description:
      '从用户场景出发完成需求画布、数据指标设计与数据集采集，包含结构化与非结构化数据清洗流程。',
  },
  {
    id: 'ch-03',
    title: '3. 模型能力调优',
    description:
      '使用向量数据库、工具调用、LangChain 等技术构建可迭代的 Agent，掌握 RAG 与函数调用模式。',
  },
  {
    id: 'ch-04',
    title: '4. 前端交互与可视化',
    description:
      '构建具备输入引导、消息上下文展示以及运行状态可视化的前端界面，同时兼顾可访问性与响应式布局。',
  },
  {
    id: 'ch-05',
    title: '5. 部署与可观测',
    description:
      '理解云端部署流程，接入指标监控、日志追踪与异常报警，确保 Agent 服务稳定可靠。',
  },
];

export const appDetailMock = {
  id: 'app-comfy',
  title: 'ComfyUI - CPU 爽玩版',
  cover:
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=60',
  tags: ['#网页', '#AI应用', '#AI生成应用'],
  stats: {
    copies: 936,
    likes: 2100,
    shares: 84,
  },
  author: {
    name: 'aiden',
    avatar: 'https://i.pravatar.cc/120?img=32',
    publishedAt: '2025-11-01',
    location: '深圳',
  },
  derivedFrom: {
    author: 'Leo',
    app: 'Spec-Kit',
  },
  description:
    '针对轻量化机器打造的 ComfyUI 版本，内置多个生产级节点示例，帮助创作者快速完成 AI 图像生成工作流。提供完整的运行日志面板与资源占用监控，复刻后即可直接运行。',
};

export const appComments = [
  {
    id: 'cm-01',
    user: {
      name: 'Lain',
      avatar: 'https://i.pravatar.cc/120?img=47',
      location: '杭州',
    },
    content: '运行稳定，配套的 workflow 很实用，已经应用在我们的小型项目里了。',
    createdAt: '2 小时前',
    isAuthor: false,
  },
  {
    id: 'cm-02',
    user: {
      name: 'aiden',
      avatar: 'https://i.pravatar.cc/120?img=32',
      location: '深圳',
    },
    content: '新增了 CPU 预设，欢迎反馈体验问题。',
    createdAt: '昨天',
    isAuthor: true,
  },
];

export const userProfileMock = {
  stats: [
    { id: 'apps', label: '创建的应用', value: 14 },
    { id: 'courses', label: '发布的课程', value: 6 },
    { id: 'likes', label: '获得的点赞', value: 2800 },
  ],
  timeline: [
    { id: 'tl-01', title: '发布《AI Agent 工程化》课程', date: '11-01', desc: '吸引 1200 名学习者' },
    { id: 'tl-02', title: '复刻 ComfyUI 场景', date: '10-22', desc: '分享新的工作流' },
  ],
  courses: [
    {
      id: 'course-1',
      title: 'Python 数据分析实战',
      cover: 'https://images.unsplash.com/photo-1487147264018-f937fba0c817?auto=format&fit=crop&w=900&q=60',
      progress: 68,
      updatedAt: '2 天前',
    },
    {
      id: 'course-2',
      title: 'React 全栈开发',
      cover: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=60',
      progress: 100,
      updatedAt: '1 周前',
    },
    {
      id: 'course-3',
      title: '机器学习工程师入门',
      cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=60',
      progress: 32,
      updatedAt: '3 小时前',
    },
  ],
  apps: [
    {
      id: 'app-1',
      title: 'AI 视频剪辑助手',
      cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=60',
      stats: { copies: 420, likes: 180 },
    },
    {
      id: 'app-2',
      title: 'LLM Prompt Studio',
      cover: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=900&q=60',
      stats: { copies: 260, likes: 210 },
    },
    {
      id: 'app-3',
      title: 'ComfyUI Workflow Pack',
      cover: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=900&q=60',
      stats: { copies: 512, likes: 320 },
    },
  ],
  favorites: [
    { id: 'fav-1', title: 'LLM 实践模版', type: '模版' },
    { id: 'fav-2', title: 'AI 产品设计指南', type: '课程' },
  ],
};
