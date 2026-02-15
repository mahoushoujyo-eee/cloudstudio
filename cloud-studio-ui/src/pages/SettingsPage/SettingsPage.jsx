import { useState } from 'react';
import './SettingsPage.css';

const menu = ['基本资料', '安全设置', '隐私设置', '通知设置', '账号绑定'];

const SettingsPage = () => {
  const [active, setActive] = useState(menu[0]);

  return (
    <div className="settings-page page-container">
      <aside className="settings-menu">
        {menu.map((item) => (
          <button key={item} type="button" className={active === item ? 'active' : ''} onClick={() => setActive(item)}>
            {item}
          </button>
        ))}
      </aside>
      <section className="settings-content">
        {active === '基本资料' && (
          <form className="settings-form">
            <label>
              头像
              <input type="file" />
            </label>
            <label>
              用户名
              <input type="text" defaultValue="Cloud Learner" />
            </label>
            <label>
              个性签名
              <textarea defaultValue="热爱 AI 开发与分享。" />
            </label>
            <label>
              地理位置
              <select defaultValue="深圳">
                <option>深圳</option>
                <option>北京</option>
                <option>上海</option>
              </select>
            </label>
            <div className="form-actions">
              <button type="submit">保存</button>
            </div>
          </form>
        )}
        {active === '安全设置' && (
          <div className="settings-list">
            <div>
              <strong>修改密码</strong>
              <p>建议定期更新密码，增强账号安全。</p>
              <button type="button">去设置</button>
            </div>
            <div>
              <strong>手机号绑定</strong>
              <p>188****8888</p>
              <button type="button">更换</button>
            </div>
            <div>
              <strong>邮箱绑定</strong>
              <p>learner@cloud.com</p>
              <button type="button">更换</button>
            </div>
            <div>
              <strong>二次验证</strong>
              <p>未开启</p>
              <button type="button">立即开启</button>
            </div>
          </div>
        )}
        {active === '隐私设置' && (
          <div className="settings-list">
            <label>
              <input type="checkbox" defaultChecked />
              公开我的学习记录
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              允许他人复刻我的应用
            </label>
            <label>
              <input type="checkbox" />
              接收陌生人私信
            </label>
          </div>
        )}
        {active === '通知设置' && (
          <div className="settings-list">
            <label>
              <input type="checkbox" defaultChecked />
              系统通知
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              评论通知
            </label>
            <label>
              <input type="checkbox" />
              点赞通知
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              复刻通知
            </label>
          </div>
        )}
        {active === '账号绑定' && (
          <div className="settings-list">
            <div>
              <strong>微信</strong>
              <p>已绑定</p>
              <button type="button">解绑</button>
            </div>
            <div>
              <strong>GitHub</strong>
              <p>未绑定</p>
              <button type="button">去绑定</button>
            </div>
            <div>
              <strong>CODING</strong>
              <p>已绑定</p>
              <button type="button">解绑</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SettingsPage;
