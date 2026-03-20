// Preview3D.jsx
import React, { useState } from "react";
import axios from "axios";

const Preview3D = () => {
  const [file, setFile] = useState(null);
  const [mosaicUrl, setMosaicUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMosaicUrl(""); // clear previous
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file); // ✅ must match Multer key

      // Upload to backend
      const uploadRes = await axios.post(
        "https://lego-mosaic-backend.onrender.com/upload",
        formData
      );

      const filename = uploadRes.data.filename;

      // Generate mosaic
      const mosaicRes = await axios.post(
        "https://lego-mosaic-backend.onrender.com/mosaic",
        { imagePath: `uploads/${filename}`, size: 32 } // size = free version
      );

      setMosaicUrl(mosaicRes.data.mosaicUrl); // URL returned by backend
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error processing image. Check backend logs!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">LEGO Mosaic Tool</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Processing..." : "Upload & Generate Mosaic"}
      </button>

      {mosaicUrl && (
        <div>
          <h2 className="text-xl font-semibold mb-2">3D Mosaic Preview:</h2>
          <img src={mosaicUrl} alt="Mosaic" className="w-full border" />
        </div>
      )}
    </div>
  );
};

export default Preview3D;