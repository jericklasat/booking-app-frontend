import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

interface Reservation {
  id: number;
  room_id: number;
  room_name: string;
  user_id: number;
  start_date_time: string;
  end_date_time: string;
  title: string;
}

const NavAppBar: React.FC = () => {
  const accessToken = window.localStorage.getItem("accessToken");
  const tokenPayload = JSON.parse(atob(accessToken!.split('.')[1]));
  const currentUserId = parseInt(tokenPayload.sub);
  const navigate = useNavigate();

  const logout = () => {
    axios.get(
      process.env.REACT_APP_API_URL + `/user/logout`,
      {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      }
    ).then(() => {
      window.localStorage.removeItem('accessToken');
      navigate('/login');
    }).catch(err => {
      console.log(err);
      alert('There is an error in logging out.')
    });
  };

  const exportReservation = () => {
    axios.get(
      process.env.REACT_APP_API_URL + `/user/reservations/${currentUserId}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      }
    ).then(response => {
      if (typeof response.data.reservations !== 'undefined') {
        const reservations: Reservation[] = response.data.reservations;

        const csvRows: any[] = [['Room', 'Title', 'Start', 'End']];

        reservations.forEach(reservation => {
          csvRows.push([reservation.room_name, reservation.title, reservation.start_date_time, reservation.end_date_time]);
        });

        console.log(csvRows);

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "reservations.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }).catch(err => {
      console.log(err);
      alert('There is an error in downloading reservations.')
    });
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <Button onClick={() => navigate('/')}>Booking App</Button>
        </Typography>
        <Button onClick={exportReservation} href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
          Export Reservation
        </Button>
        <Button onClick={logout} href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavAppBar;