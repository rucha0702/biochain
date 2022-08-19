import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utilities';
import { Link } from 'react-router-dom';
import { SetProduct } from '../../actions';

const Refinery=()=> {
    const dispatch = useDispatch();
     let navigate = useNavigate();
      const userData = useSelector((state) => state.UserDetails.userDetails);
      const [user, setUser] = useState({
        name: userData.name,
        deliveryaddress: userData.deliveryaddress,
      });
    const userBlockchainDetails = useSelector((state)=>state.UserBlockchainDetails.userBlockchainDetails);
    // const setProduct = useSelector((state)=>state.SetProduct.setProduct)
    console.log(userBlockchainDetails);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.accessToken}`,
        },
      };
      
      useEffect(() => {
        if (!userData.accessToken || userData.type!="Refinery") {
          navigate('/login');
        }
    
        // console.log(userData.accessToken);
        // console.log(config);
        // console.log(user);
      }, [userData, navigate]);

  return (
    <div>
        <div>Refinery</div>
        <table class="table">
        <thead class="thead-light">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Order ID</th>
      <th scope="col">Product(s)</th>
      <th scope="col">Quantity</th>
      <th scope="col">Action</th>
      </tr>
      </thead>
      <tbody>
            {

                
                userBlockchainDetails.map((d)=>{
                    const data = d.data.details;
                    console.log(data)
                    return(

  <tr>
      <th scope="row">1</th>
      <td>{data.productId}</td>
      <td>{data.product?data.product:data.product1 }   {data.product?"":data.product2}</td>
      <td>{`${data.quantity?data.quantity:data.quantity1}L`}   {data.quantity?"":data.quantity2}</td>
      <td><Link to="/ref/product"><button onClick={()=>{dispatch(SetProduct(d))}}>View</button></Link></td>
    </tr>
                         
                    )
                })
            }
             </tbody>
</table>
    </div>
  )
}

export default Refinery;