import { FiSearch } from 'react-icons/fi';
import { useAppContext } from '../../contexts/AppContext.jsx';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut.js';
import './SearchBox.css';

const SearchBox = ({ placeholder = '按下 / 搜索', className = '' }) => {
  const { globalSearch, setGlobalSearch, globalSearchRef } = useAppContext();

  useKeyboardShortcut('/', () => {
    if (globalSearchRef.current) {
      globalSearchRef.current.focus();
    }
  });

  return (
    <label className={`search-box ${className}`}>
      <FiSearch className="search-icon" />
      <input
        ref={globalSearchRef}
        type="text"
        value={globalSearch}
        onChange={(e) => setGlobalSearch(e.target.value)}
        placeholder={placeholder}
      />
      <span className="shortcut">/</span>
    </label>
  );
};

export default SearchBox;
