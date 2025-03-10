import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './styles.css';
import { getSelectedProds } from '../../functions/basket';
import RequireAuth from './RequireAuth/RequireAuth';

import Home from '../../pages/Home/Home';
import Asteroid from '../../pages/Asteroid/Asteroid';
import CheckAdmin from './CheckAdmin/CheckAdmin';
const Catalog = lazy(() => import('../../pages/Catalog/Catalog'))
const Help = lazy(() => import('../../pages/Help/Help'))
const AddNewProduct = lazy(() => import('../AddNewProduct/AddNewProduct'))
const Basket = lazy(() => import('../../pages/Basket/Basket')) 
const Profile = lazy(() => import('../../pages/Profile/Profile'))
const Order = lazy(() => import('../../pages/Order/Order'))
const AboutUs = lazy(() => import('../../pages/AboutUs/AboutUs'))
const Unlogined = lazy(() => import('../../pages/Unlogined/Unlogined'))
const Empty = lazy(() => import('../../pages/Empty/Empty'))
const Admin = lazy(() => import('../../pages/Admin/Admin'))
const AllUsersList = lazy(() => import('../../pages/AllUsersList/AllUsersList'))
const AllOrdersList = lazy(() => import('../../pages/AllOrdersList/AllOrdersList'))
const User = lazy(() => import('../../pages/User/User'))

// import Catalog from '../../pages/Catalog/Catalog';
// import Help from '../../pages/Help/Help'
// import AboutUs from '../../pages/AboutUs/AboutUs'
// import AddNewProduct  from '../AddNewProduct/AddNewProduct'
// import Basket from '../../pages/Basket/Basket'
// import Profile from '../../pages/Profile/Profile'
// import Order from '../../pages/Order/Order'
// import Unlogined from '../../pages/Unlogined/Unlogined'
// import Empty from '../../pages/Empty/Empty';
// import Admin from '../../pages/Admin/Admin'
// import AllUsersList from '../../pages/AllUsersList/AllUsersList'
// import AllOrdersList from '../../pages/AllOrdersList/AllOrdersList'
// import User from '../../pages/User/User'

const Content = ({ updateUser }) => {

  const orderConditions = () => {
    if (getSelectedProds().length > 0) {
      return true;
    } else {
      return <Navigate to='/basket' />;
    }
};

return (
    <div id='Main'>
        <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/catalog' element={<Catalog />} />
            <Route exact path='/help' element={<Help />} />
            <Route exact path='/about' element={<AboutUs />} />
            <Route exact path='/asteroid' element={<Asteroid />} />
            <Route exact path='/basket' element={<Basket />} />
            <Route exact path='/basket/order' element={(
                <RequireAuth additionalCondition={orderConditions}>
                  <Order/>
                </RequireAuth>
            )} />
            <Route exact path='/profile' element={
                <RequireAuth>
                    <Profile updateUser={updateUser} />
                </RequireAuth>
            } />
            <Route exact path='/login' element={<Unlogined updateUser={updateUser} />} />
            <Route exact path='/user' element={<User updateUser={updateUser}/>} />
            <Route exact path='*' element={<Empty/>} />

            <Route exact path='/admin' element={
                <CheckAdmin>
                  <Admin/>
                </CheckAdmin>
            } />
            <Route exact path='/admin/product/add' element={
                <CheckAdmin>
                  <AddNewProduct />
                </CheckAdmin>
            } />
            <Route exact path='/admin/users' element={
                <CheckAdmin>
                  <AllUsersList/>
                </CheckAdmin>
            } />
            <Route exact path='/admin/orders' element={
                <CheckAdmin>
                  <AllOrdersList/>
                </CheckAdmin>
            } />
        </Routes>
    </div>
);
}

export default Content;
