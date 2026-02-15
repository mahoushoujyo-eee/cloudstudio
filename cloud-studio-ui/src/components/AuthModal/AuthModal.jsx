import { useEffect, useMemo, useState } from 'react';
import { FiX, FiGithub, FiCloud, FiEye } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './AuthModal.css';

const providers = [
  { id: 'tencent', label: '腾讯云', icon: <FiCloud /> },
  { id: 'coding', label: 'CODING', icon: <FiEye /> },
  { id: 'github', label: 'GitHub', icon: <FiGithub /> },
];

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const [qrSeed, setQrSeed] = useState(Date.now());

  useEffect(() => {
    if (!isAuthModalOpen) return undefined;
    const timer = setInterval(() => {
      setQrSeed(Date.now());
    }, 120000);
    return () => clearInterval(timer);
  }, [isAuthModalOpen]);

  const qrSrc = useMemo(
    () => `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=cloudstudio-${qrSeed}`,
    [qrSeed],
  );

  if (!isAuthModalOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-btn" onClick={closeAuthModal} aria-label="关闭登录弹窗">
          <FiX />
        </button>
        <div className="auth-left">
          <div className="ring" />
          <div className="brand-block">
            <div className="logo">CS</div>
            <h3>Cloud Studio</h3>
            <p>云｜端｜开｜发 · 化｜繁｜为｜简</p>
          </div>
        </div>
        <div className="auth-right">
          <h3>欢迎登录</h3>
          <div className="qr-block">
            <img src={qrSrc} alt="扫码登录" />
            <p>使用微信扫一扫登录</p>
          </div>
          <div className="divider">
            <span>其他登录方式</span>
          </div>
          <div className="provider-list">
            {providers.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => login({ username: `${provider.label} 用户` })}
              >
                {provider.icon}
                {provider.label}
              </button>
            ))}
          </div>
          <p className="terms">
            登录即表示同意我们的
            <a href="#">《服务条款》</a>
            和
            <a href="#">《隐私协议》</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
