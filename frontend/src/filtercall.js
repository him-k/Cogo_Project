import React, { useState } from 'react';
import axios from 'axios';
import ShipmentFilter from './filter';
import { getShipment} from './api';

const ParentComponent = () => {
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);


  const handleFilter = async (filterData) => {
        try {
          const response = await getShipment({ ...filterData });
          setFilteredShipments(response.list);
          setFilters(filterData); // Update the filters state
        } catch (error) {
          console.error('Error fetching filtered shipments:', error);
        }
      };
  const handlePageChange = async () => {
    try {
      const response = await getShipment({ ...filters});
      setFilteredShipments(response.list);
      //setCurrentPage(page); // Update current page
    } catch (error) {
      console.error('Error fetching shipments for page:',  error);
    }
  };

  return (
    <div>
      <h2>Filter Shipments</h2>
      <ShipmentFilter onFilter={handleFilter} />
      <h3>Filtered Results</h3>
      <ul>
        {filteredShipments.map((shipment) => (
          <li key={shipment.id}>
            {shipment.origin} to {shipment.destination} on {shipment.date}
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};

export default ParentComponent;
