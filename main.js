import * as t from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import gsap from "gsap";
import "./style.css";

// Create the scene.
// create the renderer (pass canvas and add size);
// Add objects:
//    Mesh Geometry + Material
// Add objects to scene.
// Add Lights to scene.
// Add Camera to scene.
// Animate with requestAnimationFrame.

// Scene
const scene = new t.Scene();

// Size constant.
const s = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Renderer
const canvas = document.querySelector("canvas");
const renderer = new t.WebGLRenderer({ canvas });
renderer.setSize(s.width, s.height);

// ELEMENTS
// Cube
const geometry = new t.BoxGeometry(1, 1, 1);
const mesh = new t.MeshStandardMaterial({ color: 0x0000ff });
const cube = new t.Mesh(geometry, mesh);
scene.add(cube);

// Plane Geometry
const planeGeometry = new t.PlaneGeometry(30, 30);
const planeMaterial = new t.MeshBasicMaterial({
  color: 0xffffff,
  side: t.DoubleSide,
});
const plane = new t.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

const sphereGeometry = new t.TorusKnotGeometry(14, 3, 100, 30);
const sphereMaterial = new t.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
  wireframeLinejoin: "round",
});
const sphere = new t.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Axis helper
const axisHelper = new t.AxesHelper(5);
scene.add(axisHelper);

// Grid Helper
const gridHelper = new t.GridHelper(30, 10);
scene.add(gridHelper);

// LIGHTS, CAMERA, ACTION
// Light
const light = new t.AmbientLight(0xffffff);
scene.add(light);

// Camera
const camera = new t.PerspectiveCamera(45, s.width / s.height, 0.1, 1000);
// camera.position.z = 5;
camera.position.set(-10, 30, 30);
scene.add(camera);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  const s = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  camera.updateProjectionMatrix();
  camera.aspect = s.width / s.height;
  renderer.setSize(s.width, s.height);
});

const tl = gsap.timeline({
  defaults: {
    duration: 1,
  },
});

tl.fromTo(cube.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
