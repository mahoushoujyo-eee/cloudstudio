import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiPlay,
  FiRepeat,
  FiHeart,
  FiShare2,
  FiMoreHorizontal,
  FiMessageCircle,
} from 'react-icons/fi';
import { appComments, appDetailMock } from '../../data/mockData.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LikeButton from '../../components/LikeButton/LikeButton.jsx';
import './AppDetailPage.css';

const AppDetailPage = () => {
  const { appId } = useParams();
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const app = useMemo(() => ({ ...appDetailMock, id: appId || appDetailMock.id }), [appId]);

  const handleRun = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    navigate(`/app/${app.id}/edit`);
  };

  return (
    <div className="app-detail page-container">
      <div className="detail-layout">
        <div className="main">
          <div className="preview">
            <img src={app.cover} alt={app.title} />
            <button type="button" className="play-btn" onClick={handleRun}>
              <FiPlay />
            </button>
          </div>
          <div className="app-info">
            <h1>{app.title}</h1>
            <div className="tag-row">
              {app.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="author-row">
              <img src={app.author.avatar} alt={app.author.name} />
              <div>
                <strong>{app.author.name}</strong>
                <p>
                  {app.author.publishedAt} · {app.author.location}
                </p>
              </div>
              <button type="button" className="link-btn">
                访问主页
              </button>
            </div>
            <p className={`app-description ${expanded ? 'expanded' : ''}`}>{app.description}</p>
            <button type="button" className="ghost" onClick={() => setExpanded((prev) => !prev)}>
              {expanded ? '收起描述' : '展开描述'}
            </button>
            <div className="origin">
              复刻自：
              <strong>{app.derivedFrom.author}</strong>
              /
              <a href="#">{app.derivedFrom.app}</a>
            </div>
          </div>
          <section className="comments">
            <h3>
              评论 {appComments.length}
              <FiMessageCircle />
            </h3>
            <textarea
              placeholder={isAuthenticated ? '分享你的想法...' : '请先登录后发表评论'}
              disabled={!isAuthenticated}
            />
            <div className="comment-actions">
              <button type="button" onClick={() => (!isAuthenticated ? openAuthModal() : null)}>
                提交评论
              </button>
            </div>
            <div className="comment-list">
              {appComments.map((comment) => (
                <article key={comment.id} className="comment-card">
                  <img src={comment.user.avatar} alt={comment.user.name} />
                  <div>
                    <div className="comment-head">
                      <strong>{comment.user.name}</strong>
                      {comment.isAuthor && <span className="badge">作者</span>}
                      <small>
                        {comment.createdAt} · {comment.user.location}
                      </small>
                    </div>
                    <p>{comment.content}</p>
                    <button type="button" className="reply">
                      回复
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <button type="button" className="ghost">
              加载更多评论
            </button>
          </section>
        </div>
        <aside className="side">
          <button type="button" className="run-btn" onClick={handleRun}>
            <FiPlay />
            运行
          </button>
          <div className="stat-row">
            <span>
              <FiRepeat />
              {app.stats.copies} 复刻
            </span>
            <span>
              <FiHeart />
              {app.stats.likes}
            </span>
            <button type="button" className="ghost">
              <FiShare2 />
            </button>
            <button type="button" className="ghost">
              <FiMoreHorizontal />
            </button>
          </div>
          <LikeButton count={app.stats.likes} />
        </aside>
      </div>
    </div>
  );
};

export default AppDetailPage;
