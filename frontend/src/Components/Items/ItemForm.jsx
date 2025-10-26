// src/Components/Items/ItemForm.jsx
import React from "react";

export default function ItemForm({
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  onClose,
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "red",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "2px 8px",
            cursor: "pointer",
          }}
        >
          X
        </button>
        <h2>Create Item</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "10px", marginTop: "10px" }}
        >
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
          <button type="submit" style={{ marginTop: "10px" }}>
            Post AD
          </button>
        </form>
      </div>
    </div>
  );
}
