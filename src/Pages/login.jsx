import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import axios from "../apiClient.js";
import { toast } from "../Components";
import { useAuth } from "../context/AuthContext";
import { setStoredToken } from "../utils/authStorage";
import { ROUTES } from "../constants/routes";

export default function Login() {
  const navigate = useNavigate();
  const [User_name, setUser_Name] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const { setAuthData, userName } = useAuth();

  useEffect(() => {
    if (userName) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [navigate, userName]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorText("");

    try {
      const response = await axios.post("/user/login", { User_name, Password });
      const data = response.data;

      if (data.status === "notexist") {
        setErrorText("User has not signed up.");
        return;
      }
      if (data.status === "invalid") {
        setErrorText("Invalid credentials. Please check username and password.");
        return;
      }
      if (!data.token) {
        setErrorText("Login succeeded but token was not received from the server.");
        return;
      }

      setStoredToken(data.token);
      setAuthData({
        userName: User_name,
        userGroup: data.userGroup,
        mobileNumber: data.userMobile || data.userMob || "",
      });
      toast.success("Login successful.");
      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setErrorText("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        background: "linear-gradient(135deg, rgba(37,211,102,0.12), rgba(15,23,42,0.08))",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 460, mx: "auto", borderRadius: 4 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={3} component="form" onSubmit={submit}>
            <Box>
              <Typography variant="h5" fontWeight={800} gutterBottom>
                WhatsApp CRM Login
              </Typography>
              <Typography color="text.secondary">Sign in to open the WhatsApp Cloud panel.</Typography>
            </Box>

            {errorText && <Alert severity="error">{errorText}</Alert>}

            <TextField
              label="User Name"
              autoComplete="username"
              value={User_name}
              onChange={(e) => setUser_Name(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" variant="contained" fullWidth disabled={loading} endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LoginRoundedIcon />}>
              {loading ? "Please wait..." : "Sign In"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
