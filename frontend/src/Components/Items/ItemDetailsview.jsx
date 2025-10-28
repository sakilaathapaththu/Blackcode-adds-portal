import React from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Stack,
  Button,
  Rating,
  Divider,
} from "@mui/material";
import { Timer, AttachMoney } from "@mui/icons-material";

// --- Helper functions for letter avatar ---
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 36,
      height: 36,
    },
    children: name[0].toUpperCase(),
  };
}

export default function ItemDetails({ item, onClose }) {
  if (!item) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1200,
      }}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          width: "90%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          p: 3,
          boxShadow: 6,
        }}
      >
        {/* Category */}
        <Chip label={item.category} color="primary" sx={{ mb: 1 }} />

        {/* Title */}
        <Typography variant="h5" gutterBottom>
          {item.title}
        </Typography>

        {/* Description */}
        <Typography variant="body1" sx={{ mb: 2 }}>
          {item.description}
        </Typography>

        {/* Provider */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Avatar {...stringAvatar(item.owner?.name || "John Doe")} />
          <Typography variant="body2">
            {item.owner?.name || "John Doe"}
          </Typography>
        </Stack>

        {/* Delivery & Price */}
        <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Timer fontSize="small" />
            <Typography>{item.deliveryTime}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <AttachMoney fontSize="small" />
            <Typography>{item.price.toLocaleString()} LKR</Typography>
          </Stack>
        </Stack>

        {/* Ratings */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Rating value={4.5} precision={0.5} readOnly />
          <Typography variant="body2">(12 reviews)</Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Specializations */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Specializations
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 3 }}>
          {item.specializations?.map((spec, idx) => (
            <Chip key={idx} label={spec} color="secondary" size="small" />
          ))}
        </Box>

        {/* Contact */}
        <Typography variant="h6" gutterBottom>
          Contact Provider
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          📞 {item.contact || "Not Provided"}
        </Typography>

        {/* Actions */}
        <Button variant="contained" color="success" fullWidth sx={{ mb: 1 }}>
          📅 Book Now
        </Button>
        <Button variant="outlined" fullWidth color="error" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
}
