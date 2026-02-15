import './UniversityCard.css';

const UniversityCard = ({ logo, name, courses }) => (
  <div className="university-card">
    <div className="logo-wrap">
      <img src={logo} alt={name} loading="lazy" />
    </div>
    <strong>{name}</strong>
    <span>{courses} 门课程</span>
  </div>
);

export default UniversityCard;
