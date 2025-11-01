import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Stack,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
} from "@mui/material";
import {
  AccessTime,
  Category,
  Phone,
  Image as ImageIcon,
  AccountBalanceWallet,
} from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";

export default function EditPost() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const maxWords = 150;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const post = res.data;
        setFormData({
          title: post.title,
          description: post.description,
          category: post.category,
          price: post.price,
          deliveryTime: post.deliveryTime,
          specializations: post.specializations.join(", "),
          contact: post.contact,
          id: post._id,
        });
        if (post.image) setImagePreview(post.image);
        setWordCount(post.description.trim().split(/\s+/).length);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch post");
        navigate("/profile");
      }
    };
    fetchPost();
  }, [id, token, navigate]);

  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const validateForm = (data = formData) => {
    const temp = {};
    if (touched.title && !data.title.trim()) temp.title = "Title is required.";
    if (touched.category && !data.category.trim()) temp.category = "Category is required.";
    if (touched.price) {
      if (!data.price.trim()) temp.price = "Price is required.";
      else if (isNaN(Number(data.price)) || Number(data.price) <= 0)
        temp.price = "Enter a valid price.";
    }
    if (touched.deliveryTime && !data.deliveryTime.trim()) temp.deliveryTime = "Delivery time is required.";
    if (touched.contact) {
      if (!data.contact.trim()) temp.contact = "Contact is required.";
      else if (!/^\d{10}$/.test(data.contact.trim())) temp.contact = "Phone must be 10 digits.";
    }
    if (touched.description && countWords(data.description) > maxWords)
      temp.description = `Description cannot exceed ${maxWords} words.`;

    setErrors(temp);
    return temp;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateForm({ ...formData });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!formData) return;

    if (name === "description") {
      const words = countWords(value);
      if (words > maxWords) return;
      setFormData({ ...formData, [name]: value });
      setWordCount(words);
    } else if (name === "price" || name === "contact") {
      if (!/^\d*$/.test(value)) return;
      if (name === "contact" && value.length > 10) return;
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    validateForm({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = {
      title: true,
      description: true,
      category: true,
      price: true,
      deliveryTime: true,
      contact: true,
    };
    setTouched(allTouched);

    const validation = validateForm();
    if (Object.values(validation).some((x) => x)) return;

    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "id") data.append(key, formData[key]);
      });
      if (image) data.append("image", image);
      if (formData.specializations.trim()) {
        const arr = formData.specializations.split(",").map((s) => s.trim());
        data.set("specializations", JSON.stringify(arr));
      }

      await axios.put(`${API_URL}/${formData.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <Typography>Loading...</Typography>;

  const specializationsArray = formData.specializations
    ? formData.specializations.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const limitWords = (text) => {
    if (!text) return "";
    const words = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  const isLimitReached = wordCount >= maxWords;
  const isFormInvalid = loading || isLimitReached || Object.values(errors).some((v) => v);

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, textAlign: "left" }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: "#1a237e" }}>
            Edit Post
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Update your post details and see live preview
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {/* Left Column - Form */}
          <Grid item xs={12} md={6} sx={{ maxWidth: 550, width: "100%" }}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2, bgcolor: "white" }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, color: "#1a237e" }}>
                Post Details
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {["title", "category", "price", "deliveryTime", "contact"].map((field) => (
                    <TextField
                      key={field}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      required
                      error={!!errors[field]}
                      helperText={errors[field] || ""}
                      inputProps={{ inputMode: field === "price" || field === "contact" ? "numeric" : "text" }}
                    />
                  ))}

                  <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    multiline
                    minRows={3}
                    required
                    error={!!errors.description}
                    helperText={errors.description || `${wordCount}/${maxWords} words`}
                    FormHelperTextProps={{ sx: { textAlign: "right", color: isLimitReached ? "error.main" : "text.secondary" } }}
                  />

                  <TextField
                    label="Specializations (comma separated)"
                    name="specializations"
                    value={formData.specializations}
                    onChange={handleChange}
                    fullWidth
                  />

                  <Button variant="outlined" component="label" startIcon={<ImageIcon />}>
                    {image ? "Change Image" : "Upload Image"}
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                  </Button>
                  {image && <Typography>{image.name}</Typography>}

                  <Divider />

                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => navigate("/profile")}>
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isFormInvalid}
                      sx={{
                        bgcolor: isFormInvalid ? "grey.400" : "#1a237e",
                        opacity: isFormInvalid ? 0.6 : 1,
                        "&:hover": { bgcolor: isFormInvalid ? "grey.500" : "#0d47a1" },
                      }}
                    >
                      {loading ? "Updating..." : "Update Post"}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Live Preview */}
          <Grid item xs={12} md={6} sx={{ maxWidth: 560, width: "100%" }}>
            <Paper
              elevation={2}
              sx={{ p: 3, borderRadius: 2, bgcolor: "white", position: { md: "sticky", xs: "relative" }, top: { md: 20, xs: 0 } }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, color: "#1a237e" }}>
                Live Preview
              </Typography>

              <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden", transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)", boxShadow: 6 } }}>
                {imagePreview ? (
                  <CardMedia component="img" height="280" image={imagePreview} alt="Preview" sx={{ objectFit: "cover" }} />
                ) : (
                  <Box sx={{ height: 280, bgcolor: "#e3f2fd", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <ImageIcon sx={{ fontSize: 64, color: "#90caf9" }} />
                    <Typography variant="body2" color="text.secondary" mt={2}>
                      No image uploaded
                    </Typography>
                  </Box>
                )}

                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: formData.title ? "#1a237e" : "#bbb", mb: 2 }}>
                    {formData.title || "Your Post Title"}
                  </Typography>

                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Category sx={{ color: "#666", fontSize: 20 }} />
                      <Typography variant="body2" color={formData.category ? "text.primary" : "text.secondary"}>
                        {formData.category || "Category not specified"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccountBalanceWallet sx={{ color: "#4caf50", fontSize: 20 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, color: formData.price ? "#4caf50" : "#bbb" }}>
                        {formData.price ? `LKR ${Number(formData.price).toLocaleString("en-LK")}` : "Price not set"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTime sx={{ color: "#666", fontSize: 20 }} />
                      <Typography variant="body2" color={formData.deliveryTime ? "text.primary" : "text.secondary"}>
                        {formData.deliveryTime || "Delivery time not specified"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone sx={{ color: "#666", fontSize: 20 }} />
                      <Typography variant="body2" color={formData.contact ? "text.primary" : "text.secondary"}>
                        {formData.contact || "Contact not provided"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2" color={formData.description ? "text.primary" : "text.secondary"} sx={{ mb: 2, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                    {limitWords(formData.description) || "Description will appear here..."}
                  </Typography>

                  {specializationsArray.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: "#1a237e" }}>
                        Specializations
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {specializationsArray.map((spec, index) => (
                          <Chip key={index} label={spec} size="small" sx={{ bgcolor: "#e3f2fd", color: "#1565c0", fontWeight: 500 }} />
                        ))}
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
