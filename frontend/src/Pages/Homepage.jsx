// src/Pages/Homepage.jsx
import React from "react";
import { Box } from "@mui/material";
import ItemPage from "./post/Postpage";

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
      {/* Spacer below fixed navbar */}
      <Box sx={{ height: "64px", flexShrink: 0 }} />

      {/* Main content - ItemPage handles its own layout */}
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
        }}
      >
        <ItemPage />
      </Box>
    </Box>
  );
}