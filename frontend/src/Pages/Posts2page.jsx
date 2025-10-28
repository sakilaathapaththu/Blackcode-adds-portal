import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Button,
  Stack,
  Avatar,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Timer, AttachMoney } from "@mui/icons-material";
import axios from "axios";
import ItemForm from "../Components/Items/PostsForm";
import ItemDetails from "../Components/Items/PostsDetailsview";

// ✅ Use the backend /api/posts route
const API_URL = "http://localhost:5000/api/posts";

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
      width: 28,
      height: 28,
    },
    children: name[0].toUpperCase(),
  };
}

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryTime: "",
    specializations: "",
    contact: "",
  });
  const [image, setImage] = useState(null);

  // ✅ Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(API_URL);
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImage(e.target.files[0]);

  // ✅ Submit new post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append("image", image);

      // Convert specializations to JSON array
      if (formData.specializations.trim() !== "") {
        const specializationsArray = formData.specializations
          .split(",")
          .map((s) => s.trim());
        data.set("specializations", JSON.stringify(specializationsArray));
      }

      await axios.post(API_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Post created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        deliveryTime: "",
        specializations: "",
        contact: "",
      });
      setImage(null);
      setIsFormOpen(false);

      // Refresh list
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }
  };

  if (loading)
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

  if (error)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      {/* <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Assignment Helpers Marketplace
          </Typography>
          <button
            onClick={() => setIsFormOpen(true)}
            style={{
              background: "#007bff",
              color: "#fff",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            📢 Post Your AD
          </button>
        </Toolbar>
      </AppBar> */}

      {/* Posts List */}
      <Container sx={{ mt: 4, mb: 4 }}>
        {items.map((item) => (
          <Card
            key={item._id}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "stretch",
              mb: 3,
              borderRadius: 3,
              overflow: "hidden",
              height: 250,
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
              },
            }}
          >
            {/* Left Image */}
            <Box
              sx={{
                flex: "0 0 280px",
                height: "100%",
              }}
            >
              <CardMedia
                component="img"
                image={
                  item.image
                    ? `http://localhost:5000${item.image}`
                    : "https://via.placeholder.com/280x200.png?text=No+Image"
                }
                alt={item.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            {/* Right Content */}
            <CardContent
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 2.5,
                overflow: "hidden",
              }}
            >
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Chip label={item.category} color="primary" size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>

                <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }}>
                  {item.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item.description}
                </Typography>

                {/* ✅ User Avatar with letter & color */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Avatar {...stringAvatar(item.owner?.name || "John Doe")} />
                  <Typography variant="body2">
                    {item.owner?.name || "John Doe"}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Timer fontSize="small" />
                    <Typography variant="body2">{item.deliveryTime}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AttachMoney fontSize="small" />
                    <Typography variant="body2">
                      {item.price.toLocaleString()} LKR
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Divider sx={{ mb: 1 }} />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => setSelectedItem(item)}
                  fullWidth
                >
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Container>

      {/* Modals */}
      {isFormOpen && (
        <ItemForm
          formData={formData}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {selectedItem && (
        <ItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </Box>
  );
}
