import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiPlusCircle,
  FiFileText,
  FiUser,
  FiBookOpen,
  FiGrid,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';
import SearchBox from '../SearchBox/SearchBox.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Header.css';

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/market', label: '应用广场' },
  { to: '/learn', label: '学习中心' },
  { to: '/templates', label: '模板中心' },
];

const menuItems = [
  { id: 'space', label: '个人中心', icon: <FiUser />, to: '/profile/me' },
  { id: 'settings', label: '设置', icon: <FiSettings />, to: '/settings' },
];

const Header = () => {
  const { isAuthenticated, openAuthModal, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTimer = useRef(null);
  const navigate = useNavigate();
  const avatar = user?.avatar || 'https://i.pravatar.cc/120?img=15';

  const openMenu = () => {
    if (menuTimer.current) {
      clearTimeout(menuTimer.current);
      menuTimer.current = null;
    }
    setMenuOpen(true);
  };

  const closeMenu = () => {
    menuTimer.current = setTimeout(() => {
      setMenuOpen(false);
    }, 120);
  };

  useEffect(
    () => () => {
      if (menuTimer.current) {
        clearTimeout(menuTimer.current);
      }
    },
    [],
  );

  return (
    <header className="app-header">
      <div className="brand">
        <div className="logo-mark">CS</div>
        <div className="brand-text">
          <strong>Cloud Studio</strong>
          <span>学·教·练一体化</span>
        </div>
      </div>
      <nav className="primary-nav">
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <SearchBox />
        <button type="button" className="icon-btn" aria-label="学习文档">
          <FiFileText />
        </button>
        {isAuthenticated ? (
          <div className="user-menu" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
            <button type="button" className="avatar-btn">
              <img src={avatar} alt={user?.username || 'Cloud Studio User'} />
            </button>
            {menuOpen && (
              <div className="dropdown" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
                <div className="dropdown-profile">
                  <img src={avatar} alt={user?.username || 'Cloud Studio User'} />
                  <strong>{user?.username}</strong>
                  <span className="user-id">ID: {user?.id || 'CS-0001'}</span>
                </div>
                <div className="resource-card">
                  <div className="resource-head">
                    <div>
                      <strong>算力资源包使用情况</strong>
                      <p>已用 0.17 / 52 机时</p>
                    </div>
                    <a href="#">购买资源包</a>
                  </div>
                  <div className="progress-bar">
                    <span style={{ width: '1%' }} />
                  </div>
                  <span className="resource-percent">0%</span>
                </div>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      navigate(item.to);
                      setMenuOpen(false);
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <hr />
                <button type="button" className="logout" onClick={logout}>
                  <FiLogOut />
                  退出登录
                </button>
              </div>
            )}
          </div>
        ) : (
          <button type="button" className="primary" onClick={openAuthModal}>
            <FiPlusCircle />
            注册登录
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
