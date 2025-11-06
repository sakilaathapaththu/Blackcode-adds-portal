
// src/Pages/Posts/EditPost.jsx (or wherever your EditPost lives)
import React, { useEffect, useMemo, useState, useContext } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Stack,
  Button,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Image as ImageIcon, Save as SaveIcon, Upload as UploadIcon } from "@mui/icons-material";
import http from "../../Utils/http";
import { AuthContext } from "../../Context/AuthContext";

// ---------- Category options ----------
const CATEGORY_OPTIONS = [
  "All Categories",
  "Web Development",
  "Design",
  "Marketing",
  "AI & ML",
  "Consulting",
  "Content Writing",
  "Education",
  "Others",
];

// ---------- Helpers ----------
// ✅ Robust image URL builder:
// - Absolute URLs → return as-is
// - Ensure leading slash for relative paths
// - Accept both '/uploads/...' and '/api/uploads/...'
// - If path doesn’t start with '/api/', prefix with axios base (which ends with /api in prod)
const fileURL = (rel) => {
  if (!rel) return null;

  // already absolute?
  if (/^https?:\/\//i.test(rel)) return rel;

  // normalise leading slash
  let p = rel.startsWith("/") ? rel : `/${rel}`;

  // if backend returned '/api/...', keep as-is
  if (p.startsWith("/api/")) return p;

  // otherwise prefix with axios baseURL (defaults to '/api')
  const base = (http.defaults?.baseURL || "/api").replace(/\/+$/, "");
  return `${base}${p}`; // e.g. '/api' + '/uploads/foo.jpg'
};

const asString = (v) => (v === null || v === undefined ? "" : String(v));
const asNumberOrEmpty = (v) => {
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : "";
};

// Convert server date → local "YYYY-MM-DDTHH:mm" for <input type="datetime-local">
const toLocalInput = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

// Keep the local value as-is for backend parsing
const fromLocalInput = (v) => v || "";

// ---------- Component ----------
export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  const isAdmin = user?.role === "provider";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    deliveryTime: "",
    contact: "",
    specializationsText: "",
    startDate: "",
    endDate: "",
    status: "pending",
    sponsored: false,
    imagePath: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const previewSrc = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return form.imagePath ? fileURL(form.imagePath) : null;
  }, [imageFile, form.imagePath]);

  useEffect(() => {
    let revoked = false;
    const fetchOne = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await http.get(`/posts/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const p = res.data || {};
        setForm({
          title: asString(p.title),
          description: asString(p.description),
          price: asNumberOrEmpty(p.price),
          category: asString(p.category),
          deliveryTime: asString(p.deliveryTime),
          contact: asString(p.contact),
          specializationsText: Array.isArray(p.specializations) ? p.specializations.join(", ") : "",
          startDate: toLocalInput(p.startDate),
          endDate: toLocalInput(p.endDate),
          status: asString(p.status || "pending"),
          sponsored: !!p.sponsored,
          imagePath: asString(p.image || ""),
        });
      } catch (e) {
        setError(e?.message || "Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    fetchOne();

    return () => {
      if (!revoked && imageFile) {
        URL.revokeObjectURL(imageFile);
        revoked = true;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  // ----- validation -----
  const validate = (data) => {
    const errs = {};
    const title = asString(data.title).trim();
    const desc = asString(data.description).trim();
    const priceStr = asString(data.price).trim();
    const category = asString(data.category).trim();

    if (!title) errs.title = "Title is required";
    if (!desc) errs.description = "Description is required";
    if (!category) errs.category = "Category is required";

    if (!priceStr) {
      errs.price = "Price is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(priceStr)) {
      errs.price = "Enter a valid number (max 2 decimals)";
    } else if (Number(priceStr) < 0) {
      errs.price = "Price must be ≥ 0";
    }

    if (data.startDate && data.endDate) {
      const sd = new Date(data.startDate);
      const ed = new Date(data.endDate);
      if (sd > ed) errs.endDate = "End date must be after start date";
    }
    return errs;
  };

  const [fieldErrors, setFieldErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleBlur = () => {
    setFieldErrors(validate(form));
  };

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
  };

  const parseSpecializations = (txt) =>
    txt
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      setSaving(true);
      setError("");

      const fd = new FormData();
      fd.append("title", asString(form.title).trim());
      fd.append("description", asString(form.description).trim());
      fd.append("price", asString(form.price).trim());
      fd.append("category", asString(form.category).trim());
      if (form.deliveryTime) fd.append("deliveryTime", asString(form.deliveryTime).trim());
      if (form.contact) fd.append("contact", asString(form.contact).trim());

      // Even though fields are disabled, we keep sending the original values (read-only display)
      if (form.startDate) fd.append("startDate", fromLocalInput(form.startDate));
      if (form.endDate) fd.append("endDate", fromLocalInput(form.endDate));

      fd.append("specializations", JSON.stringify(parseSpecializations(form.specializationsText)));

      if (isAdmin) {
        fd.append("status", form.status);
        fd.append("sponsored", form.sponsored ? "1" : "0");
      }

      if (imageFile) fd.append("image", imageFile);

      await http.put(`/posts/${id}`, fd, {
        headers: { Authorization: `Bearer ${token}` }, // let browser set multipart boundary
      });

      navigate("/profile");
    } catch (e2) {
      setError(e2?.message || "Failed to update post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 10, md: 12 } }}>
        <Typography>Loading…</Typography>
      </Container>
    );
  }

  // If the existing category from server isn’t in the list, keep it selectable
  const categoryOptions = CATEGORY_OPTIONS.includes(form.category)
    ? CATEGORY_OPTIONS
    : form.category
    ? [form.category, ...CATEGORY_OPTIONS]
    : CATEGORY_OPTIONS;

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 9, md: 10 }, mb: 4 }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
        Edit Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }} component="form" onSubmit={onSubmit}>
        <Stack spacing={2}>
          {/* Image preview + picker */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 180, sm: 220 },
              borderRadius: 1.5,
              overflow: "hidden",
              bgcolor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {previewSrc ? (
              <Box
                component="img"
                src={previewSrc}
                alt="preview"
                sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            ) : (
              <Stack alignItems="center" spacing={1} color="text.secondary">
                <ImageIcon />
                <Typography variant="body2">No image uploaded</Typography>
              </Stack>
            )}
          </Box>

          <Button
            component="label"
            startIcon={<UploadIcon />}
            variant="outlined"
            sx={{ alignSelf: "flex-start", textTransform: "none" }}
          >
            Choose Image
            <input type="file" hidden accept="image/*" onChange={onPickImage} />
          </Button>

          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!fieldErrors.title}
            helperText={fieldErrors.title}
            fullWidth
            required
          />

          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!fieldErrors.description}
            helperText={fieldErrors.description}
            fullWidth
            multiline
            minRows={4}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Price (LKR)"
              name="price"
              value={asString(form.price)}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!fieldErrors.price}
              helperText={fieldErrors.price}
              fullWidth
              inputMode="decimal"
            />
            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!fieldErrors.category}
              helperText={fieldErrors.category}
              fullWidth
              select
            >
              {categoryOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Delivery Time (days)"
              name="deliveryTime"
              value={form.deliveryTime}
              onChange={handleChange}
              fullWidth
              inputMode="numeric"
            />
            <TextField
              label="Contact"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              fullWidth
            />
          </Stack>

          <TextField
            label="Specializations (comma separated)"
            name="specializationsText"
            value={form.specializationsText}
            onChange={handleChange}
            placeholder="Python, ML, React"
            fullWidth
          />

          {/* READ-ONLY WINDOW FIELDS */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Start Date"
              name="startDate"
              type="datetime-local"
              value={form.startDate || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 60 }}
              disabled
              InputProps={{ readOnly: true }}
              helperText="This field is not editable."
            />
            <TextField
              label="End Date"
              name="endDate"
              type="datetime-local"
              value={form.endDate || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!fieldErrors.endDate}
              helperText={fieldErrors.endDate || "This field is not editable."}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 60 }}
              disabled
              InputProps={{ readOnly: true }}
            />
          </Stack>

          {isAdmin && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <TextField
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                select
                sx={{ minWidth: { sm: 220 } }}
              >
                {["pending", "approved", "canceled"].map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.sponsored}
                    onChange={(e) => setForm((f) => ({ ...f, sponsored: e.target.checked }))}
                  />
                }
                label="Sponsored"
              />
            </Stack>
          )}

          <Stack direction="row" spacing={1}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving}
              sx={{ textTransform: "none", fontWeight: 700, px: 3 }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="text" onClick={() => navigate(-1)} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
