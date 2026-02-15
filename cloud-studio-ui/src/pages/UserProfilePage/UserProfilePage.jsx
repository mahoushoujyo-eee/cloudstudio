import { useState } from 'react';
import {
  FiHome,
  FiBookOpen,
  FiLayers,
  FiCpu,
  FiSettings,
  FiCheckSquare,
  FiPlus,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { userProfileMock } from '../../data/mockData.js';
import './UserProfilePage.css';

const sidebarItems = [
  { id: 'overview', label: '概览', icon: <FiHome /> },
  { id: 'learning', label: '学习记录', icon: <FiBookOpen /> },
  { id: 'courses', label: '课程管理', icon: <FiLayers /> },
  { id: 'apps', label: '应用管理', icon: <FiCpu /> },
];

const quickStart = [
  { id: 'learn', title: '学习课程', desc: '免费学习海量热门课程', color: 'peach' },
  { id: 'app', title: '创建应用', desc: '云端环境无需配置', color: 'purple' },
  { id: 'course', title: '创建课程', desc: '优质课程轻松复用', color: 'blue' },
];

const tasks = [
  { id: 'checkin', title: '每日签到', reward: '+2 积分', done: true },
  { id: 'bind', title: '绑定腾讯云账号', reward: '+50', done: false },
];

const UserProfilePage = () => {
  const { user } = useAuth();
  const [activeSidebar, setActiveSidebar] = useState(sidebarItems[0].id);

  return (
    <div className="profile-page page-container">
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="sidebar-user">
            <img src={user?.avatar} alt={user?.username} />
            <div>
              <strong>{user?.username}</strong>
              <span>{user?.location}</span>
            </div>
          </div>
          <nav>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={activeSidebar === item.id ? 'active' : ''}
                onClick={() => setActiveSidebar(item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <button type="button" className="sidebar-settings">
            <FiSettings />
            设置
          </button>
        </aside>

        <main className="profile-main">
          <section className="data-overview">
            <div className="card stats-card">
              <h4>数据概览</h4>
              <div className="stats-grid">
                {userProfileMock.stats.map((stat) => (
                  <div key={stat.id}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="card task-card">
              <h4>完成任务送积分</h4>
              <ul>
                {tasks.map((task) => (
                  <li key={task.id}>
                    <div>
                      <strong>{task.title}</strong>
                      <span>{task.reward}</span>
                    </div>
                    <button type="button" className={task.done ? 'done' : ''}>
                      {task.done ? '已完成' : '去完成'}
                    </button>
                  </li>
                ))}
              </ul>
              <p>更多任务正在路上，敬请期待......</p>
            </div>
          </section>

          <section className="card quick-start">
            <h4>快速开始</h4>
            <div className="quick-grid">
              {quickStart.map((item) => (
                <article key={item.id} className={item.color}>
                  <FiPlus />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="card recent-section">
            <div className="section-heading">
              <h4>学习记录</h4>
              <button type="button">查看全部</button>
            </div>
            <div className="record-grid">
              {userProfileMock.courses.map((course) => (
                <article key={course.id}>
                  <img src={course.cover} alt={course.title} />
                  <div>
                    <strong>{course.title}</strong>
                    <span>最后学习时间：{course.updatedAt}</span>
                    <div className="progress-bar">
                      <span style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="card recent-section">
            <div className="section-heading">
              <h4>最近动态</h4>
              <FiCheckSquare />
            </div>
            <ul className="timeline">
              {userProfileMock.timeline.map((item) => (
                <li key={item.id}>
                  <span className="date">{item.date}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
