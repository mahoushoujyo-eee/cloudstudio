import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './LikeButton.css';

const LikeButton = ({ count = 0, initialLiked = false, onToggle, size = 'md' }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [displayCount, setDisplayCount] = useState(count);

  const handleClick = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    const next = !liked;
    setLiked(next);
    setDisplayCount((prev) => prev + (next ? 1 : -1));
    onToggle?.(next);
  };

  return (
    <button type="button" className={`like-button ${size} ${liked ? 'liked' : ''}`} onClick={handleClick}>
      <span className="icon">{liked ? <FaHeart /> : <FiHeart />}</span>
      <span className="count">{displayCount}</span>
    </button>
  );
};

export default LikeButton;
