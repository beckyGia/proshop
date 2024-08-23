import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Provider } from "react-redux";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import MainLayout from "./components/layouts/MainLayout";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OrderListScreen from "./screens/admin/OrderListScreen";
import ProductListScreen from "./screens/admin/ProductListScreen";
import ProductEditScreen from "./screens/admin/ProductEditScreen";
import store from "./store";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index={true} path="/" element={<HomeScreen />} />
        <Route path="/product/:id" element={<ProductScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        <Route path="" element={<PrivateRoute />}>
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Route>

        <Route path="" element={<AdminRoute />}>
          <Route path="/admin/orderlist" element={<OrderListScreen />} />
          <Route path="/admin/productlist" element={<ProductListScreen />} />
          <Route path="/admin/productlist" element={<ProductListScreen />} />
          <Route
            path="/admin/product/:id/edit"
            element={<ProductEditScreen />}
          />
        </Route>
      </Route>
    )
  );

  //deferLoading prop is to control when the JS SDK script loads.
  return (
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />;
      </PayPalScriptProvider>
    </Provider>
  );
};

export default App;
