import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserDetails, AddDetails } from '../../actions/index';
import Navbar from '../navbar/Navbar';
import styles from './Login.module.css';
// import { elements } from '../links/links';
 import { url } from '../../utilities';

const Login = () => {
  let navigate = useNavigate();
  // const [sendElement, setSendElement] = useState('');
  //   const url = 'https://onerecruit.herokuapp.com';
  //   const additionalDetails = useSelector(state=>state.AdditionalDetails.additionalDetails)
  const userData = useSelector((state) => state.UserDetails.userDetails);
  const senderType = userData.type;
  useEffect(() => {
    if (userData.accessToken) {
      console.log(senderType);
      switch(senderType)
      {
        case "Ethanol Producer":{navigate("/epu");break;}
        case "Biomass Unit":{navigate("/bmu");break;}
        case "Refinery":{navigate("/ref");break;}
        case "Depot":{navigate("/dep");break;}
        case "Retail Unit":{navigate("/rtl");break;}
        // default:navigate('/myprofile');
      }
      
    }
    // elements.map((element) => {
    //   if (element.type == 'home') {
    //     setSendElement(element.body);
    //   }
    // });
    // eslint-disable-next-line
  }, []);
  let dispatch = useDispatch();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  //   const localData = localStorage.getItem('userinfo');
  //   const userInfo = localData ? JSON.parse(localData) : null;

  const handleSubmit = async (e) => {
    const { email, password } = user;
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/auth/login`, {
        email,
        password,
      });
      //   setUser(res.data);
      console.log(res.data);
      if (res) {
        // const user = res.data;
        dispatch(UserDetails(res.data));
        dispatch(AddDetails(res.data.additionalDetails));

        // localStorage.setItem('userinfo', JSON.stringify(res.data));
        console.log('response present');
        console.log('redux data', userData);
        if (res.data.accessToken) {
          switch(senderType)
      {
        case "Ethanol Producer":{navigate("/epu");break;}
        case "Biomass Unit":{navigate("/bmu");break;}
        case "Refinery":{navigate("/ref");break;}
        case "Depot":{navigate("/dep");break;}
        case "Retail Unit":{navigate("/rtl");break;}
        // default:navigate('/myprofile');
      }
          // navigate('/myprofile', { replace: true });
        } else {
          alert('wrong credentials');
        }
      } else {
        if (res) {
          console.log('data');
        } else {
          console.log('Network error');
        }
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(user);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };
  return (
    <div>
      <Navbar
        element={
          <Link
            className={`mx-2 text-dark text-decoration-none btn border-dark bg-none`}
            to='/'
          >
            Home
          </Link>
        }
      />
      <div
        className={`container my-4 ${styles.loginContainer} w-100 d-flex flex-column align-items-center`}
      >
        <div className={`h1 ${styles.heading}`}>Login to your account</div>
        <div
          className={`${
            (styles.lightText, styles.extraText)
          } text-center m-2 mb-4`}
        >
          Quickly login to your account and enjoy the full experience of
          ProductName
        </div>
        <div className={`w-100`}>
          <form
            onSubmit={handleSubmit}
            className={`container d-flex flex-column align-items-center w-50 ${styles.formContainer}`}
          >
            <div className={`m-2 w-50 ${styles.inputFieldContainer}`}>
              <input
                className={`p-2 ${styles.inputField} border-none`}
                type='email'
                name='email'
                value={user.email}
                placeholder='Email'
                onChange={handleChange}
              />
            </div>
            <div className={`m-2 w-50 ${styles.inputFieldContainer}`}>
              <input
                className={`p-2 ${styles.inputField} border-none`}
                type='password'
                name='password'
                value={user.password}
                placeholder='Password'
                onChange={handleChange}
              />
            </div>
            <button className={`m-3 btn btn-dark w-50`} type='submit'>
              Log in
            </button>
            <div>or</div>

            <Link
              to='/register'
              className={`m-3 btn btn-light border-dark text-decoration-none w-50 ${styles.btnRegister}`}
              type=''
            >
              Register Now
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
