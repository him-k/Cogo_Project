// SelectAsync.js
import React from 'react';
import AsyncSelect from 'react-select/async';

const SelectAsync = ({ loadOptions, onChange, value, label }) => (
  <div className="field">
    <label>{label} *</label>
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions
      onChange={onChange}
      value={value}
    />
  </div>
);

export default SelectAsync;
