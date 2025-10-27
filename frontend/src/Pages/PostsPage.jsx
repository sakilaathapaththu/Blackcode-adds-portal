import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

export default function TestPosts() {
  const { user, token, login, logout } = useContext(AuthContext);

  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/posts");
      const data = Array.isArray(res.data) ? res.data : res.data.posts || [];
      setPosts(data);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", {
        usernameOrPhone: loginForm.identifier,
        password: loginForm.password,
      });
      const { token: t, user: u } = res.data;
      login(t, u);
      setMsg("Logged in");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Login failed");
    }
  };

  const handleDelete = async (postId) => {
    if (!token) return setMsg("Login required");
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/${postId}`);
      setMsg("Deleted");
      fetchPosts();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", pb: 4 }}>
      {/* Header */}
      <Box sx={{ bgcolor: "#fff", p: 2, boxShadow: 1, mb: 2 }}>
        <Container sx={{ mt: "80px", mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Assignment Helpers Marketplace
          </Typography>
          {user && (
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "none" }}
              onClick={() => alert("Open Post Form")}
            >
              📢 Post Your AD
            </Button>
          )}
        </Container>
      </Box>

      <Container>
        {/* Login */}
        {!user && (
          <Box sx={{ mb: 3 }}>
            <form style={{ display: "flex", gap: 8, alignItems: "center" }} onSubmit={handleLogin}>
              <input
                placeholder="Username or Phone"
                value={loginForm.identifier}
                onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
              />
              <input
                placeholder="Password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <button type="submit">Login</button>
            </form>
          </Box>
        )}

        {msg && <Typography sx={{ mb: 2, color: "green" }}>{msg}</Typography>}

        {/* Posts */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography>No posts yet</Typography>
        ) : (
          <Stack spacing={2}>
            {posts.map((p) => (
              <Card key={p._id} sx={{ display: "flex", borderRadius: 1, overflow: "hidden" }}>
                {/* Left: Image */}
                <CardMedia
                  component="img"
                  sx={{ width: 160, objectFit: "cover" }}
                  image={
                    p.image
                      ? (process.env.REACT_APP_BACKEND_STATIC || "http://localhost:5000") + p.image
                      : "https://via.placeholder.com/160x120.png?text=No+Image"
                  }
                  alt={p.title}
                />

                {/* Right: Info */}
                <CardContent sx={{ flex: 1, p: 2 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {p.title}
                      </Typography>
                      <Chip label={p.category} size="small" />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" noWrap>
                      {p.description}
                    </Typography>

                    <Stack direction="row" spacing={2}>
                      <Typography variant="body2">
                        <b>Price:</b> {p.price ?? "-"}
                      </Typography>
                      <Typography variant="body2">
                        <b>Delivery:</b> {p.deliveryTime ?? "-"}
                      </Typography>
                    </Stack>

                    {p.specializations?.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                        {p.specializations.map((s, idx) => (
                          <Chip key={idx} label={s} size="small" color="secondary" />
                        ))}
                      </Stack>
                    )}

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                      <Avatar sx={{ width: 28, height: 28 }}>
                        {p.owner?.username?.[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {p.owner?.username} • {new Date(p.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>

                    {user &&
                      p.owner &&
                      ((user._id || user.id) === p.owner._id || user.role === "provider") && (
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Button variant="outlined" size="small" onClick={() => alert("Edit post")}>
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(p._id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
