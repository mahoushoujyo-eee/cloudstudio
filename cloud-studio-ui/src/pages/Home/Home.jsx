import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiLayers, FiShare2 } from 'react-icons/fi';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import CourseCard from '../../components/CourseCard/CourseCard.jsx';
import UniversityCard from '../../components/UniversityCard/UniversityCard.jsx';
import TemplateCard from '../../components/TemplateCard/TemplateCard.jsx';
import AppCard from '../../components/AppCard/AppCard.jsx';
import { getCourseList } from '../../api/course';
import {
  partnerUniversities,
  templateGallery,
  applications,
} from '../../data/mockData.js';
import './Home.css';

const DEFAULT_COVER = 'https://cs-archive.codehub.cn/saas/app-resources/8/3/5/8353a96672d84eed88b21e0686bc2f7f.jpg';
const OSS_BASE_URL = 'https://course-cs.oss-cn-beijing.aliyuncs.com';

const featureList = [
  '海量课程随时学习，边练边上手',
  '教师一键复刻优质课程，快速开课',
  '开发环境免配置，高质量应用秒级复刻',
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [coverImages, setCoverImages] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getCourseList({ pageIndex: 0, pageOffset: 4 });
        const courseList = (result.data || []).slice(0, 4); // 确保最多只展示4个课程
        setCourses(courseList);
        
        // 为每个课程尝试加载 OSS 封面
        courseList.forEach((course) => {
          const ossUrl = `${OSS_BASE_URL}/${course.id}`;
          const img = new Image();
          img.onload = () => {
            setCoverImages((prev) => ({ ...prev, [course.id]: ossUrl }));
          };
          img.onerror = () => {
            setCoverImages((prev) => ({ ...prev, [course.id]: DEFAULT_COVER }));
          };
          img.src = ossUrl;
        });
      } catch (error) {
        console.error('获取课程列表失败:', error);
      }
    };
    fetchCourses();
  }, []);

  return (
  <div className="home-page page-container">
    <section className="hero section-block">
      <div className="hero-text">
        <span className="pill">Cloud Studio</span>
        <h1>
          从 0 到 1 学编程
          <br />
          <strong>学、教、练一步到位</strong>
        </h1>
        <p>
          为学生、教师、开发者打造的学、教、练一体化平台，提供边学边练的免费课程，轻松复刻优质课程，免配置的云端开发环境。
        </p>
        <div className="hero-cta">
          <button type="button" className="primary">
            立即体验
          </button>
          <button type="button" className="ghost">
            查看课程
          </button>
        </div>
        <ul>
          {featureList.map((item) => (
            <li key={item}>
              <FiCheckCircle />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="visual-card content">
          <h4>第四章：机器学习模型构建</h4>
          <pre>import pandas as pd{'\n'}import matplotlib.pyplot as plt</pre>
        </div>
        <div className="visual-card practice">
          <h4>课后练习</h4>
          <p>用自己的数据集训练分类模型，并输出指标报告。</p>
        </div>
        <div className="visual-card files">
          <h4>学习文件</h4>
          <span>learn.ipynb</span>
          <span>dataset.csv</span>
        </div>
      </motion.div>
    </section>

    <section className="section-block">
      <SectionHeader
        title="三大核心场景"
        subtitle="学习课程 / 教授课程 / 开发应用，一站式触达"
        hideAction
      />
      <div className="feature-grid">
        <div className="feature-card">
          <FiLayers />
          <h4>我要学习课程</h4>
          <p>免费学习海量热门课程，边学边练。</p>
        </div>
        <div className="feature-card purple">
          <FiShare2 />
          <h4>我要教授课程</h4>
          <p>优质课程资源轻松复用，快速开课。</p>
        </div>
        <div className="feature-card blue">
          <FiLayers />
          <h4>我要开发应用</h4>
          <p>开发环境无需配置，优质应用秒级复刻。</p>
        </div>
      </div>
    </section>

    <section className="section-block">
      <SectionHeader
        title="课程展示"
        subtitle="免费课程覆盖入门、进阶全流程"
        actionLabel="查看全部课程"
        actionTo="/learn"
      />
      <div className="course-grid">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            coverImage={coverImages[course.id] || DEFAULT_COVER}
            title={course.title}
            description={course.description}
            tags={course.tags?.split(',') || []}
            chapters={course.chapterCount}
            studentsCount={0}
          />
        ))}
      </div>
    </section>

    <section className="section-block">
      <SectionHeader title="高校专区" subtitle="名校汇聚，共享课程资源" />
      <div className="university-grid">
        {partnerUniversities.map((uni) => (
          <UniversityCard key={uni.id} {...uni} />
        ))}
      </div>
    </section>

    <section className="section-block">
      <SectionHeader
        title="开发应用"
        subtitle="优质应用轻松复刻，灵活改造"
        actionLabel="查看全部应用"
        actionTo="/market"
      />
      <div className="app-list">
        {applications.map((app) => (
          <AppCard key={app.id} {...app} />
        ))}
      </div>
    </section>

    <section className="section-block">
      <SectionHeader title="模板展示" subtitle="60+ 语言和框架无需配置，触手可及" actionTo="/templates" />
      <div className="template-grid">
        {templateGallery.map((tpl) => (
          <TemplateCard key={tpl.id} {...tpl} />
        ))}
      </div>
    </section>

    <section className="cta-card section-block">
      <div>
        <h2>开始使用 Cloud Studio</h2>
        <p>一键体验 AI 编程学习平台，加入 60W+ 学员与开发者。</p>
      </div>
      <button type="button">立即体验</button>
    </section>
  </div>
  );
};

export default Home;
