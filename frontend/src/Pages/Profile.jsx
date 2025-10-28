import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Button,
  Chip,
  Divider,
  Avatar,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Timer, AttachMoney } from "@mui/icons-material";
import { AuthContext } from "../Context/AuthContext";
import ItemForm from "../Components/Items/ItemForm";

const API_URL = "http://localhost:5000/api/posts";

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

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // ✅ for creating new post
  const [editFormData, setEditFormData] = useState(null);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryTime: "",
    specializations: "",
    contact: "",
  });

  // ✅ Fetch current user's posts
  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load your posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUserPosts();
  }, [token]);

  // ✅ Delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  // ✅ Open edit modal
  const handleEdit = (post) => {
    setEditFormData({
      title: post.title,
      description: post.description,
      category: post.category,
      price: post.price,
      deliveryTime: post.deliveryTime,
      specializations: post.specializations.join(", "),
      contact: post.contact,
      id: post._id,
    });
    setIsEditOpen(true);
  };

  // ✅ Update post
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(editFormData).forEach((key) => {
        if (key !== "id") data.append(key, editFormData[key]);
      });
      if (image) data.append("image", image);
      if (editFormData.specializations.trim() !== "") {
        const arr = editFormData.specializations.split(",").map((s) => s.trim());
        data.set("specializations", JSON.stringify(arr));
      }

      await axios.put(`${API_URL}/${editFormData.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setIsEditOpen(false);
      setImage(null);
      fetchUserPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    }
  };

  // ✅ Create new post
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append("image", image);
      if (formData.specializations.trim() !== "") {
        const arr = formData.specializations.split(",").map((s) => s.trim());
        data.set("specializations", JSON.stringify(arr));
      }

      await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setIsFormOpen(false);
      setImage(null);
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        deliveryTime: "",
        specializations: "",
        contact: "",
      });
      fetchUserPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  const handleChange = (e) =>
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImage(e.target.files[0]);
  const handleCreateChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Loading and error UI
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
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
    <Container sx={{ mt: 4 }}>
     <div style={{ padding: 16 }}>
      <h2>Profile</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>

      {/* ✅ AppBar with Post button */}
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">{user?.name || "User"}'s Profile</Typography>
          <button
            onClick={() => setIsFormOpen(true)}
            style={{
              background: "#fff",
              color: "#1976d2",
              padding: "8px 14px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            📢 Post Your AD
          </button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Your Posts
        </Typography>

        {posts.length === 0 ? (
          <Typography color="text.secondary">
            You haven't created any posts yet.
          </Typography>
        ) : (
          posts.map((post) => (
            <Card
              key={post._id}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                mb: 3,
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ flex: "0 0 280px" }}>
                <CardMedia
                  component="img"
                  image={
                    post.image
                      ? `http://localhost:5000${post.image}`
                      : "https://via.placeholder.com/280x200.png?text=No+Image"
                  }
                  alt={post.title}
                  sx={{ height: "100%", objectFit: "cover" }}
                />
              </Box>

              <CardContent sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Chip label={post.category} color="primary" size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>

                <Typography variant="h6" sx={{ mt: 1 }}>
                  {post.title}
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
                  {post.description}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <Avatar {...stringAvatar(user?.name || "U")} />
                  <Typography variant="body2">{user?.name}</Typography>
                </Stack>

                <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Timer fontSize="small" />
                    <Typography variant="body2">{post.deliveryTime}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AttachMoney fontSize="small" />
                    <Typography variant="body2">
                      {post.price.toLocaleString()} LKR
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* ✅ Edit Post Modal */}
      {isEditOpen && (
        <ItemForm
          formData={editFormData}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleUpdate}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {/* ✅ Create Post Modal */}
      {isFormOpen && (
        <ItemForm
          formData={formData}
          handleChange={handleCreateChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleCreate}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </Container>
  );
}
