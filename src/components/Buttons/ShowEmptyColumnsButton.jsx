import React from 'react';

const ShowEmptyColumnsButton = ({
  showEmptyColumns,
  toggleShowEmptyColumns,
}) => {
  const handleClick = () => {
    toggleShowEmptyColumns();
  };

  return (
    <div>
      <button onClick={handleClick}>
        {showEmptyColumns ? 'Скрыть пустые столбцы' : 'Показать пустые столбцы'}
      </button>
    </div>
  );
};

export default ShowEmptyColumnsButton;
