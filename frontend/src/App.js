import React, { useState,useRef} from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import SelectAsync from './SelectAsync';
import ContainerDetail from './ContainerDetail';
import { createShipment } from './api';  // Import API functions
import { locations } from './data';
import ViewShipments from'./list';
import SearchButton from './searchButton.js';
import './App.css';

const fetchOptions = (inputValue) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        locations
          .filter((option) =>
            option.display_name.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((option) => ({
            value: option.id,
            label: option.display_name,
          }))
      );
    }, 1000);
  });
};

const Home = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const containerDetailRef = useRef(null);
  const [showContainerDetail, setShowContainerDetail] = useState(false);

  const handleContainerDetailsApply = async (details) => {
    console.log('Container details:', details);
    if (origin && destination) {
      const shipmentData = {
        origin: origin.label,
        destination: destination.label,
        size: details.size,
        type: details.type,
        commodity: details.commodity,
        weight: details.weight,
        count: details.count,
      };
      try {
        const response = await createShipment(shipmentData);
        console.log('Shipment created:', response);
      } catch (error) {
        console.error('Error creating shipment:', error);
      }
    } else {
      console.error('Origin or destination is missing.');
    }
  };

  const handleSearchClick = () => {
    setShowContainerDetail(true); // Show the ContainerDetail section on search click
    setTimeout(() => {
      containerDetailRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to container detail section on search click
    }, 100);
  };

  const isSearchDisabled = !origin || !destination; // Disable search button if origin or destination is not selected



  return (
    <div className="container">
      <div className="select-async-wrapper">
      <SelectAsync
        loadOptions={fetchOptions}
        onChange={setOrigin}
        value={origin}
        label="Origin Point"
      />
      </div>

      <div className="select-async-wrapper">
      <SelectAsync
        loadOptions={fetchOptions}
        onChange={setDestination}
        value={destination}
        label="Destination Point"
      />
       </div>
      <div className="select-async-wrapper">
        <SearchButton onClick={handleSearchClick} disabled={isSearchDisabled} /> {/* Added SearchButton */}
      </div>
      {showContainerDetail && ( // Conditionally render ContainerDetail
        <div id="container-detail" className="select-async-wrapper" ref={containerDetailRef}> {/* Added ref to this div */}
          <ContainerDetail onApply={handleContainerDetailsApply} />
        </div>
      )}
   
      
      
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="container">
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
        <Routes>
          <Route path="/view" element={<ViewShipments />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};


export default App;