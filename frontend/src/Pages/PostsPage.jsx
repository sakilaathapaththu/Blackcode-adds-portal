import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

export default function TestPosts() {
  const { user, token, login, logout } = useContext(AuthContext);

  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    deliveryTime: "",
    specializations: "",
    contact: "",
    image: null,
  });
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // set auth header whenever token changes
  useEffect(() => {
    API.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  }, [token]);

  // fetch posts on mount
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

  const handleFile = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      category: "",
      deliveryTime: "",
      specializations: "",
      contact: "",
      image: null,
    });
    setEditing(null);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!token) return setMsg("Login required to create post");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) {
          if (key === "specializations") {
            // convert comma-separated string to JSON array
            fd.append(key, JSON.stringify(value.split(",").map((s) => s.trim())));
          } else {
            fd.append(key, value);
          }
        }
      });

      if (editing) {
        await API.put(`/posts/${editing._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Post updated");
      } else {
        await API.post("/posts", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Post created");
      }

      resetForm();
      fetchPosts();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (post) => {
    setEditing(post);
    setForm({
      title: post.title,
      description: post.description,
      price: post.price || "",
      category: post.category || "",
      deliveryTime: post.deliveryTime || "",
      specializations: post.specializations?.join(", ") || "",
      contact: post.contact || "",
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div style={{ maxWidth: 900, margin: "20px auto", fontFamily: "system-ui, sans-serif" }}>
      <h2>Test Posts / Ads</h2>

      {/* LOGIN / LOGOUT */}
      <div style={{ marginBottom: 20 }}>
        {user ? (
          <div>
            <b>Signed in as:</b> {user.username} ({user.name}) —{" "}
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              placeholder="username or phone"
              value={loginForm.identifier}
              onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
            />
            <input
              placeholder="password"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <button type="submit">Login</button>
          </form>
        )}
      </div>

      {/* CREATE / EDIT POST */}
      {user && (
        <section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6, marginBottom: 20 }}>
          <h3>{editing ? "Edit post" : "Create post"}</h3>
          <form onSubmit={handleCreateOrUpdate} style={{ display: "grid", gap: 8 }}>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
            <input
              placeholder="Delivery Time (e.g., 2 Days)"
              value={form.deliveryTime}
              onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
            />
            <input
              placeholder="Specializations (comma-separated)"
              value={form.specializations}
              onChange={(e) => setForm({ ...form, specializations: e.target.value })}
            />
            <input
              placeholder="Contact"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
            <input type="file" accept="image/*" onChange={handleFile} />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">{editing ? "Update" : "Create"}</button>
              <button type="button" onClick={resetForm}>Reset</button>
            </div>
          </form>
        </section>
      )}

      {/* MESSAGES */}
      {msg && <div style={{ color: "green", marginBottom: 8 }}>{msg}</div>}

      {/* POSTS LIST */}
      <h3>All Posts</h3>
      {loading ? (
        <div>Loading...</div>
      ) : posts.length === 0 ? (
        <div>No posts yet</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {posts.map((p) => (
            <div key={p._id} style={{ border: "1px solid #eee", padding: 10, borderRadius: 6 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ minWidth: 120 }}>
                  {p.image ? (
                    <img
                      src={(process.env.REACT_APP_BACKEND_STATIC || "http://localhost:5000") + p.image}
                      alt="post"
                      style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 4 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 120,
                        height: 80,
                        background: "#f6f6f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0 }}>
                    {p.title} <small style={{ color: "#777" }}>{p.category}</small>
                  </h4>
                  <div style={{ color: "#555" }}>{p.description}</div>
                  <div style={{ marginTop: 6 }}>
                    <b>Price:</b> {p.price ?? "-"} &nbsp; 
                    <b>Delivery:</b> {p.deliveryTime ?? "-"} &nbsp;
                  </div>
                  {p.specializations?.length > 0 && (
                    <div style={{ marginTop: 4 }}>
                      <b>Specializations:</b> {p.specializations.join(", ")}
                    </div>
                  )}
                  <div style={{ marginTop: 6, color: "#333" }}>
                    <small>
                      By: {p.owner?.username} ({p.owner?.name}) • {new Date(p.createdAt).toLocaleString()}
                    </small>
                  </div>
                </div>

                {/* EDIT / DELETE BUTTONS */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {user &&
                    p.owner &&
                    ((user._id || user.id) === p.owner._id || user.role === "provider") && (
                      <>
                        <button onClick={() => handleEdit(p)}>Edit</button>
                        <button onClick={() => handleDelete(p._id)}>Delete</button>
                      </>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
