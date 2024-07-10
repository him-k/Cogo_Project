// SearchButton.js
import React from 'react';

const SearchButton = ({ onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="search-button"
    >
      Search
    </button>
  );
};

export default SearchButton;