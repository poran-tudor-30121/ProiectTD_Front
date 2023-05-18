import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from "./Register/Register";
import Login from "./Login/Login";
import {RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import HomePage from "./HomePage/HomePage";


const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register/>
    }
    ,
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/homepage",
        element:<HomePage/>
    }
])
function App() {
  return (
    <div className="App">
        <RouterProvider router={router}></RouterProvider>

    </div>
  );
}

export default App;
