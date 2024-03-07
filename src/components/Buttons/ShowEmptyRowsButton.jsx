import React from 'react';

const ShowEmptyRowsButton = ({ showEmptyRows, toggleShowEmptyRows }) => {
  const handleClick = () => {
    toggleShowEmptyRows();
  };

  return (
    <div>
      <button onClick={handleClick}>
        {showEmptyRows ? 'Скрыть пустые строки' : 'Показать пустые строки'}
      </button>
    </div>
  );
};

export default ShowEmptyRowsButton;
