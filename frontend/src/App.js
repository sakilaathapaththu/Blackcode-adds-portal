// src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";

import Home from "./Pages/Homepage";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import HomepageNavbar from "./Components/NavBar/Homepagenavbar";
import AuthPage from "./Pages/Auth/AuthPage";
import TestPosts from "./Pages/test";
import NewPost from "./Pages/post/NewPost";
import EditPost from "./Pages/post/EditPost";
import Footer from "./Components/Home/Footer";
import ForgotPassword from "./Pages/Auth/ForgotPassword";

const theme = createTheme({
  palette: { mode: "light", background: { default: "#F6F9FC" } },
  shape: { borderRadius: 12 },
});

function AppShell() {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith("/dashboard"); // 🔒 no navbar/footer on admin

  return (
    <>
      {!hideChrome && <HomepageNavbar />}
      <Box
        sx={{
          minHeight: hideChrome ? "100vh" : "calc(100vh - 160px)",
          pt: hideChrome ? 0 : "15px",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/test" element={<TestPosts />} />
          <Route
            path="/posts/new"
            element={
              <ProtectedRoute role="any">
                <NewPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/edit/:id"
            element={
              <ProtectedRoute role="any">
                <EditPost />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="provider">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      {!hideChrome && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
