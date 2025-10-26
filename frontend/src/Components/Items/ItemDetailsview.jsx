// src/Components/Items/ItemDetails.jsx
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
  CardMedia,
} from "@mui/material";
import { Timer, AttachMoney } from "@mui/icons-material";

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
          maxWidth: 700,
          maxHeight: "90vh",
          overflowY: "auto",
          p: 3,
          boxShadow: 6,
        }}
      >
        <CardMedia
          component="img"
          height="250"
          image={`http://localhost:5000/api/items/${item._id}/poster`}
          alt={item.title}
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/400x200.png?text=No+Image")
          }
          sx={{ borderRadius: 2, mb: 2 }}
        />

        <Chip label={item.category} color="primary" sx={{ mb: 1 }} />
        <Typography variant="h5" gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {item.description}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Provider"
          />
          <Typography variant="body2">John Doe</Typography>
        </Stack>

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

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Rating value={4.5} precision={0.5} readOnly />
          <Typography variant="body2">(12 reviews)</Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Specializations
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 3 }}>
          {item.specializations?.map((spec, idx) => (
            <Chip key={idx} label={spec} color="secondary" size="small" />
          ))}
        </Box>

        <Typography variant="h6" gutterBottom>
          Book This Service
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Secure your booking by contacting the provider directly.
        </Typography>
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
