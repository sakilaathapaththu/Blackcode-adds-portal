import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/items";

export default function ItemManager() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryTime: "",
    specializations: "",
  });
  const [posterImage, setPosterImage] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch items on load
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      setError("Failed to fetch items");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPosterImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      if (posterImage) {
        data.append("posterImage", posterImage);
      }

      // Convert specializations to JSON string
      data.set("specializations", JSON.stringify(formData.specializations.split(",")));

      await axios.post(API_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Item created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        deliveryTime: "",
        specializations: "",
      });
      setPosterImage(null);

      fetchItems(); // refresh list
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create item");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Create Item</h2>
      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
      {success && <p style={{ color: "green" }}>✅ {success}</p>}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="deliveryTime"
          placeholder="Delivery Time (e.g. 2 Days)"
          value={formData.deliveryTime}
          onChange={handleChange}
        />
        <input
          type="text"
          name="specializations"
          placeholder="Specializations (comma separated)"
          value={formData.specializations}
          onChange={handleChange}
        />
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Create Item</button>
      </form>

      <h2 style={{ marginTop: "30px" }}>Items</h2>
      {items.length === 0 ? (
        <p>No items found</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {items.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>
                <b>Category:</b> {item.category}
              </p>
              <p>
                <b>Price:</b> Rs.{item.price}
              </p>
              <p>
                <b>Delivery Time:</b> {item.deliveryTime}
              </p>
              <p>
                <b>Specializations:</b> {item.specializations?.join(", ")}
              </p>
              {/* Display image */}
              <img
                src={`${API_URL}/${item._id}/poster`}
                alt="poster"
                style={{ maxWidth: "200px", marginTop: "10px" }}
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
