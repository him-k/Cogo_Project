import React, { useState, useEffect } from 'react';
import containerTypes from './container-types.json';
import containerSizes from './container-size.json';
import { COMMODITY_NAME_MAPPING } from './commodities.js';
import {IcMArrowUp,IcMArrowDown, IcASave} from '@cogoport/icons-react';
import {Radio,Select} from '@cogoport/components';
// import { useForm, Controller } from 'react-hook-form';
import './container.css';

// const commodityMapping =({input,setComi}) =>{
//   try {
// const commodities = Object.keys(COMMODITY_NAME_MAPPING).map((key) => ({
//     label: COMMODITY_NAME_MAPPING[key].name,
//     value: key,
//   })
// );
// console.log("commodities",commodities);
// setComi(commodities);
// } catch (error) {
//   setComi([]);
// }

// }
const ContainerDetail = ({ onApply , eId , orr , dest, initialData }) => {
  console.log('COMMODITY_NAME_MAPPING:', COMMODITY_NAME_MAPPING);

  
  const [comi,setComi] =useState([]);

   const handleSearch = () => {
    console.log(COMMODITY_NAME_MAPPING);
    const commodities = Object.keys(COMMODITY_NAME_MAPPING).map((key) => ({

      label: COMMODITY_NAME_MAPPING[key].name,
      value: key,
    }));
    console.log(commodities);
    setComi(commodities);
    
    console.log(comi);
  };


 const initialContainerDetails = {
    size: initialData?.size || containerSizes[0]?.label || 'Default Size',
    type: initialData?.type || containerTypes[0]?.label || 'Default Type',
    commodity: initialData?.commodity || comi[0]?.label || 'Default Commodity',
    weight: initialData?.weight || '18 MT',
    count: initialData?.count || 1,
  };

  //  const { control, handleSubmit, setValue, watch } = useForm({
  //   defaultValues: initialContainerDetails,
  // });

const [details, setDetails] = useState(initialContainerDetails);
  const [appliedDetails, setAppliedDetails] = useState(initialContainerDetails);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);



  useEffect(() => {
    if (comi.length === 0) {
      console.warn('Commodities list is empty or key is incorrect.');
    }
  }, [comi]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    console.log("selected option", selectedOption);
    if (selectedOption && selectedOption.value){
    setDetails((prevDetails) => ({
      ...prevDetails,
      commodity: selectedOption.value,
    }));
  }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppliedDetails(details);
    onApply(details , eId , orr , dest);
    setDropdownOpen(false);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide the popup after 3 seconds
  };
  const handleBlur = () => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      count: prevDetails.count < 1 ? 1 : prevDetails.count,
    }));
  };

  const onSubmit = (data) => {
    setAppliedDetails(data);
    onApply(data, eId, orr, dest);
    setDropdownOpen(false);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    


     <div className="container-detail">
      <h2>Container Details</h2>
      <div className="current-details-box" onClick={() => setDropdownOpen(!dropdownOpen)}>
       
        <p><mark>{appliedDetails.count} x {appliedDetails.size} | {appliedDetails.type} | {appliedDetails.commodity}</mark></p>
        <span className="dropdown-toggle">{dropdownOpen ?  <IcMArrowUp />: <IcMArrowDown />}</span>
        
      </div>
      {dropdownOpen && (
        <form onSubmit={handleSubmit} className="dropdown-form">
          <div className="form-group">
            <label htmlFor="size">Size</label>
            <div className="radio-group">
              {containerSizes.map((size) => (
                <label key={size.value}>
                  <Radio
                    // type="radio"
                    name="size"
                    value={size.label}
                  
                    checked={details.size === size.label}
                    onChange={handleChange}
                  />
                  {size.label}
                   {/* <Controller
                    name="size"
                    control={control}
                    render={({ field }) => (
                      <Radio
                        {...field}
                        value={size.label}
                        checked={field.value === size.label}
                      />
                    )}
                  /> */}
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
                  <Radio
                    // type="radio"
                    name="type"
                    value={type.label}
                    disabled={false}
                    
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
            {/* <Select
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
            </Select> */}
            <Select
              name="commodity"
              id="commodity"
              value={comi.find(option => option.value === details.commodity) || null}

              onSearch={handleSearch}
              onChange={handleSelectChange}
              options={comi}
              placeholder="commodity"
              style={{width:'250px'}}
            />
            
          </div>

          <div className="form-group">
            <label htmlFor="weight">Total Weight </label>
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
          <button type="submit" className="apply-button"><IcASave /> Apply</button>

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

export default ContainerDetail;