// // App.js
// import React from 'react';
// import SelectAsync from './SelectAsync';
// import ContainerDetail from './ContainerDetail.js';
// import SearchButton from './searchButton.js';
// import { locations } from './data';
// import { createShipment} from './api';
// import './App.css';

// // Simulated API call to fetch options based on input value
// const fetchOptions = (inputValue) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(
//         locations
//           .filter((option) =>
//             option.display_name.toLowerCase().includes(inputValue.toLowerCase())
//           )
//           .map((option) => ({
//             value: option.id,
//             label: option.display_name,
//           }))
//       );
//     }, 1000);
//   });
// };

// const App = () => {
//   const [origin, setOrigin] = React.useState(null);
//   const [destination, setDestination] = React.useState(null);
//   const [shipmentDetails, setShipmentDetails] = React.useState(null);
// // Handler for creating a shipment

// const handleContainerDetailsApply = async (details) => {
//   console.log('Container details:', details);
//   setShipmentDetails(details);
//   try {
//     const response = await createShipment({
//       origin: origin?.label,
//       destination: destination?.label,
//       ...details,
//     });
//     console.log('Shipment created:', response);
//   } catch (error) {
//     console.error('Error creating shipment:', error);
//   }
// };

      
// return (
//   <div className="container">
//     <SelectAsync
//       loadOptions={fetchOptions}
//       onChange={setOrigin}
//       value={origin}
//       label="Origin Point"
//     />
//     <SelectAsync
//       loadOptions={fetchOptions}
//       onChange={setDestination}
//       value={destination}
//       label="Destination Point"
//     />
    
//     <h1>Container Booking</h1>
//     <ContainerDetail onApply={handleContainerDetailsApply} />
//   </div>
// );
// };

// export default App;

// App.js
import React, { useState, useRef } from 'react'; // Added useRef for scrolling
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Changed import to include BrowserRouter as Router and Routes
import SelectAsync from './SelectAsync';
import ContainerDetail from './ContainerDetail';
import { createShipment } from './api';  // Import API functions
import { locations } from './data';
import SearchButton from './searchButton.js';
import ViewButton from './ViewButton'; // Import ViewButton component
import { Link } from 'react-router-dom'; // Import Link from React Router
import ViewShipments  from './list.js';
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

const Body = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const containerDetailRef = useRef(null); // Create a ref for the container detail section
   const [showContainerDetail, setShowContainerDetail] = useState(false); // Manage visibility of ContainerDetail
  

  const handleContainerDetailsApply = async (details) => {
    console.log('Container details:', details);
    if (origin && destination) {
      const shipmentData = {
        origin: origin.label,
        destination: destination.label,
        size: details.size,
        type: details.type,
        commodity: details.commodity
      };
      try {
        const response = await createShipment(shipmentData);
       
       
        
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
      <div className="location">
      <SelectAsync
      className="fixed-size-input" /* Apply fixed-size-input class */
        loadOptions={fetchOptions}
        onChange={setOrigin}
        value={origin}
        label="Origin Point"
      />
      </div>

      <div className="location">
      <SelectAsync
      className="fixed-size-input" /* Apply fixed-size-input class */
        loadOptions={fetchOptions}
        onChange={setDestination}
        value={destination}
        label="Destination Point"
      />
       </div>
      <div className="search button">
        <SearchButton onClick={handleSearchClick} disabled={isSearchDisabled} /> {/* Added SearchButton */}
      </div>
      {showContainerDetail && ( // Conditionally render ContainerDetail
        <div id="container-detail" className="containerfrom" ref={containerDetailRef}> {/* Added ref to this div */}
          <ContainerDetail onApply={handleContainerDetailsApply} />
        </div>
      )}
          </div>  
    
  );
};

const Header = () => {
  return (
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
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/view" element={<ViewShipments />} />
          <Route path="/" element={<Body />} />
        </Routes>
      </div>
    </Router>
  );
};

  

export default App;
