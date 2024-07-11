import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShipmentById, updateShipment } from './api';
import ContainerDetail from './ContainerDetail';
import './editShipment.css';
const EditShipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const response = await getShipmentById(id);
        setShipment(response);
      } catch (error) {
        console.error('Error fetching shipment:', error);
      }
    };

    fetchShipment();
  }, [id]);

  const handleContainerDetailsApply = async (details,shipmentId,orr,dest) => {
    console.log('Container details:', details);
    if (orr && dest) {
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
        const response = await updateShipment(shipmentData , shipmentId);
        console.log('Shipment Updated:', response);
      } catch (error) {
        console.error('Error Updating shipment:', error);
      }
    } else {
      console.error('Origin or destination is missing.');
    }
  }
  
  
  
  if (!shipment) return <div>Loading...</div>;

  return (
    <div className="edit-shipment">
      <h1>Edit Container Details</h1>
      <div className="shipment-box">
        <div className="shipment-box-item">
          <div className="box-label">Origin :</div>
          <div className="box-value">{shipment.origin}</div>
        </div>
      </div>
        <div className="shipment-box">
        <div className="shipment-box-item">
          <div className="box-label">Destination :</div>
          <div className="box-value">{shipment.destination}</div>
        </div>
      </div>
      <ContainerDetail onApply={(details) => handleContainerDetailsApply(details, id, shipment.origin, shipment.destination)} 
        initialData={shipment}
      />

    </div>
  );
};

export default EditShipment;
