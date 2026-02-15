import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import TagFilter from '../../components/TagFilter/TagFilter.jsx';
import CourseCard from '../../components/CourseCard/CourseCard.jsx';
import { getCourseList } from '../../api/course';
import './LearningCenter.css';

const courseCategories = ['全部', '人工智能', '编程语言基础', 'Web 开发', '面试算法', '其他'];
const DEFAULT_COVER = 'https://cs-archive.codehub.cn/saas/app-resources/8/3/5/8353a96672d84eed88b21e0686bc2f7f.jpg';
const OSS_BASE_URL = 'https://course-cs.oss-cn-beijing.aliyuncs.com';

const LearningCenter = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(courseCategories[0]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coverImages, setCoverImages] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const result = await getCourseList({ pageIndex: 0, pageOffset: 10 });
        const courseList = result.data || [];
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
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    if (category === '全部') {
      return courses;
    }
    return courses.filter((course) => course.tags?.includes(category.replace(' ', '')));
  }, [category, courses]);

  return (
    <div className="learning-page page-container">
      <section className="section-block">
        <div className="course-header">
          <div>
            <h3>全部课程</h3>
            <p>边练边上手，加入 60W+ 学员</p>
          </div>
          <button type="button" className="primary" onClick={() => navigate('/courses/create')}>
            <FiPlus />
            创建课程
          </button>
        </div>
        <TagFilter tags={courseCategories} active={category} onChange={setCategory} />
        <div className="course-grid">
          {loading ? (
            <p>加载中...</p>
          ) : filteredCourses.length === 0 ? (
            <p>暂无课程</p>
          ) : (
            filteredCourses.map((course) => (
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
            ))
          )}
        </div>
        <div className="load-more">
          <button type="button">加载更多</button>
        </div>
      </section>
    </div>
  );
};

export default LearningCenter;
