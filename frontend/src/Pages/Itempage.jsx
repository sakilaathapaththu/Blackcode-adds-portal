import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemForm from "../Components/Items/ItemForm";

const API_URL = "http://localhost:5000/api/items";

export default function Itempage() {
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
  const [isFormOpen, setIsFormOpen] = useState(false); // controls popup

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
      setIsFormOpen(false); // close modal after submit
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create item");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <button
        onClick={() => setIsFormOpen(true)}
        style={{
          background: "#007bff",
          color: "#fff",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        📢 Post Your AD
      </button>

      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
      {success && <p style={{ color: "green" }}>✅ {success}</p>}

      {isFormOpen && (
        <ItemForm
          formData={formData}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      <h2>Items</h2>
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
