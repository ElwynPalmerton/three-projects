import * as t from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import "./style.css";
import * as dat from "dat.gui";
// import gsap.
// import dat.GUI.

// scene
// renderer
// camera

// lights
// geometry
// OrbitControls

// Setup

const scene = new t.Scene();
const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.querySelector("canvas");
const renderer = new t.WebGLRenderer({ canvas });
renderer.setSize(width, height);

const camera = new t.PerspectiveCamera(45, width / height, 1, 1000);
scene.add(camera);
camera.position.z = 10;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Add Object
// ? Research MeshBasicMaterial options.

const boxGeometry = new t.BoxGeometry(1, 1, 1);
// const boxMesh = new t.MeshBasicMaterial();
const boxMesh = new t.MeshStandardMaterial(0x999999);
const box = new t.Mesh(boxGeometry, boxMesh);
box.rotation.set(3, 4, 2);
scene.add(box);

// Add a light
// const light = new t.AmbientLight(0xffffff);
// scene.add(light);

// DirectionalLight
// const directionalLight = new t.DirectionalLight(0xffffff, 0.9);
// directionalLight.position.z = 0;
// directionalLight.position.x = 0;
// scene.add(directionalLight);
// const helper = new t.DirectionalLightHelper(directionalLight, 1);
// scene.add(helper);

// Spotlight

const spotLight = new t.SpotLight("#ffffff", 1);
spotLight.position.set(5, 3, 5);
scene.add(spotLight);
// ? Modulating a SpotLight with a texture loader?

const spotLightHelper = new t.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// AxesHelper
const axesHelper = new t.AxesHelper(5);
scene.add(axesHelper); // x: red, y: green, z: blue

const options = {
  boxColor: "#FFFFFF",
  angle: 0.2,
  penumbra: 0,
  intensity: 1,
};

// GUI
const gui = new dat.GUI();
const cubePositionFolder = gui.addFolder("Position");
cubePositionFolder.add(box.position, "x", -10, 10);
cubePositionFolder.add(box.position, "y", -10, 10);
cubePositionFolder.add(box.position, "z", -10, 10);

const cubeRotationFolder = gui.addFolder("Rotation");
cubeRotationFolder.add(box.rotation, "x", 0, Math.PI * 2);
cubeRotationFolder.add(box.rotation, "y", 0, Math.PI * 2);
cubeRotationFolder.add(box.rotation, "z", 0, Math.PI * 2);

// const lightPositionFolder = gui.addFolder("light");
// lightPositionFolder.add(directionalLight.position, "x", -10, 10);
// lightPositionFolder.add(directionalLight.position, "y", -10, 10);
// lightPositionFolder.add(directionalLight.position, "z", -10, 10);

// const lightRotationFolder = gui.addFolder("lightrotation");
// lightRotationFolder.add(directionalLight.rotation, "x", -10, 10);
// lightRotationFolder.add(directionalLight.rotation, "y", -10, 10);
// lightRotationFolder.add(directionalLight.rotation, "z", -10, 10);
// lightRotationFolder.open();

gui.addColor(options, "boxColor").onChange((e) => {
  box.material.color.set(e);
});

// ANIMATE
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  // box.rotation.x += 0.01;
  // box.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

// Other:

// spotLight GUI

// plane
// gridHelper.
// Shadows.

// fog

// window resize.
// gsap
