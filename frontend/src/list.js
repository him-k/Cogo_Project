import React, { useEffect, useState } from 'react';
import {getShipment,deleteShipment } from './api';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@cogoport/components';


import './list.css'; // Create a CSS file for styling

const ViewShipments = () => {
  const [shipments, setShipments] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [currentPage1, setCurrentPage1] = useState(1);
const onPageChange1 = (pageNumber) => {
	setCurrentPage1(pageNumber);
};
  
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
    fetchShipments(currentPage1);
  }, [currentPage1]);

  const handleDeleteClick = async (id) => {
    try {
      await deleteShipment(id);
      fetchShipments(currentPage1); // Re-fetch shipments after deletion
    } catch (error) {
      console.error('Error deleting shipment:', error);
    }
  };

  const handleEditClick = (id) => {
    navigate(`/edit/${id}`);
  };

  // const handlePageClick = (page) => {
  //   setCurrentPage(page);
  // };

  return (
    <div className="view-shipments">
      <h1>Shipments</h1>
      <table>
        <thead>
          <tr>
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

      {/* <Table columns={columns} data={data} />
      const columns = [
	{ Header: 'Origin', accessor: 'origin' },
	{ Header: 'Last Name', accessor: 'lastName' },
]; */}
       <Pagination
	type="compact"
	currentPage={currentPage1}
	totalItems={1000}
	pageSize={5}
	onPageChange={onPageChange1}
/>
      
    </div>
  );
};

export default ViewShipments;