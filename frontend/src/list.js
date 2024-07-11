import React, { useEffect, useState , useRef } from 'react';
import {getShipment , updateShipment, updateShipmentOptional} from './api';
import ContainerDetail from './ContainerDetail';

import './list.css'; // Create a CSS file for styling

const ViewShipments = () => {
  const [shipments, setShipments] = useState([]);
  const containerDetailRef = useRef(null); // Create a ref for the container detail section


  const handleContainerDetailsApply = async (details , shipmentId , orr , dest) => {
    console.log('Container details:', details);
    
       const shipmentData = {
        origin: orr,
        destination: dest,
        size: details.size,
        type: details.type,
        commodity: details.commodity,
        count : details.count,
        weight : details.weight
      };
      try {
        const response = await updateShipmentOptional(shipmentData , shipmentId);
        console.log('Shipment Updated:', response);
      } catch (error) {
        console.error('Error Updating shipment:', error);
      }
    
  };

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
              <td>{shipment.total_weight}</td>
              <td>{shipment.count}</td>
              <td> <div id="container-detail" className="select-async-wrapper" ref={containerDetailRef}> {/* Added ref to this div */}
          <ContainerDetail onApply={handleContainerDetailsApply} eId={shipment.id} orr={shipment.origin} dest={shipment.destination} />
        </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewShipments;