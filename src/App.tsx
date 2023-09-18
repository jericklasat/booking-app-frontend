import React from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import { useNavigate, useRoutes } from "react-router-dom";
import Calendar from './Calendar';
import Main from './Main';

function App() {
  const accessToken = window.localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const routes = useRoutes([
    { path: '/', element: <Main /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/calendar/:roomId', element: <Calendar /> },
  ]);

  React.useEffect(() => {
    if (accessToken == null) {
      navigate('/login');
    }
  }, []);

  return routes;

}

export default App;
