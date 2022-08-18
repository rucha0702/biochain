import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utilities';

const Depot=()=> {
    const dispatch = useDispatch();
     let navigate = useNavigate();
      const userData = useSelector((state) => state.UserDetails.userDetails);
      const [user, setUser] = useState({
        name: userData.name,
        deliveryaddress: userData.deliveryaddress,
      });
    const userBlockchainDetails = useSelector((state)=>state.UserBlockchainDetails.userBlockchainDetails)
    console.log(userBlockchainDetails);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.accessToken}`,
        },
      };
      
      useEffect(() => {
        if (!userData.accessToken || userData.type!="Depot") {
          navigate('/login');
        }
    
        // console.log(userData.accessToken);
        // console.log(config);
        // console.log(user);
      }, [userData, navigate]);

  return (
    <div>
        <div>Depot</div>
        <div>
            {
                userBlockchainDetails.map((d)=>{
                    const data = d.data.details;
                    console.log(data)
                    return(<div>
                        <div className='d-flex'>
                            <div>{data.productId}</div>
                            <div className='mx-2'>{data.product1}</div>
                        <div className='mx-2'>{data.quantity1}</div>
                        </div>
                        <div className='d-flex'>
                        <div>{data.productId}</div>
                            <div className='mx-2'>{data.product2}</div>
                        <div className='mx-2'>{data.quantity2}</div>
                        </div>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default Depot;