// frontend/src/pages/Preview3D.jsx
import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Preview3D = ({ width = 32, height = 32 }) => {
  const mountRef = useRef(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [imageData, setImageData] = useState(null);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageData(ev.target.result); // base64 string
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!imageData) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(600, 600);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Load image and generate cubes
    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const pixels = ctx.getImageData(0, 0, width, height).data;

      const cellWidth = 1;
      const cellHeight = 1;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const a = pixels[idx + 3];

          if (a === 0) continue;

          // Clamp positions with Math.min (Option 2)
          const px = Math.min(Math.floor(x * cellWidth + cellWidth / 2), width - 1);
          const py = Math.min(Math.floor(y * cellHeight + cellHeight / 2), height - 1);

          const geometry = new THREE.BoxGeometry(cellWidth, cellHeight, cellWidth);
          const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(r / 255, g / 255, b / 255) });
          const cube = new THREE.Mesh(geometry, material);
          cube.position.set(px - width / 2, -(py - height / 2), 0);
          scene.add(cube);
        }
      }

      setSceneReady(true);
    };

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [imageData, width, height]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>3D LEGO Mosaic Preview</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {!sceneReady && imageData && <p>Loading preview...</p>}
      <div ref={mountRef} style={{ marginTop: "20px" }}></div>
    </div>
  );
};

export default Preview3D;