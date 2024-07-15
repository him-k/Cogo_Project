import React,{useState} from 'react';
import { useForm, } from 'react-hook-form';
import containerTypes from './container-types.json';
import containerSizes from './container-size.json';

const ShipmentFilter = ({ onFilter }) => {
  const { register, handleSubmit ,reset} = useForm();
  const [details, setDetails] = useState({ type: '' });

  const onSubmit = (data) => {
    console.log('form data', { ...data, ...details });
    onFilter({ ...data, ...details });
  };

  const handleChange = (event) => {
    const { value } = event.target;
    const name = 'type'; // Assuming your radio input name is 'type'

    // If the clicked radio button is already selected, deselect it
    if (details.type === value) {
        setDetails({ ...details, type: '' }); // Deselect by setting type to empty string
      } else {
        setDetails({ ...details, type: value }); // Otherwise, select the clicked value
      }
    
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
      <div className="form-group">
            <label htmlFor="type">Type</label>
            <div className="radio-group">
              {containerTypes.map((type) => (
                <label key={type.value}>
                  <input
                    type="radio"
                    name="type"
                    value={type.label}
                    checked={details.type === type.label}
                    onChange={handleChange}
                  />
                  {type.label}
                </label>
              ))}
            </div>
        </div>
        <div className="form-group">
        <label htmlFor="size">Size</label>
        <select id="size" {...register('size')}>
          <option value="">Select Size</option>
          {containerSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="sort_type">Order By</label>
        <select id="sort_type" {...register('sort_type')}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <button type="submit">Apply Filter</button>
    </form>
  );
};

export default ShipmentFilter;
