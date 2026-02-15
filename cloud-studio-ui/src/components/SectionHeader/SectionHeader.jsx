import { Link } from 'react-router-dom';
import './SectionHeader.css';

const SectionHeader = ({ title, subtitle, actionLabel = '查看全部', actionTo = '#', hideAction = false }) => (
  <div className="section-header">
    <div>
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {!hideAction && (
      <Link to={actionTo} className="section-link">
        {actionLabel}
      </Link>
    )}
  </div>
);

export default SectionHeader;
