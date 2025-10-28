import React, { useEffect, useState } from "react";
import {
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
  Typography,
} from "@mui/material";
import { Timer, AccountBalanceWallet, Image as ImageIcon } from "@mui/icons-material";
import axios from "axios";
import ItemForm from "../../Components/post/PostsForm";
import ItemDetails from "../../Components/post/PostsDetailsview";

const API_URL = "http://localhost:5000/api/posts";

// --- Helper functions for avatar ---
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  return {
    sx: { bgcolor: stringToColor(name), width: 28, height: 28 },
    children: name[0].toUpperCase(),
  };
}

// --- Format delivery time ---
function formatDeliveryTime(time) {
  const number = parseInt(time);
  if (isNaN(number)) return time;
  return `${number} ${number === 1 ? "day" : "days"}`;
}

// --- Truncate long text ---
function truncateWords(text, wordLimit) {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
}

// --- Image placeholder component ---
function ImagePlaceholder() {
  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#e3f2fd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <ImageIcon sx={{ fontSize: 64, color: "#90caf9" }} />
      <Typography variant="body2" color="text.secondary" mt={2}>
        No image uploaded
      </Typography>
    </Box>
  );
}

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  // --- Fetch items from API ---
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

  // --- Form handlers ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append("image", image);

      if (formData.specializations.trim() !== "") {
        const arr = formData.specializations.split(",").map((s) => s.trim());
        data.set("specializations", JSON.stringify(arr));
      }

      await axios.post(API_URL, data, { headers: { "Content-Type": "multipart/form-data" } });

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
      console.error(err);
    }
  };

  // --- Loading / error states ---
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  // --- Main Render ---
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {items.map((item) => (
        <Card
          key={item._id}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            mb: 3,
            borderRadius: 2,
            overflow: "hidden",
            height: 280,
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 25px rgba(0,0,0,0.2)" },
          }}
        >
          {/* Left Image Area */}
          <Box sx={{ flex: "0 0 280px", height: "100%" }}>
            {item.image ? (
              <CardMedia
                component="img"
                image={`http://localhost:5000${item.image}`}
                alt={item.title}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </Box>

          {/* Right Content */}
          <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", p: 3 }}>
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Chip label={item.category} color="primary" size="small" />
                <Typography variant="body2" color="text.secondary">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>

              <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {truncateWords(item.description, 20)}{" "}
                {item.description.split(/\s+/).length > 20 && (
                  <Button
                    variant="text"
                    size="small"
                    sx={{ textTransform: "none", p: 0, ml: 0.5 }}
                    onClick={() => setSelectedItem(item)}
                  >
                    See more
                  </Button>
                )}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Timer fontSize="small" />
                  <Typography variant="body2">{formatDeliveryTime(item.deliveryTime)}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AccountBalanceWallet fontSize="small" />
                  <Typography variant="body2">{item.price.toLocaleString()} LKR</Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Avatar {...stringAvatar(item.owner?.name || "anonymous")} />
                <Typography variant="body2">{item.owner?.name || "anonymous"}</Typography>
              </Stack>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 1 }} />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#1a237e",
                  "&:hover": { bgcolor: "#0d47a1" },
                  width: "100%",
                  transition: "all 0.3s ease",
                }}
                onClick={() => setSelectedItem(item)}
              >
                View Details
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}

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

      {selectedItem && <ItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </Container>
  );
}
