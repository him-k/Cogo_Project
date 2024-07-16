

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShipment, deleteShipment } from './api';
import ShipmentFilter from './ShipmentFilter';
import ParentComponent from './filtercall';
import './list.css'; // Create a CSS file for styling

const ViewShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  
  const navigate = useNavigate();

  
  const fetchShipments = async (filters={} ) => {
    try {
      const response = await getShipment({ ...filters });
      console.log("filter response",response);
      const shipmentsArray = Array.isArray(response) ? response : [];
      console.log("shipmentsArray",shipmentsArray);
      // Sort the array
      const sortedShipments = shipmentsArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      console.log("sortedShipments",sortedShipments);
      // setShipments(sortedShipments);
      // console.log("shimpents",shipments);
      
      setFilteredShipments(sortedShipments);
      console.log("filteredShipments",filteredShipments);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
    
  };

  useEffect(() => {
    fetchShipments(currentPage);
  }, [currentPage]);

  const handleDeleteClick = async (id) => {
    console.log("deid",id);
    try {
      await deleteShipment(id);
      fetchShipments(currentPage); // Re-fetch shipments after deletion
    } catch (error) {
      console.error('Error deleting shipment:', error);
    }
  };

  const handleEditClick = (id) => {
    console.log("idh",id);
    navigate(`/edit/${id}`);
    
  };

  const handleFilter = (filters) => {
    
    fetchShipments(filters);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="view-shipments">
      <h1>Shipments</h1>
      <ShipmentFilter onFilter={handleFilter} />
      <table>
        <thead>
          <tr>
            <th>Shipment ID</th>
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
          {filteredShipments && filteredShipments.map((shipment) => (
            
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
