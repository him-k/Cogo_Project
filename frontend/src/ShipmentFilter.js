import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import containerTypes from './container-types.json';
import containerSizes from './container-size.json';
import { Radio, Select } from '@cogoport/components'; 
import SelectController from './forms/SelectController.js';
import RadioGroupController from './forms/RadioGroupController.js';

 const setType = containerTypes.map((type) => ({ label: type.label, value: type.label }));
const setSize = containerSizes.map((size) => ({ label: size.label, value: size.label }));


const ShipmentFilter = ({ onFilter }) => {
  const { register, handleSubmit,control, setValue } = useForm();
  
  const options = [
    { label: 'Descending', value: 'desc' },
    { label: 'Ascending', value: 'asc' },
  ].map(option => ({
    label: option.label,
    value: option.value
  }));


  const onSubmit = (data) => {
    onFilter(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="filter-form">
      <div className="form-group">
        <label htmlFor="origin">Origin</label>
        <input type="text" id="origin" {...register('origin')} />
      </div>
      <div className="form-group">
        <label htmlFor="destination">Destination</label>
        <input type="text" id="destination" {...register('destination')} />
      </div>
      <div className="form-group">
        <label htmlFor="start_date">Start Date</label>
        <input type="date" id="start_date" {...register('start_date')} />
      </div>
      <div className="form-group">
        <label htmlFor="end_date">End Date</label>
        <input type="date" id="end_date" {...register('end_date')} />
      </div>
      <div className="form-group" style={{ display: 'flex', marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' } }>Type</label>
        <div style={{ display: 'flex' }}>
         
              <RadioGroupController
                name={"Type"}
                // value={type.label}
                // disabled={false}
                // checked={details.type === type.label}
                // onChange={handleChange}
                control={control}
                options={setType}
                
              />
        </div>
      </div>
      <div className="form-group" style={{ display: 'flex', marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' } }> Size </label>
        <div className="radio-group" style={{ display: 'flex' }}>
              <RadioGroupController
                name="size"
                // value={size.label}
                // checked={details.size === size.label}
                // onChange={handleChange}
                control={control}
                options={setSize}
              />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="sort_type">Order By</label>
        <SelectController
          name='orderBy'
          control={control}
          options={options}
          rules={{}}
          size="md"
          
          style={{ width: '100%' }}
         /> 
       
      </div>

      <button type="submit">Apply Filter</button>
    </form>
  );
};

export default ShipmentFilter;
