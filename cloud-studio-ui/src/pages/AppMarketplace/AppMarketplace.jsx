import { useState } from 'react';
import TagFilter from '../../components/TagFilter/TagFilter.jsx';
import AppCard from '../../components/AppCard/AppCard.jsx';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import { applications, appTags, creatorHighlights } from '../../data/mockData.js';
import './AppMarketplace.css';

const topics = ['全部', 'ComfyUI', 'AI 应用', '零撸起手工作流', '万物皆可 CS', 'Coding 挑战赛'];

const AppMarketplace = () => {
  const [tag, setTag] = useState(appTags[0]);
  const [topic, setTopic] = useState(topics[0]);

  return (
    <div className="market-page page-container">
      <section className="section-block">
        <SectionHeader title="近期热门" subtitle="热门应用一键复刻，灵感随时获取" hideAction />
        <div className="market-filters">
          <TagFilter tags={appTags} active={tag} onChange={setTag} />
          <TagFilter tags={topics} active={topic} onChange={setTopic} />
        </div>
        <div className="app-list">
          {applications.map((app) => (
            <AppCard key={app.id} {...app} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="自媒体优质内容" subtitle="灵感创作者的精选分享" />
        <div className="content-showcase">
          <div className="content-card">
            <span>专题 · ComfyUI</span>
            <h4>ComfyUI 技巧集：更高效的图像工作流</h4>
            <p>精选 10+ 生产力插件与节点案例，助你更快交付创意。</p>
            <button type="button">我要投稿</button>
          </div>
          <div className="content-card">
            <span>专题 · AI 应用</span>
            <h4>AI 视频创作者的灵感库</h4>
            <p>60 秒内完成脚本生成、配音、视频剪辑的全流程。</p>
            <button type="button">立即查看</button>
          </div>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="11 月金牌制作者" subtitle="优秀创作者榜单" hideAction />
        <div className="creator-grid">
          {creatorHighlights.map((creator) => (
            <div key={creator.id} className="creator-card">
              <img src={creator.avatar} alt={creator.name} />
              <strong>{creator.name}</strong>
              <p>{creator.bio}</p>
              <div className="creator-tags">
                {creator.tags.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AppMarketplace;
