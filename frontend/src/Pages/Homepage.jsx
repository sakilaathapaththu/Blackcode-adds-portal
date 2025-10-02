// src/Pages/Homepage.jsx
import { Box } from "@mui/material";
import Homepagenavbar from "../Components/NavBar/Homepagenavbar";
import Sidebar from "../Components/Home/Sortingpanel";
import Footer from "../Components/Home/Footer";

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F6F9FC",
      }}
    >
      {/* Fixed Navbar */}
      <Homepagenavbar />

      {/* Spacer to push content below fixed navbar */}
      <Box sx={{ height: "64px", flexShrink: 0 }} />

      {/* Main content layout */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          px: 2,
          py: 2,
        }}
      >
        {/* Sidebar (left side) */}
        <Box
          sx={{
            width: { xs: "100%", md: "250px" }, // full width on mobile, fixed width on desktop
            flexShrink: 0,
            mr: { md: 2 }, // margin right on desktop
          }}
        >
          <Sidebar />
        </Box>

        {/* Main content area (right side) */}
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
        </Box>
      </Box>

      {/* Footer at bottom */}
      <Footer />
    </Box>
  );
}
