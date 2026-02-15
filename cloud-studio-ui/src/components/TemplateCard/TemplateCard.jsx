import './TemplateCard.css';

const TemplateCard = ({ logo, title, description, usage }) => (
  <article className="template-card">
    <img src={logo} alt={`${title} logo`} />
    <div className="template-info">
      <div className="template-head">
        <h4>{title}</h4>
        <span className="usage">{usage.toLocaleString()} 使用</span>
      </div>
      <p>{description}</p>
    </div>
    <button type="button">使用模板</button>
  </article>
);

export default TemplateCard;
