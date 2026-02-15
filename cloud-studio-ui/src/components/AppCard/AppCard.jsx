import { Link } from 'react-router-dom';
import { FiEye, FiHeart, FiMessageCircle, FiRepeat } from 'react-icons/fi';
import './AppCard.css';

const metricIcons = {
  views: <FiEye />,
  comments: <FiMessageCircle />,
  likes: <FiHeart />,
  copies: <FiRepeat />,
};

const AppCard = ({ id, title, category = [], cover, description, author, stats }) => (
  <Link to={`/app/${id || 'app-comfy'}`} className="app-card">
    <div className="app-cover">
      <img src={cover} alt={title} loading="lazy" />
    </div>
    <div className="app-body">
      <div>
        <div className="app-tags">
          {category.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <div className="app-author">
        <span>{author}</span>
        <span className="pill-btn">立即体验</span>
      </div>
      <div className="app-stats">
        {Object.entries(stats).map(([key, value]) => (
          <span key={key}>
            {metricIcons[key]}
            {value}
          </span>
        ))}
      </div>
    </div>
  </Link>
);

export default AppCard;
