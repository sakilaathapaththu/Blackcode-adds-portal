// src/Pages/Homepage.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import Sidebar from "../Components/Home/Sortingpanel";
import ItemPage from "../Components/Home/item";
import API from "../Utils/api";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    API.get("/user/me")
      .then((res) => {
        if (mounted) {
          setUser(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error(err);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F6F9FC",
      }}
    >
      {/* Spacer to push content below fixed navbar */}
      <Box sx={{ height: "64px", flexShrink: 0 }} />

      {/* Dashboard Header */}
      <Box sx={{ px: 3, py: 1 }}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Dashboard
          </Typography>

          {loading ? (
            <CircularProgress size={24} />
          ) : user ? (
            <>
              <Typography variant="body1">Logged in as: {user.email}</Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Account created at:{" "}
                {new Date(user.createdAt).toLocaleString()}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Failed to load user information.
            </Typography>
          )}
        </Paper>
      </Box>

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
            width: "320px",
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
            minWidth: 0,
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
    </Box>
  );
}
