// src/Components/Items/ItemForm.jsx
import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Divider,
} from "@mui/material";

export default function ItemForm({
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  onClose,
}) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1200,
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 3,
          p: 4,
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            minWidth: "auto",
            bgcolor: "error.main",
            color: "#fff",
            "&:hover": { bgcolor: "error.dark" },
            borderRadius: 1,
            px: 1.5,
          }}
        >
          X
        </Button>

        <Typography variant="h5" fontWeight={600} gutterBottom>
          Create New Item
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Price (LKR)"
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            required
            fullWidth
          />

          <TextField
            label="Delivery Time"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleChange}
            placeholder="e.g., 2 Days"
            fullWidth
          />

          <TextField
            label="Specializations"
            name="specializations"
            value={formData.specializations}
            onChange={handleChange}
            placeholder="Separate with commas"
            fullWidth
          />

          <Button
            variant="outlined"
            component="label"
            sx={{ textTransform: "none" }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Post AD
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
