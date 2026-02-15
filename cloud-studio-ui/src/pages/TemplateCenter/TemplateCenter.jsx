import { useState } from 'react';
import TagFilter from '../../components/TagFilter/TagFilter.jsx';
import TemplateCard from '../../components/TemplateCard/TemplateCard.jsx';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import { templateGallery, templateTabs } from '../../data/mockData.js';
import './TemplateCenter.css';

const TemplateCenter = () => {
  const [tab, setTab] = useState('all');

  const filtered = templateGallery.filter((tpl) => tab === 'all' || tpl.category === tab);

  return (
    <div className="template-page page-container">
      <section className="section-block">
        <SectionHeader title="模板中心" subtitle="语言环境、AI 模板、全栈应用统一在此" hideAction />
        <div className="tab-nav">
          {templateTabs.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? 'active' : ''}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="template-grid">
          {filtered.map((tpl) => (
            <TemplateCard key={tpl.id} {...tpl} />
          ))}
        </div>
        <div className="load-more">
          <button type="button">加载更多</button>
        </div>
      </section>
    </div>
  );
};

export default TemplateCenter;
