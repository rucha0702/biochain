import { Routes, Route } from 'react-router-dom';
import './components/constants/constants.css';
import './App.css';
//import Quiz from './components/QuizComponents/quiz/Quiz';
import Register from './components/register/Register';
//import Create from './components/QuizComponents/CreateQuestions/Create';
import HomePage from './components/homepage/HomePage';
import Login from './components/login/Login';
import AdditionalDetails from './components/register/AdditionalDetails';
import EthanolProducer from './components/ethanolProducer/EthanolProducer';
import BiomassUnit from './components/biomassUnit/BiomassUnit';
import Refinery from './components/refinery/Refinery';
import RefineryPlaceOrder from './components/refinery/RefineryPlaceOrder';
import Depot from './components/depot/Depot';
import DepotPlaceOrder from './components/depot/DepotPlaceOrder';
import DepotProduct from './components/depot/DepotProduct';
import RetailUnit from './components/retailer/RetailUnit';
import RetailPlaceOrder from './components/retailer/RetailPlaceOrder';
import FireflyData from './components/firefly/FireflyData';
// import questions from './components/questions';

function App() {
  return (
    <div className='App'>
        <div className='d-none'>
        <FireflyData />
        </div>
      <Routes>
        <Route path="/firefly" element={<FireflyData />}></Route>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/myprofile' element={<AdditionalDetails />}></Route>
        <Route path="/epu" element={<EthanolProducer />}></Route>
        <Route path="/bmu" element={<BiomassUnit />}></Route>
        <Route path="/ref" element={<Refinery />}></Route>
        <Route path="/ref/pod" element={<RefineryPlaceOrder />}></Route>
        <Route path="/dep" element={<Depot />}></Route>
        <Route path="/dep/pod" element={<DepotPlaceOrder />}></Route>
        <Route path='/dep/product'element={<DepotProduct />}></Route>
        <Route path="/rtl" element={<RetailUnit />}></Route>
        <Route path='/rtl/pod' element={<RetailPlaceOrder />}></Route>
        {/* <Route path='/quiz' element={<Quiz />}></Route>
        <Route path='/create' element={<Create />}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
