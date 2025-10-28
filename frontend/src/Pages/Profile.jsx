import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Button,
  Chip,
  Avatar,
} from "@mui/material";
import { ExpandMore, Timer, AttachMoney } from "@mui/icons-material";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

  const handleEdit = (post) => {
    navigate(`/posts/edit/${post._id}`);
  };

  const handleAddPost = () => {
    navigate("/posts/new");
  };

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

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">{user?.name}'s Profile</Typography>
        <Button variant="contained" color="secondary" onClick={handleAddPost}>
          📢 Post Your AD
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Your Posts
      </Typography>

      {posts.length === 0 ? (
        <Typography color="text.secondary">
          You haven't created any posts yet.
        </Typography>
      ) : (
        posts.map((post) => (
          <Accordion key={post._id} sx={{ mb: 2 }}>
            {/* Minimized header */}
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
                <Chip label={post.category} color="primary" size="small" />
                <Typography variant="subtitle1" sx={{ flex: 1 }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ ml: 2 }}>
                  <AttachMoney fontSize="small" />
                  <Typography variant="body2">{post.price.toLocaleString()} LKR</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Timer fontSize="small" />
                  <Typography variant="body2">{post.deliveryTime}</Typography>
                </Stack>
              </Stack>
            </AccordionSummary>

            {/* Expanded details */}
            <AccordionDetails>
              <Stack spacing={2} sx={{ position: "relative" }}>
                {post.image && (
                  <Box sx={{ position: "relative", width: "100%", height: 300, borderRadius: 1, overflow: "hidden" }}>
                    {/* Blurred background */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(http://localhost:5000${post.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "blur(12px)",
                        opacity: 0.4, // subtle blur
                      }}
                    />
                    {/* Main image */}
                    <Box
                      component="img"
                      src={`http://localhost:5000${post.image}`}
                      alt={post.title}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                )}

                <Typography variant="body2">{post.description}</Typography>

                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(post)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(post._id)}>
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
}
