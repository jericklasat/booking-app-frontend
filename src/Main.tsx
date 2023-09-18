import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import axios from 'axios';
import { Card, CardActions, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavAppBar from './NavAppBar';

interface Room {
  id: number;
  name: string;
  start_day_available: string;
  end_day_available: string;
  min_time_available: number;
  max_time_available: number;
}

const Main: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = window.localStorage.getItem('accessToken');
  const [rooms, setRooms] = React.useState<Room[]>([]);

  React.useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/room/all", {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })
      .then(response => {
        if (typeof response.data.rooms !== 'undefined') {
          setRooms(response.data.rooms);
        }
      }).catch(err => {
        console.log(err);
      });
  }, []);


  return (
    <>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <NavAppBar />
      <Container disableGutters maxWidth="xl" component="main" sx={{ pt: 8, pb: 6 }}>
        <Grid container spacing={2}>
          {
            rooms.map((room) => (
              <Grid key={room.id} item xs={6} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {room.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This room is available to reserve from {room.start_day_available} to {room.end_day_available} for {room.min_time_available} - {room.max_time_available} minutes duration.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate('/calendar/' + room.id)}>Select</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          }
        </Grid>
      </Container>
    </>
  )
};

export default Main;