import * as t from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import "./style.css";
import * as dat from "dat.gui";
import stars from "./assets/stars.jpg";
// import gsap.

// Setup

const scene = new t.Scene();

const cubeTextureLoader = new t.CubeTextureLoader();

scene.background = cubeTextureLoader.load([
  stars,
  stars,
  stars,
  stars,
  stars,
  stars,
]);

// scene.background = new t.Color(0x333333);

const textureLoader = new t.TextureLoader();
const box2Geometry = new t.BoxGeometry(3, 3, 3);
const box2Material = new t.MeshBasicMaterial({
  map: textureLoader.load(stars),
});

const box2 = new t.Mesh(box2Geometry, box2Material);
box2.position.set(3, 3, 3);
scene.add(box2);

const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.querySelector("canvas");
const renderer = new t.WebGLRenderer({ canvas });
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;

const camera = new t.PerspectiveCamera(45, width / height, 1, 1000);
scene.add(camera);
camera.position.z = 20;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.fog = new t.FogExp2(0xcccccc, 0.03);

// ? OBJECTS

const boxGeometry = new t.BoxGeometry(1, 1, 1);
// const boxMesh = new t.MeshBasicMaterial();
const boxMesh = new t.MeshStandardMaterial(0x999999);
const box = new t.Mesh(boxGeometry, boxMesh);
box.rotation.set(3, 4, 2);
scene.add(box);

// Plane
const planeGeometry = new t.PlaneGeometry(10, 10);
const planeMaterial = new t.MeshStandardMaterial({
  color: 0x999999,
  side: t.DoubleSide,
});
const plane = new t.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.position.y = -1;

// AxesHelper - x: red, y: green, z: blue
const axesHelper = new t.AxesHelper(5);
scene.add(axesHelper); // x: red, y: green, z: blue

// GridHelper

const gridHelper = new t.GridHelper(10, 10);
scene.add(gridHelper);
gridHelper.position.y = -1;

// Sphere

// const sphereGeometry = new t.SphereGeometry(2, 32, 32);
// const sphereMaterial = new t.MeshStandardMaterial({
//   color: 0x0000ff,
//   // wireframe: true,
// });
// const sphere = new t.Mesh(sphereGeometry, sphereMaterial);
// scene.add(sphere);
// sphere.castShadow = true;

// Multiple Spheres:

const numSpheres = 3;
const spheres = [];
for (let i = 0; i < numSpheres; i++) {
  const sphereGeometry = new t.SphereGeometry(1, 32, 32);
  const sphereMaterial = new t.MeshStandardMaterial({
    color: 0x0000ff,
  });
  spheres[i] = new t.Mesh(sphereGeometry, sphereMaterial);
  spheres[i].position.y = i * 2;
  spheres[i].position.x = i;
  spheres[i].position.z = i * -3 + 3;
  scene.add(spheres[i]);
  spheres[i].name = "sphere";
}

console.log(spheres);
// ? LIGHTS

// const light = new t.AmbientLight(0xffffff);
// scene.add(light);

// DirectionalLight
const directionalLight = new t.DirectionalLight(0xffffff, 0.9);
directionalLight.position.z = 0;
directionalLight.position.y = 5;
// scene.add(directionalLight);

const helper = new t.DirectionalLightHelper(directionalLight, 3);
helper.position.set(5, 5, 5);
scene.add(helper);

// Spotlight
const spotLight = new t.SpotLight("#ffffff", 1);
spotLight.position.set(5, 3, 5);
scene.add(spotLight);
spotLight.castShadow = true;

const spotLightHelper = new t.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const options = {
  boxColor: "#FFFFFF",
  angle: 0.8,
  penumbra: 0,
  intensity: 1,
};

// ? GUI
const gui = new dat.GUI();
const cubePositionFolder = gui.addFolder("Position");
cubePositionFolder.add(box.position, "x", -10, 10);
cubePositionFolder.add(box.position, "y", -10, 10);
cubePositionFolder.add(box.position, "z", -10, 10);

const cubeRotationFolder = gui.addFolder("Rotation");
cubeRotationFolder.add(box.rotation, "x", 0, Math.PI * 2);
cubeRotationFolder.add(box.rotation, "y", 0, Math.PI * 2);
cubeRotationFolder.add(box.rotation, "z", 0, Math.PI * 2);

const spotlightFolder = gui.addFolder("Spot");
spotlightFolder.add(options, "angle", 0, 1);
spotlightFolder.add(options, "penumbra", 0, 1);
spotlightFolder.add(options, "intensity", 0, 1);

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

// RayCasting

const rayCaster = new t.Raycaster();
const pointer = new t.Vector2(1.01, 1.01);

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function renderRay() {
  rayCaster.setFromCamera(pointer, camera);
  const intersects = rayCaster.intersectObjects(scene.children);

  intersects.forEach((intersect) => {
    if (intersect.object.name === "sphere")
      intersect.object.material.color.set(0xff0000);
  });
}

window.addEventListener("mousemove", onPointerMove);

// ANIMATE
function animate() {
  renderRay();
  requestAnimationFrame(animate);
  controls.update();
  spotLight.intensity = options.intensity;
  spotLight.penumbra = options.penumbra;
  spotLight.angle = options.angle;
  // box.rotation.x += 0.01;
  // box.rotation.y += 0.01;
  spotLightHelper.update();
  helper.update();

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  const s = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  camera.aspect = s.width / s.height;
  camera.updateProjectionMatrix();
  renderer.setSize(s.width, s.height);
});

// Change plane points.

// camera.lookAt(0, 0, 0);

// Make shapes and lights move around with dat.GUI
// Research "instance mode."

// gsap
