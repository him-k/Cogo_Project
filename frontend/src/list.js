// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {getShipment , deleteShipment} from './api';
// import './list.css'; // Create a CSS file for styling

// const ViewShipments = () => {
//   const [shipments, setShipments] = useState([]);
  
//   const navigate = useNavigate();
//   const fetchShipments = async () => {
//     try {
//       const response = await getShipment();
//       setShipments(response);
//     } catch (error) {
//       console.error('Error fetching shipments:', error);
//     }
//   };

//   useEffect(() => {
   
//     fetchShipments();
//   }, []);

//   const handleDeleteClick = async (id) => {
//     try {
//       await deleteShipment(id);
//       setShipments((prevShipments) => prevShipments.filter((shipment) => shipment.id !== id));
//       fetchShipments();
//     } catch (error) {
//       console.error('Error deleting shipment:', error);
//     }
//   };

//   const handleEditClick = (id) => {
//     navigate(`/edit/${id}`);
//   };

//   return (
//     <div className="view-shipments">
//       <h1>Shipments</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Origin</th>
//             <th>Destination</th>
//             <th>Size</th>
//             <th>Type</th>
//             <th>Commodity</th>
//             <th>Total Weight</th>
//             <th>Count</th>
//             <th>Edit</th>
//           </tr>
//         </thead>
//         <tbody>
//           {shipments.map((shipment) => (
//             <tr key={shipment.id}>
//               <td>{shipment.id}</td>
//               <td>{shipment.origin}</td>
//               <td>{shipment.destination}</td>
//               <td>{shipment.size}</td>
//               <td>{shipment.type}</td>
//               <td>{shipment.commodity}</td>
//               <td>{shipment.weight}</td>
//               <td>{shipment.count}</td>
//               <td>
//                 <button onClick={() => handleEditClick(shipment.id)}>Edit</button>
//               </td>
//               <td>
//                 <button onClick={() => handleDeleteClick(shipment.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ViewShipments;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShipment, deleteShipment } from './api';
import './list.css'; // Create a CSS file for styling

const ViewShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  
  const navigate = useNavigate();

  const fetchShipments = async (page) => {
    try {
      const response = await getShipment(page);
      setShipments(response);
      // setTotalPages(response.totalPages); // Assuming the API returns total pages
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
  };

  useEffect(() => {
    fetchShipments(currentPage);
  }, [currentPage]);

  const handleDeleteClick = async (id) => {
    try {
      await deleteShipment(id);
      fetchShipments(currentPage); // Re-fetch shipments after deletion
    } catch (error) {
      console.error('Error deleting shipment:', error);
    }
  };

  const handleEditClick = (id) => {
    navigate(`/edit/${id}`);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="view-shipments">
      <h1>Shipments</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Size</th>
            <th>Type</th>
            <th>Commodity</th>
            <th>Total Weight</th>
            <th>Count</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment.id}>
              <td>{shipment.id}</td>
              <td>{shipment.origin}</td>
              <td>{shipment.destination}</td>
              <td>{shipment.size}</td>
              <td>{shipment.type}</td>
              <td>{shipment.commodity}</td>
              <td>{shipment.weight}</td>
              <td>{shipment.count}</td>
              <td>
                <button onClick={() => handleEditClick(shipment.id)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteClick(shipment.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageClick(index + 1)}
            className={index + 1 === currentPage ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewShipments;
