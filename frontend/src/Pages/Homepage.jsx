// src/Pages/Homepage.jsx
import { Box } from "@mui/material";
import Homepagenavbar from "../Components/NavBar/Homepagenavbar";
import Sidebar from "../Components/Home/Sortingpanel";
import Footer from "../Components/Home/Footer";
import ItemPage from "../Components/Home/item";

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
          gap: 2,
          px: 2,
          py: 2,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {/* Sidebar (left side) - Hidden on mobile */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "320px", // Match the SearchPanelContainer width
            flexShrink: 0,
          }}
        >
          <Sidebar />
        </Box>

        {/* Main content area (right side) */}
        <Box
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            minWidth: 0, // Important: allows flex item to shrink below content size
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            overflow: "auto",
          }}
        >
          <ItemPage />
        </Box>
      </Box>

      {/* Footer at bottom */}
      <Footer />
    </Box>
  );
}