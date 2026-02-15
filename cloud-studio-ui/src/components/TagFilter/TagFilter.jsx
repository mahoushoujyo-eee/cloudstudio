import clsx from 'clsx';
import './TagFilter.css';

const TagFilter = ({ tags = [], active, onChange, multi = false }) => {
  const handleClick = (tag) => {
    if (!onChange) return;
    if (multi) {
      const isActive = active?.includes(tag);
      if (isActive) {
        onChange(active.filter((t) => t !== tag));
      } else {
        onChange([...(active || []), tag]);
      }
    } else {
      onChange(tag);
    }
  };

  return (
    <div className="tag-filter">
      {tags.map((tag) => {
        const isActive = multi ? active?.includes(tag) : active === tag;
        return (
          <button
            type="button"
            key={tag}
            onClick={() => handleClick(tag)}
            className={clsx('tag-chip', { active: isActive })}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};

export default TagFilter;
