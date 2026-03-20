import { useEffect, useRef } from "react"
import * as THREE from "three"
import { combineBricks } from "../../utils/combineBricks"

export default function ThreeViewer({ grid }) {

  const mountRef = useRef(null)

  useEffect(() => {
    if (!grid || !mountRef.current) return

    const mount = mountRef.current

    // Clear old canvas
    mount.innerHTML = ""

    // Scene, camera, renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(500, 500)
    mount.appendChild(renderer.domElement)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(10, 20, 10)
    scene.add(dirLight)

    // Combine bricks
    const bricks = combineBricks(grid)

    bricks.forEach((brick) => {
      const geometry = new THREE.BoxGeometry(brick.width, 0.8, brick.height)
      const material = new THREE.MeshStandardMaterial({
        color: `rgb(${brick.color.r},${brick.color.g},${brick.color.b})`
      })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(brick.x + brick.width / 2, 0, -(brick.y + brick.height / 2))
      scene.add(cube)
    })

    camera.position.set(bricks.length/2, bricks.length, bricks.length)
    camera.lookAt(0,0,0)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      scene.rotation.y += 0.002
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      mount.innerHTML = ""
    }

  }, [grid])

  return <div ref={mountRef}></div>
}