import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Button,
  Stack,
  Avatar,
  Rating,
  CircularProgress,
} from "@mui/material";
import { Timer, AttachMoney } from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/items";

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(API_URL);
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load items.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Assignment Helpers Marketplace
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {/* Poster Image from backend */}
                <CardMedia
                  component="img"
                  height="180"
                  image={`${API_URL}/${item._id}/poster`}
                  alt={item.title}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200.png?text=No+Image";
                  }}
                />

                {/* Card Content */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Chip
                    label={item.category}
                    color="primary"
                    size="small"
                    sx={{ mb: 1 }}
                  />

                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {item.description}
                  </Typography>

                  {/* Provider info (hardcoded for now) */}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Avatar
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Provider"
                      sx={{ width: 28, height: 28 }}
                    />
                    <Typography variant="body2">John Doe</Typography>
                  </Stack>

                  {/* Delivery + Price */}
                  <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Timer fontSize="small" />
                      <Typography variant="body2">
                        {item.deliveryTime}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <AttachMoney fontSize="small" />
                      <Typography variant="body2">
                        {item.price.toLocaleString()} LKR
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Rating (hardcoded for now) */}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Rating value={4.5} precision={0.5} size="small" readOnly />
                    <Typography variant="body2">(12 reviews)</Typography>
                  </Stack>

                  {/* Specializations */}
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}
                  >
                    {item.specializations?.map((spec, idx) => (
                      <Chip
                        key={idx}
                        label={spec}
                        size="small"
                        color="secondary"
                      />
                    ))}
                  </Box>
                </CardContent>

                <Box sx={{ p: 2 }}>
                  <Button variant="contained" fullWidth color="primary">
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
