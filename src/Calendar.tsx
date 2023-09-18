import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import { Scheduler } from "@aldabil/react-scheduler";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { EventActions, ProcessedEvent, RemoteQuery } from "@aldabil/react-scheduler/types";
import moment from 'moment';
import NavAppBar from "./NavAppBar";

interface Reservation {
  id: number;
  room_id: number;
  user_id: number;
  start_date_time: string;
  end_date_time: string;
  title: string;
  name: string;
}

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  let { roomId } = useParams();
  const accessToken = window.localStorage.getItem("accessToken");
  const tokenPayload = JSON.parse(atob(accessToken!.split('.')[1]));
  const currentUserId = parseInt(tokenPayload.sub);

  React.useEffect(() => {
    if (accessToken === null) {
      navigate("/login");
      return;
    }
  }, []);

  const getRemoteEvents = (
    params: RemoteQuery
  ): Promise<void | ProcessedEvent[]> => {
    return new Promise((resolve) => {
      axios
        .get(process.env.REACT_APP_API_URL + "/room/reservation/" + roomId, {
          headers: {
            Authorization: "Bearer " + accessToken
          }
        })
        .then((response) => {
          if (typeof response.data.reservations !== "undefined") {
            const reservations: Reservation[] = response.data.reservations;
            const events: ProcessedEvent[] = [];

            reservations.forEach((reservation) => {
              const isOwned = currentUserId === reservation.user_id;

              events.push({
                deletable: isOwned,
                editable: isOwned,
                start: new Date(reservation.start_date_time),
                end: new Date(reservation.end_date_time),
                event_id: reservation.id,
                title: reservation.title,
              });
            });

            resolve(events);
          }
        })
        .catch((err) => {
          console.log(err);
          resolve([]);
        });
    });
  };

  const onConfirm: (event: ProcessedEvent, action: EventActions) => Promise<ProcessedEvent> = (event, action) => {
    return new Promise((resolve, reject) => {
      const payload = action === 'edit'
        ? {
          start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
          title: event.title,
          event_id: event.event_id,
        }
        : {
          start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
          title: event.title,
          room_id: parseInt(roomId!),
          user_id: currentUserId
        };

      axios.post(
        process.env.REACT_APP_API_URL + `/room/reservation/${action}`, payload,
        {
          headers: {
            Authorization: "Bearer " + accessToken
          }
        }
      ).then(response => {
        alert(response.data.message);

        if (response.data.message === 'Reservation created.') {
          resolve(event);
        } else {
          reject();
        }
      }).catch(err => {
        console.log(err);
        alert('There is an error in creating reservation.')

        reject();
      });
    });
  }

  const deleteReservation = (deletedId: string | number): Promise<string | number | void> => {
    return new Promise((resolve, reject) => {
      axios.post(
        process.env.REACT_APP_API_URL + `/room/reservation/delete`, { deletedId },
        {
          headers: {
            Authorization: "Bearer " + accessToken
          }
        }
      ).then(response => {
        alert(response.data.message);

        resolve(deletedId);
      }).catch(err => {
        console.log(err);
        alert('There is an error in deleting reservation.')

        reject();
      });
    });
  };

  return (
    <>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <NavAppBar />
      <Container
        disableGutters
        maxWidth="xl"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        <Scheduler
          view="month"
          getRemoteEvents={getRemoteEvents}
          draggable={false}
          onConfirm={onConfirm}
          onDelete={deleteReservation}
        />
      </Container>
    </>
  );
};

export default Calendar;
