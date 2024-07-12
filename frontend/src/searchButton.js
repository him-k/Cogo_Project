// SearchButton.js
import React from 'react';
import {IcMSearchdark} from '@cogoport/icons-react';


const SearchButton = ({ onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="search-button"
    >
       <IcMSearchdark />
      
      Search
    </button>
  );
};

export default SearchButton;