import * as t from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import gsap from "gsap";
import "./style.css";
import * as dat from "dat.gui";
// import nebula from "./assets/nebula.avif";
import stars from "./assets/stars.jpg";
import "style.css";

// Create the scene.
// create the renderer (pass canvas and add size);
// Add objects:
//    Mesh Geometry + Material
// Add objects to scene.
// Add Lights to scene.
// Add Camera to scene.
// Animate with requestAnimationFrame.

// 37.08

// Scene
const scene = new t.Scene();
// scene.fog = new t.Fog(0xffffff, 0, 200);
scene.fog = new t.FogExp2(0xffffff, 0.01);

// Size constant.
const s = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Loader
const textureLoader = new t.TextureLoader();
// scene.background = textureLoader.load(stars);
const cubeTextureLoader = new t.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  stars,
  stars,
  stars,
  stars,
  stars,
  stars,
]);

// Renderer
const canvas = document.querySelector("canvas");
const renderer = new t.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(s.width, s.height);
renderer.setClearColor(0x00ffff);

// ELEMENTS
// Cube
const geometry = new t.BoxGeometry(1, 1, 1);
const mesh = new t.MeshStandardMaterial({ color: 0x0000ff });
const cube = new t.Mesh(geometry, mesh);
scene.add(cube);

// Plane Geometry
const planeGeometry = new t.PlaneGeometry(30, 30);
const planeMaterial = new t.MeshStandardMaterial({
  color: 0xffffff,
  side: t.DoubleSide,
});
const plane = new t.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const sphereGeometry = new t.SphereGeometry(4, 50, 50);
const sphereMaterial = new t.MeshStandardMaterial({
  color: 0x3377ff,
  wireframe: false,
});
const sphere = new t.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.castShadow = true;

// Axis helper
const axisHelper = new t.AxesHelper(5);
scene.add(axisHelper);

// Grid Helper
const gridHelper = new t.GridHelper(30, 10);
scene.add(gridHelper);

// LIGHTS, CAMERA, ACTION
// Light
// const light = new t.AmbientLight(0x00ffff);
// scene.add(light);

// const directionalLight = new t.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-10, 20, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.top = 15;

// const directionalLightHelper = new t.DirectionalLightHelper(
//   directionalLight,
//   5
// );
// scene.add(directionalLightHelper);

// const dLightShadowHelper = new t.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const spotLight = new t.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-10, 20, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new t.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// Camera
const camera = new t.PerspectiveCamera(45, s.width / s.height, 0.1, 1000);
// camera.position.z = 5;
camera.position.set(-10, 30, 30);
scene.add(camera);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// GUI
const gui = new dat.GUI();

const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1,
};

gui.addColor(options, "sphereColor").onChange(function (e) {
  sphere.material.color.set(e);
});

gui.add(options, "wireframe").onChange(function (e) {
  sphere.material.wireframe = e;
});

gui.add(options, "speed", 0, 0.1);

gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 1);

let step = 0;

// ANIMATE

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  sLightHelper.update();

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  const s = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  camera.updateProjectionMatrix(); // Must be called after updating any camera options.
  camera.aspect = s.width / s.height;
  renderer.setSize(s.width, s.height);
});

const tl = gsap.timeline({
  defaults: {
    duration: 1,
  },
});

tl.fromTo(cube.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
