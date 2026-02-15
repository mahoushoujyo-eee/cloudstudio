import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'cs_access_token';
const USER_KEY = 'cs_user_profile';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const persist = (nextUser, token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    }
  };

  const clearPersist = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const login = async (credentials = {}) => {
    const fakeToken = `token-${Date.now()}`;
    const fakeUser = {
      id: 'user-001',
      username: credentials.username || 'Cloud Learner',
      avatar: credentials.avatar || 'https://i.pravatar.cc/120?img=15',
      email: 'learner@cloudstudio.dev',
      location: '深圳',
      bio: '热爱 AI 应用开发，分享学习心得。',
    };
    persist(fakeUser, fakeToken);
    setAccessToken(fakeToken);
    setUser(fakeUser);
    setAuthModalOpen(false);
    return fakeUser;
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    clearPersist();
  };

  const updateProfile = (data) => {
    setUser((prev) => {
      const next = { ...prev, ...data };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const checkAuth = useCallback(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateProfile,
      checkAuth,
      isAuthModalOpen,
      openAuthModal: () => setAuthModalOpen(true),
      closeAuthModal: () => setAuthModalOpen(false),
    }),
    [user, accessToken, loading, isAuthModalOpen],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
