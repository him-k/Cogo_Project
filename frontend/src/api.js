import axios from 'axios';

const api_url='http://localhost:8000';

export const createShipment=async(data)=>{
    const response=await axios.post(`${api_url}/shipments/`,data);
        return response.data;
};

export const getShipmentById=async(shipmentId)=>{
    const response=await axios.get(`${api_url}/shipments/${shipmentId}`);
        return response.data;
};

export const getShipment=async()=>{
    const response=await axios.get(`${api_url}/shipments/`);
        return response.data;
};


export const updateShipment=async(data , id)=>{
    const response=await axios.put(`${api_url}/shipments/${id}`,data);
        return response.data;
};
export const deleteShipment = async(id)=>{
    const response = await axios.delete(`${api_url}/delete_shipment/${id}`);
    return response.data;
};
