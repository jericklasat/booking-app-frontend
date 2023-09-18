import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const accessToken = window.localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    if (accessToken !== null) {
      navigate('/');
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    axios
      .post(process.env.REACT_APP_API_URL + "/user/login", {
        email: data.get("email"),
        password: data.get("password")
      })
      .then((response) => {
        if (typeof response.data.token !== "undefined") {
          window.localStorage.setItem("accessToken", response.data.token);
          navigate('/');
        }

        setErrorMessage("User not found.");
      })
      .catch((err) => {
        if (typeof err.response.data.message !== "undefined") {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("Unknown error.");
        }
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {errorMessage.length > 0 && (
            <Alert severity="error">{errorMessage}</Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link onClick={() => navigate('/register')} href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
