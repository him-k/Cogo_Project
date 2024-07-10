import axios from 'axios';

const api_url='http://localhost:8000';

export const createShipment=async(data)=>{
    const response=await axios.post(`${api_url}/shipments/`,data);
        return response.data;
};

export const getShipment=async()=>{
    const response=await axios.get(`${api_url}/shipments/`);
        return response.data;
};
