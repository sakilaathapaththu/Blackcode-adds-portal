import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import { AuthProvider } from "./Context/AuthContext";

import Home from "./Pages/Homepage";
import HomepageNavbar from "./Components/NavBar/Homepagenavbar";
import Footer from "./Components/Home/Footer";
import AuthPage from "./Pages/Auth/AuthPage";

const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#F6F9FC" },
  },
  shape: { borderRadius: 12 },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* ✅ Wrap with AuthProvider */}
      <AuthProvider>
        <BrowserRouter>
          <HomepageNavbar />
          <Box sx={{ minHeight: "calc(100vh - 160px)", pt: "15px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
