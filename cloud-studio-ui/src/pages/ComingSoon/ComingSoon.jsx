import './ComingSoon.css';

const ComingSoon = ({ title = '页面建设中', description = '该功能即将上线，敬请期待。' }) => (
  <div className="coming-soon page-container">
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);

export default ComingSoon;
