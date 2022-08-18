import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utilities';
import { Link } from 'react-router-dom';

const DepotProduct=()=> {
    const dispatch = useDispatch();
     let navigate = useNavigate();
      const userData = useSelector((state) => state.UserDetails.userDetails);
      const productDetails = useSelector((state)=>state.SetProduct.setProduct);
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
        <div>DepotProduct</div>
        <ul class="list-group">
  <li class="list-group-item disabled">Order ID : {productDetails.data.details.productId}</li>
  <li class="list-group-item">Sender: {productDetails.data.details.senderType}-{productDetails.data.details.sender}</li>
  <li class="list-group-item">Receiver: {productDetails.data.details.receiverType}-{productDetails.data.details.receiver}</li>
  <li class="list-group-item">Porta ac consectetur ac</li>
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
    </div>
  )
}

export default DepotProduct;