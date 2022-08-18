import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utilities';

const BiomassUnit=()=> {

    const dispatch = useDispatch();
     let navigate = useNavigate();
      const userData = useSelector((state) => state.UserDetails.userDetails);
      const [user, setUser] = useState({
        name: userData.name,
        deliveryaddress: userData.deliveryaddress,
      });

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.accessToken}`,
        },
      };
      
      useEffect(() => {
        if (!userData.accessToken || userData.type!="Biomass Unit") {
          navigate('/login');
        }
    
        // console.log(userData.accessToken);
        // console.log(config);
        // console.log(user);
      }, [userData, navigate]);

  return (
    <div>BiomassUnit</div>
  )
}

export default BiomassUnit