import React, { useState, useRef,useEffect } from 'react'; // Added useRef for scrolling
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Changed import to include BrowserRouter as Router and Routes
import SelectAsync from './SelectAsync';
import ContainerDetail from './ContainerDetail';
import { createShipment , updateShipment } from './api';  // Import API functions
import '@cogoport/components/dist/themes/base.css';
import '@cogoport/components/dist/themes/dawn.css';
import SearchButton from './searchButton.js';
import { Select} from '@cogoport/components';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from React Router
import ViewShipments  from './list.js';
import EditShipment from './editShipment.js';
import './App.css';





const fetchOptions = async (inputValue, setOptions) => {
  try {
    const response = await axios.get('https://api.stage.cogoport.io/list_locations', {
      params: {
        filters:{
          q: inputValue
        } // Send inputValue as query parameter
      }
    });
    const locations = response.data.list.map(option => ({
      value: option.id,
      label: option.display_name,
    }));
    // console.log("locations",locations)
    setOptions(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    setOptions([]);
  }
};



const Body = () => {
   const [origin, setOrigin] = useState(null); // Changed to use useState once
  const [destination, setDestination] = useState(null); // Changed to use useState once
  const containerDetailRef = useRef(null); // Added useRef for scrolling
  const [showContainerDetail, setShowContainerDetail] = useState(false); // Changed to use useState onceainerDetail, setShowContainerDetail] = useState(false); // Manage visibility of ContainerDetail
  const [id , setId] = useState(0);
    const [options, setOptions] = useState([]);
    const[showPopup,setShowPopup]=useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  
    const handleSearch = (inputValue) => {
      console.log("inputValue",inputValue)
    fetchOptions(inputValue, setOptions);
  };
  
  const handleContainerDetailsApply = async (details , shipmentId , orr , dest) => {
   
    if (origin && destination) {
       const shipmentData = {
        origin: orr,
        destination: dest,
        size: details.size,
        type: details.type,
        commodity: details.commodity,
        count : details.count,
        weight : details.weight,
      };
      try {
        await updateShipment(shipmentData,shipmentId);
        
      } catch (error) {
        console.error('Error Updating shipment:', error);
      }
    } else {
      console.error('Origin or destination is missing.');
    }
  };

   const handleSearchClick = async () => {
    console.log(origin.label);
    if (origin && destination) {
      if (origin.label === destination.label) {
        setPopupMessage('Origin and Destination cannot be the same.');
        setShowPopup(true);
        return;
      }
      const shipmentData = {
        origin: origin.label,
        destination: destination.label,
        size: '',
        type: '',
        commodity: '',
        count: 1,
        weight: '',
      };
  
      try{
          const response = await createShipment(shipmentData);
         
          if(response==-1){
            setPopupMessage('Origin and Destination cannot be same.');
          }else{
            
          setId(response.id);
          console.log('Shipment created:', response);
          }
      }
      catch (error) {
        console.error('Error creating shipment:', error);
      }
    } else {
      console.error('Origin or destination is missing.');
    }
    setShowContainerDetail(true); // Show the ContainerDetail section on search click
    setTimeout(() => {
      containerDetailRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to container detail section on search click
    }, 100);
  };

  

   const isSearchDisabled = !origin || !destination; // Disable search button if origin or destination is not selected 
  

  //  console.log(origin);
// console.log("options",options,origin)
  return (
    
    <div className="container">

      {/* <Test></Test> */}
      <div className="location" style={{ padding: 16, width: 'fit-content' }}>
      <Select
      className="fixed-size-input" /* Apply fixed-size-input class */
        // Options={fetchOptions}
        options={options}
        
        onSearch={handleSearch}
        onChange={(v,obj)=>setOrigin(obj)}
        value={origin?.value}
        placeholder="Origin Point"
        style={{ width: '250px' }}
      />
      </div>

      <div className="location" style={{ padding: 16, width: 'fit-content' }}>
      <Select
      className="fixed-size-input" /* Apply fixed-size-input class */
        options={options}
        onSearch={handleSearch}
        onChange={(v,obj)=>setDestination(obj)}
        value={destination?.value}
        placeholder="Destination Point"
        style={{ width: '250px' }}
      />
       </div>
      <div className="search button">
        <SearchButton onClick={handleSearchClick} disabled={isSearchDisabled} /> {/* Added SearchButton */}
      </div>
      {showContainerDetail && ( // Conditionally render ContainerDetail
        <div id="container-detail" className="containerfrom" ref={containerDetailRef}> {/* Added ref to this div */}
           <ContainerDetail onApply={(details) => handleContainerDetailsApply(details, id, origin.label, destination.label)} />
        </div>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )} 
          </div>  
    
  );
};


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/view">View Shipments</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/view" element={<ViewShipments />} />
           <Route path="/edit/:id" element={<EditShipment />} />
          <Route path="/" element={<Body />} />
        </Routes>
      </div>
    </Router>
  );
};
  

export default App;