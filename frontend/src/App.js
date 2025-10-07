import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";

import Home from "./Pages/Homepage";
import HomepageNavbar from "./Components/NavBar/Homepagenavbar";
import Footer from "./Components/Home/Footer";
import Loginpage from "./Pages/Loginpage";
import Test from "./Pages/test";

const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#F6F9FC" },
  },
  shape: { borderRadius: 12 },
});

// ✅ ProtectedRoute: only allows access if JWT exists
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ✅ PublicRoute: blocks access to login if already logged in
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {/* ✅ Common Layout: Navbar always at top */}
        <HomepageNavbar />

        {/* ✅ Page Content */}
        <Box sx={{ minHeight: "calc(100vh - 160px)", pt: "64px" }}>
          <Routes>
            {/* Public route - Login */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Loginpage />
                </PublicRoute>
              }
            />

            {/* Protected route - Home */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
             <Route path="/test" element={<Test />} />
          </Routes>
        </Box>

        {/* ✅ Common Footer for all pages */}
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}