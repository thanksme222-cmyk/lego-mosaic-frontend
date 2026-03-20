// frontend/src/pages/Preview3D.jsx
import React, { useState } from "react";
import axios from "axios";

const Preview3D = () => {
  const [file, setFile] = useState(null);
  const [mosaicUrl, setMosaicUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to backend and get mosaic
  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "https://lego-mosaic-backend.onrender.com/upload",
        formData
      );

      // Set mosaic URL from backend response
      setMosaicUrl(
        "https://lego-mosaic-backend.onrender.com" + res.data.mosaicUrl
      );
      setLoading(false);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error processing image. Make sure backend is running.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>3D LEGO Mosaic Preview</h1>

      {/* File input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ margin: "10px 0" }}
      />

      <br />

      {/* Upload button */}
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Generate Mosaic"}
      </button>

      {/* Display result */}
      {mosaicUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2>Mosaic Result</h2>
          <img
            src={mosaicUrl}
            alt="Mosaic"
            style={{ maxWidth: "80%", border: "2px solid #ccc" }}
          />
        </div>
      )}
    </div>
  );
};

export default Preview3D;