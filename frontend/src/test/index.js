import {Select} from '@cogoport/components'
import {useEffect, useState} from 'react'
import axios from 'axios';
const Test=()=>{

    const [location, setLocation]=useState([]);

    
const fetchOptions = async () => {
//   console.log("inputValue",inputValue);
  try{
    const response = await axios.get('https://api.stage.cogoport.io/list_locations')
    //   params: {
    //     query: inputValue // Send inputValue as query parameter
    //   }

    console.log("response",response);
    }catch (error) {
            console.error('Error fetching locations:', error);
            return [];
     }
};

// useEffect(()=>{
//     fetchOptions()
// })

    return (
        <div>
           
        </div>
    )
}

export default Test;