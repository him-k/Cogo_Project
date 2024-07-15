import React, { useState, useEffect } from 'react';
import { IcMArrowUp, IcMArrowDown, IcASave } from '@cogoport/icons-react';
import { Select } from '@cogoport/components';
import { packageTypes, handlingTypes} from './ShipmentTypes'; // Import types
// import './shipment.css'; // Adjust the CSS file name as needed
import { COMMODITY_NAME_MAPPING } from './commodities.js';
import './container.css';

const TrailerDetail = ({ onApply, eId , orr , dest ,initialData}) => {
  console.log('COMMODITY_NAME_MAPPING:', COMMODITY_NAME_MAPPING);

  const commodities = Object.keys(COMMODITY_NAME_MAPPING).map((key) => ({
    label: COMMODITY_NAME_MAPPING[key].name,
    value: key,
  }));

const initialTrailerDetails = {
  size: initialData?.size || containerSizes[0]?.label || 'Default Size',
  type: initialData?.type || containerTypes[0]?.label || 'Default Type',
  commodity: initialData?.commodity || commodities[0]?.label || 'Default Commodity',
  weight: initialData?.weight || '18 MT',
  count: initialData?.count || 1,
};

  const [details, setDetails] = useState(initialTrailerDetails);
  const [appliedDetails, setAppliedDetails] = useState(initialTrailerDetails);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    console.log('Trailer shipment details:', details);
  }, [details]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleBlur = () => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      units: prevDetails.units < 1 ? 1 : prevDetails.units,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setAppliedDetails(details);
    onApply(details, eId, orr, dest);
    setDropdownOpen(false);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <div className="Trailer-detail">
      <h2>Trailer Container Details</h2>
      <div className="current-details-box" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <p>
          <mark>
            {appliedDetails.count} x {appliedDetails.size} | {appliedDetails.type} | {appliedDetails.commodity}
          </mark>
        </p>
        <span className="dropdown-toggle">{dropdownOpen ? 'v' : '^'}</span>
      </div>
      {dropdownOpen && (
        <form onSubmit={handleSubmit} className="dropdown-form">
          <div className="form-group">
            <label htmlFor="size">Size</label>
            <div className="radio-group">
              {containerSizes.map((size) => (
                <label key={size.value}>
                  <input
                    type="radio"
                    name="size"
                    value={size.label}
                    checked={details.size === size.label}
                    onChange={handleChange}
                  />
                  {size.label}
                </label>
              ))}
            </div>
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
            <label htmlFor="commodity">Commodity</label>
            <select
              name="commodity"
              id="commodity"
              value={details.commodity}
              onChange={handleChange}
            >
              {commodities.map((commodity) => (
                <option key={commodity.value} value={commodity.label}>
                  {commodity.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="weight">Total Weight per Ctr.</label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={details.weight}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="count">Count</label>
            <input
              type="number"
              id="count"
              name="count"
              value={details.count}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <button type="submit" className="apply-button">Apply</button>
        </form>
      )}
      {showPopup && (
        <div className="popup">
          Your changes have been saved!
          </div>
      )}
    </div>
  );
};

export default TrailerDetail;