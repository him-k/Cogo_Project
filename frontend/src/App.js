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
import React, { useState } from 'react';
import SelectAsync from './SelectAsync';
import ContainerDetail from './ContainerDetail';
import { createShipment } from './api';  // Import API functions
import { locations } from './data';
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

const App = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

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
        console.log('Shipment created:', response);
      } catch (error) {
        console.error('Error creating shipment:', error);
      }
    } else {
      console.error('Origin or destination is missing.');
    }
  };

  return (
    <div className="container">
      <SelectAsync
        loadOptions={fetchOptions}
        onChange={setOrigin}
        value={origin}
        label="Origin Point"
      />
      <SelectAsync
        loadOptions={fetchOptions}
        onChange={setDestination}
        value={destination}
        label="Destination Point"
      />
      
      <h1>Container Booking</h1>
      <ContainerDetail onApply={handleContainerDetailsApply} />
    </div>
  );
};

export default App;
