import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utilities';
import { Link } from 'react-router-dom';
import { SetProduct, AvailableProduct,FlagValue } from '../../actions';
import moment from "moment";
import styles from './Depot.module.css';


const Depot = () => {
  let count = 0;
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const userData = useSelector((state) => state.UserDetails.userDetails);
  const availableProduct = useSelector((state) => state.AvailableProduct.availableProduct);
  const [available, setAvailable] = useState(availableProduct.bioethanol ? availableProduct : { bioethanol: 10000, biodiesel: 8000, ethanol: 100, petroleum: 500 });
  const [user, setUser] = useState({
    name: userData.name,
    deliveryaddress: userData.deliveryaddress,
  });
  const userBlockchainDetails = useSelector((state) => state.UserBlockchainDetails.userBlockchainDetails);
  // const setProduct = useSelector((state)=>state.SetProduct.setProduct)
  console.log(userBlockchainDetails);
  const flagValue = useSelector((state)=>state.FlagValue.flagValue);
    const [flag,setFlag] = useState(flagValue?flagValue:0);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.accessToken}`,
    },
  };

  useEffect(() => {
    if (!userData.accessToken || userData.type != "Depot") {
      navigate('/login');
    }

    // console.log(userData.accessToken);
    // console.log(config);
    // console.log(user);
  }, [userData, navigate]);

  // useEffect(() => {
  //   dispatch(AvailableProduct(available));
  // })

  useEffect(()=>{
    const arr = userBlockchainDetails.reverse();
    for(const d in arr){
      console.log("arr",arr);
      const data = arr[d].data.details;
      console.log("pplp",data);
      console.log('userData',userData);
      console.log("first")
      if (data.senderType == userData.type) {
        if(data.availableBioEth){

            if(flag!=1)
            {
             setFlag(1);
             dispatch(FlagValue(1));

             console.log("here,",data.availableEth)
            
            //   const av = {bioethanol:data.availableEth,biodiesel:data.availableDsl}
              // console.log("in",available)
              // dispatch(AvailableProduct({bioethanol:data.availableEth, biodiesel:data.availableDsl}));
              dispatch(AvailableProduct({bioethanol:data.availableBioEth,biodiesel:data.availableDsl,ethanol:data.availableEth,petroleum:data.availablePet}));
              window.location.reload(false);
            }
        }
  }}},[userBlockchainDetails])
  return (
    <div>
      <div>Depot</div>

      <h4>Avaibility:</h4>
      <h2>BIOETHANOL: {availableProduct.bioethanol}</h2>
      <h2>BIODIESEL: {availableProduct.biodiesel}</h2>
      <h2>ETHANOL: {availableProduct.ethanol}</h2>
      <h2>PETROLEUM: {availableProduct.petroleum}</h2>


      <table className="table">
        <div>Incoming Consignments</div>
        <thead className="thead-light">
          <tr className='m-3'>
            <th scope="col">#</th>
            <th scope="col-sm">Order ID</th>
            <th scope="col">From</th>
            <th scope="col">Product(s)</th>
            <th scope="col">Quantity</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {


            userBlockchainDetails.map((d,i) => {
              const data = d.data.details;
              console.log(data)
              if (data.senderType != userData.type) {
                count = count + 1;

                return (

                  <tr key={i} className={`${styles.dashboardRows}`}>
                    <th scope="row">{count}</th>
                    <td>
                      <div className='d-flex flex-column align-items-start'>
                        <div>
                          {data.productId}
                        </div>
                        <div className='small'>{moment(d.message.confirmed).utc().format('DD-MM-YYYY')}</div>
                      </div>
                    </td>
                    <td>
                      <div className='small text-primary'>{data.senderType}</div>
                      <div>{data.senderName}</div>
                    </td>
                    <td>{data.product ? data.product : data.product1}   {data.product ? "" : data.product2}</td>
                    <td>{`${data.quantity ? data.quantity : data.quantity1}L`}   {data.quantity ? "" : data.quantity2}</td>
                    <td><Link to="/dep/product"><button onClick={() => { dispatch(SetProduct(d)) }}>View</button></Link></td>
                  </tr>

                )
              }
            })
          }
        </tbody>

        <div>Outgoing Consignments</div>

        <tbody style={{ background: "white", margin: "5px" }}>
          {


            userBlockchainDetails.map((d,i) => {
              const data = d.data.details;
              console.log(data)
              if (data.senderType == userData.type) {
                count = count + 1;

                return (

                  <tr key={i} className={`${styles.dashboardRows}`}>
                    <th scope="row">{count}</th>
                    <td>
                      <div className='d-flex flex-column align-items-start'>
                        <div>
                          {data.productId}
                        </div>
                        <div className='small'>{moment(d.message.confirmed).utc().format('DD-MM-YYYY')}</div>
                      </div>
                    </td>
                    <td>
                      <div className='small text-primary'>{data.senderType}</div>
                      <div>{data.senderName}</div>
                    </td>
                    <td>{data.product ? data.product : data.product1}   {data.product ? "" : data.product2}</td>
                    <td>{`${data.quantity ? data.quantity : data.quantity1}L`}   {data.quantity ? "" : data.quantity2}</td>
                    <td><Link to="/dep/product"><button onClick={() => { dispatch(SetProduct(d)) }}>View</button></Link></td>
                  </tr>

                )
              }
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default Depot;