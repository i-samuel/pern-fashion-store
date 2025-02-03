import React, { useEffect } from 'react';
import { RouterProvider, Route, createRoutesFromElements, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Shop from './Components/Shop/Shop';
import SingleProduct from './features/singleProduct/SingleProduct';
import Root from './Components/Root/Root';
import CartPage from './features/cart/CartPage';
import Account from './features/account/Account';
import Checkout from './Components/Checkout/Checkout';
import AuthRoute from './Components/CustomRoute/AuthRoute';
import ProtectedRoute from './Components/CustomRoute/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { setUser } from './features/session/sessionSlice';
import AuthPage from './Components/AuthPage/AuthPage';
import { loadCart } from './features/cart/cartSlice';
import { loadAccount } from './features/account/accountSlice';
import Home from './Components/Home/Home';
import PaySuccess from './Components/Payments/PaySuccess';
import CategoryPage from './Components/Shop/CategoryPage';
import SearchPage from './Components/Shop/SearchPage';
import AdminRoute from './Components/CustomRoute/AdminRoute';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import AdminProducts from './Components/AdminDashboard/products/AdminProducts';
import AddNewProduct from './Components/AdminDashboard/products/AddNewProduct';
import EditProduct from './Components/AdminDashboard/products/EditProduct';
import AdminCategories from './Components/AdminDashboard/categories/AdminCategories';
import EditCategory from './Components/AdminDashboard/categories/EditCategory';
import AdminSizes from './Components/AdminDashboard/sizes/AdminSizes';
import EditSizes from './Components/AdminDashboard/sizes/EditSize';
import AdminColors from './Components/AdminDashboard/colors/AdminColors';
import EditColor from './Components/AdminDashboard/colors/EditColor';
import ShopLayout from './Components/Shop/ShopLayout';

function App({user}) {
  //console.log(userId);
  const dispatch = useDispatch();

  useEffect(()=> {
    if(user){
      dispatch(setUser(user));     
      dispatch(loadCart());
      dispatch(loadAccount(user.id));      
    }
    
  },[dispatch, user]);

  const router = createBrowserRouter(createRoutesFromElements([
    <>
    <Route path='/' element={ <Root/> }>
      <Route index element={ <Home/> }/>
      <Route path='/shop' element={ <ShopLayout/> }>
        <Route index element={ <Shop/> }/>
        <Route path='category/:id/:title' element={ <CategoryPage/> }/>      
        <Route path='search' element={ <SearchPage/>} />
      </Route>      
      
      <Route path='product/:id/:title' element={ <SingleProduct/>}/>
      <Route path='signup' element={ <AuthRoute><AuthPage/></AuthRoute> }/>
      <Route path='cart' element={ <ProtectedRoute><CartPage/></ProtectedRoute> }/>
      <Route path='account' element={ <ProtectedRoute><Account/></ProtectedRoute> }/>
      <Route path='payment-success' element={ <ProtectedRoute><PaySuccess/></ProtectedRoute> }/>     
    </Route> 
    <Route path='/checkout' element={ <ProtectedRoute><Checkout/></ProtectedRoute> }/>
    <Route path='/admin' element={ <AdminRoute><AdminDashboard/></AdminRoute>} >
      <Route index element={ <AdminProducts /> }/>
      <Route path='products' element={ <AdminProducts/> }/>
      <Route path='categories' element={ <AdminCategories/>} />
      <Route path='categories/:id' element={ <EditCategory/>} />
      <Route path='add-new-product' element={ <AddNewProduct/> }/>
      <Route path='edit-product/:id' element={ <EditProduct/>} />
      <Route path='attr/sizes' element={ <AdminSizes/>} />
      <Route path='attr/sizes/:id' element={ <EditSizes/>} />
      <Route path='attr/colors' element={ <AdminColors/>} />
      <Route path='attr/colors/:id' element={ <EditColor/>} />
    </Route>
    </>
  ]));
  
  return (
    <RouterProvider router= { router }/>
  );
}

export default App;