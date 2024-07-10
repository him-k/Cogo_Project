import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getShipment} from './api';
import './list.css'; // Create a CSS file for styling

const ViewShipments = () => {
  const [shipments, setShipments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await getShipment();
        setShipments(response);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      }
    };

    fetchShipments();
  }, []);

  const handleEditClick = (id) => {
    navigate(`/edit/${id}`);
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewShipments;
