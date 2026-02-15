import { Link } from 'react-router-dom';
import { FiBookOpen, FiUser } from 'react-icons/fi';
import './CourseCard.css';

const formatter = new Intl.NumberFormat('zh-CN', { notation: 'compact' });

const CourseCard = ({
  id,
  coverImage,
  title,
  description,
  tags = [],
  chapters,
  studentsCount,
}) => (
  <Link to={`/course/${id || 'course-ai-agent'}`} className="course-card">
    <div className="course-cover">
      <img src={coverImage} alt={title} loading="lazy" />
    </div>
    <div className="course-body">
      <h4>{title}</h4>
      <p>{description}</p>
      <div className="course-tags">
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
    <div className="course-footer">
      <span className="meta">
        <FiBookOpen />
        {chapters} 章节
      </span>
      <span className="meta">
        <FiUser />
        {formatter.format(studentsCount)}
      </span>
    </div>
  </Link>
);

export default CourseCard;
