import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Divider,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Paper,
  LinearProgress,
} from "@mui/material";
import {
  AccessTime,
  Category,
  AccountBalanceWallet,
  Phone,
  Image as ImageIcon,
} from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";

export default function NewPost() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryTime: "",
    specializations: "",
    contact: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const maxWords = 150;

  const isLimitReached = wordCount >= maxWords;

  const countWords = (text) => {
    if (!text) return 0;
    return text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
  };

  const validate = (data = formData) => {
    let temp = {};
    if (touched.title) temp.title = data.title.trim() ? "" : "Title is required.";
    if (touched.category)
      temp.category = data.category.trim() ? "" : "Category is required.";
    if (touched.price) temp.price = data.price ? "" : "Price is required.";
    if (touched.deliveryTime)
      temp.deliveryTime = data.deliveryTime.trim()
        ? ""
        : "Delivery time is required.";
    if (touched.contact) {
      if (!data.contact.trim()) temp.contact = "Contact is required.";
      else if (!/^\d{10}$/.test(data.contact.trim()))
        temp.contact = "Phone number must be exactly 10 digits.";
      else temp.contact = "";
    }
    if (touched.description)
      temp.description =
        countWords(data.description) <= maxWords
          ? ""
          : `Description cannot exceed ${maxWords} words.`;

    return temp;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors(validate({ ...formData, [name]: formData[name] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") {
      const words = countWords(value);
      setWordCount(words);
      if (words <= maxWords) setFormData({ ...formData, [name]: value });
      return;
    }

    if (name === "contact") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData({ ...formData, [name]: value });
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
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);
    const validation = validate(formData);
    setErrors(validation);

    if (Object.values(validation).some((x) => x !== "")) return;

    try {
      setLoading(true);
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
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const specializationsArray = formData.specializations
    ? formData.specializations.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const limitWords = (text, max) => {
    if (!text) return "";
    const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
    if (words.length <= max) return text;
    return words.slice(0, max).join(" ") + "...";
  };

  const descOpacity =
    wordCount >= 120 && wordCount <= maxWords
      ? 0.5 + (maxWords - wordCount) / maxWords
      : wordCount > maxWords
      ? 0.4
      : 1;

  const isFormInvalid =
    isLimitReached ||
    loading ||
    Object.values(errors).some((v) => v !== "");

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, textAlign: "left" }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 700, color: "#1a237e" }}
          >
            Create New Post
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Fill in the details and see a live preview of your post
          </Typography>
        </Box>

        <Grid container spacing={5} alignItems="stretch">
          {/* Left Column - Form */}
          <Grid item xs={12} md={6} sx={{ maxWidth: 550, width: "100%" }}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: "white",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600, color: "#1a237e" }}
                  >
                    Post Details
                  </Typography>

                  {[
                    { label: "Title", name: "title" },
                    { label: "Category", name: "category" },
                    { label: "Price (LKR)", name: "price", type: "number" },
                    { label: "Delivery Time", name: "deliveryTime" },
                    { label: "Contact", name: "contact" },
                  ].map((field) => (
                    <TextField
                      key={field.name}
                      {...field}
                      value={formData[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      required
                      error={touched[field.name] && !!errors[field.name]}
                      helperText={touched[field.name] ? errors[field.name] : ""}
                      InputProps={{
                        style: {
                          opacity: touched[field.name] && errors[field.name] ? 0.5 : 1,
                        },
                      }}
                    />
                  ))}

                  {/* Description */}
                  <Box>
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
                      error={touched.description && !!errors.description}
                      helperText={
                        touched.description
                          ? errors.description ||
                            `${wordCount}/${maxWords} words`
                          : `${wordCount}/${maxWords} words`
                      }
                      FormHelperTextProps={{
                        sx: {
                          textAlign: "right",
                          color:
                            isLimitReached || errors.description
                              ? "error.main"
                              : "text.secondary",
                          fontWeight: 500,
                        },
                      }}
                      InputProps={{
                        style: { opacity: isLimitReached ? 0.5 : 1 },
                      }}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={(wordCount / maxWords) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        mt: 1,
                        bgcolor: "#e0e0e0",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: wordCount > 140 ? "#ef5350" : "#1a237e",
                        },
                      }}
                    />
                  </Box>

                  <TextField
                    label="Specializations (comma separated)"
                    name="specializations"
                    value={formData.specializations}
                    onChange={handleChange}
                    fullWidth
                    placeholder="React, Node.js, MongoDB"
                    helperText="Separate each specialization with a comma"
                  />

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                  >
                    {image ? "Change Image" : "Upload Image"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {image && (
                    <Typography
                      variant="caption"
                      color="success.main"
                      sx={{ mt: 1, display: "block" }}
                    >
                      ✓ {image.name}
                    </Typography>
                  )}

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
                        "&:hover": {
                          bgcolor: isFormInvalid ? "grey.500" : "#0d47a1",
                        },
                      }}
                    >
                      {loading ? "Creating..." : "Create Post"}
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
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "white",
                position: { md: "sticky", xs: "relative" },
                top: { md: 20, xs: 0 },
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, mb: 3, color: "#1a237e" }}
              >
                Live Preview
              </Typography>

              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                }}
              >
                {imagePreview ? (
                  <CardMedia
                    component="img"
                    height="280"
                    image={imagePreview}
                    alt="Preview"
                    sx={{ objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 280,
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
                )}

                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: formData.title ? "#1a237e" : "#bbb",
                      mb: 2,
                    }}
                  >
                    {formData.title || "Your Post Title"}
                  </Typography>

                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Category sx={{ color: "#666", fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        color={
                          formData.category ? "text.primary" : "text.secondary"
                        }
                      >
                        {formData.category || "Category not specified"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccountBalanceWallet sx={{ color: "#4caf50", fontSize: 20 }} />
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: formData.price ? "#4caf50" : "#bbb",
                        }}
                      >
                        {formData.price
                          ? `LKR ${Number(formData.price).toLocaleString("en-LK")}`
                          : "Price not set"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTime sx={{ color: "#666", fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        color={
                          formData.deliveryTime ? "text.primary" : "text.secondary"
                        }
                      >
                        {formData.deliveryTime || "Delivery time not specified"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone sx={{ color: "#666", fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        color={formData.contact ? "text.primary" : "text.secondary"}
                      >
                        {formData.contact || "Contact not provided"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="body2"
                    color={formData.description ? "text.primary" : "text.secondary"}
                    sx={{
                      mb: 2,
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                      opacity: descOpacity,
                    }}
                  >
                    {limitWords(formData.description, maxWords) ||
                      "Description will appear here..."}
                  </Typography>

                  {specializationsArray.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ fontWeight: 600, color: "#1a237e" }}
                      >
                        Specializations
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {specializationsArray.map((spec, index) => (
                          <Chip
                            key={index}
                            label={spec}
                            size="small"
                            sx={{
                              bgcolor: "#e3f2fd",
                              color: "#1565c0",
                              fontWeight: 500,
                            }}
                          />
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
