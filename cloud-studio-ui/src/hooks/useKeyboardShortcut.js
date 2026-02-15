import { useEffect } from 'react';

const useKeyboardShortcut = (targetKey, handler) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.key === targetKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault();
        handler(event);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handler, targetKey]);
};

export default useKeyboardShortcut;
