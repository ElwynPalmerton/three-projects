import * as t from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import gsap from "gsap";
import "./style.css";
import * as dat from "dat.gui";
import nebula from "./assets/nebula.avif";
import stars from "./assets/stars.jpg";
import "./style.css";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Create the scene.
// create the renderer (pass canvas and add size);
// Add objects:
//    Mesh Geometry + Material
// Add objects to scene.
// Add Lights to scene.
// Add Camera to scene.
// Animate with requestAnimationFrame.

const monkeyUrl = new URL("../assets.monkey.glb", import.meta.url);

const assetLoader = new GLTFLoader();

assetLoader.load(monkeyUrl.href, function (gltf) {
  const model = gltf.scene;
});

assetLoader.load;

// ? Scene
const scene = new t.Scene();
// scene.fog = new t.Fog(0xffffff, 0, 200);
scene.fog = new t.FogExp2(0xffffff, 0.01);

// ? Size constant.
const s = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// ? Background with Loader
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

// ? Box with Loader
const textureLoader = new t.TextureLoader();
const box2Geometry = new t.BoxGeometry(4, 4, 4);
const box2Material = new t.MeshBasicMaterial({
  // color: 0x009ff00,
  map: textureLoader.load(nebula),
});

const box2 = new t.Mesh(box2Geometry, box2Material);
scene.add(box2);
box2.position.set(-10, 0, -10);

// ? Renderer
const canvas = document.querySelector("canvas");
const renderer = new t.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(s.width, s.height);
renderer.setClearColor(0x00ffff);

// ? ELEMENTS
// Cube

const geometry = new t.BoxGeometry(1, 1, 1);
const mesh = new t.MeshStandardMaterial({ color: 0x0000ff });
const cube = new t.Mesh(geometry, mesh);
scene.add(cube);

// ? Plane Geometry
const planeGeometry = new t.PlaneGeometry(30, 30);
const planeMaterial = new t.MeshStandardMaterial({
  color: 0xffffff,
  side: t.DoubleSide,
});
const plane = new t.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;
plane.position.set(0, -1, 0);

const plane2Geometry = new t.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new t.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});

const plane2 = new t.Mesh(plane2Geometry, plane2Material);
plane2.position.set(5, 5);
scene.add(plane2);
plane2.geometry.attributes.position.array[0] = 10 * Math.random();
plane2.geometry.attributes.position.array[1] = 10 * Math.random();
plane2.geometry.attributes.position.array[2] = 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();

// ? Axis helper
const axisHelper = new t.AxesHelper(5);
scene.add(axisHelper);

// ? Grid Helper
const gridHelper = new t.GridHelper(20, 20);
scene.add(gridHelper);
gridHelper.position.y = -1;

// ? SPHERE
const sphereGeometry = new t.SphereGeometry(4, 50, 50);
const sphereMaterial = new t.MeshStandardMaterial({
  color: 0x0000ff,
  wireframe: false,
});

const sphere = new t.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 0, 0);
sphere.castShadow = true;
const sphereId = sphere.id;

// sphere2

// const vShader = `
//   void main() {
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;

// const fShader = `
//   void main() {
//     gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
//   }
// `;

const sphere2Geometry = new t.SphereGeometry(4, 50, 50);
const sphere2Material = new t.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
});
const sphere2 = new t.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

// console.log(sphere);

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

// ? Spot

const spotLight = new t.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-10, 20, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new t.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// ? Camera
const camera = new t.PerspectiveCamera(45, s.width / s.height, 0.1, 1000);
// camera.position.z = 5;
camera.position.set(-10, 30, 30);
scene.add(camera);

// ? OrbitControls

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ? GUI
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

// ? mouse position

const mousePosition = new t.Vector2(-1, -1);

window.addEventListener("mousemove", function (e) {
  // console.log("setting");
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = (e.clientY / window.innerHeight) * -2 + 1;
  // console.log(mousePosition);
});

const rayCaster = new t.Raycaster();

// ? ANIMATE

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  // todo Does this work if I just add it directly to the gui?
  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  sLightHelper.update();

  // plane2.geometry.attributes.position.array[0] = 10 * Math.random();
  // plane2.geometry.attributes.position.array[1] = 10 * Math.random();
  // plane2.geometry.attributes.position.array[2] = 10 * Math.random();
  // plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
  // plane2.geometry.attributes.position.needsUpdate = true;

  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  // console.log(intersects);

  for (let i = 0; i < intersects.length; i++) {
    // console.log(sphereId);
    // console.log(intersects[i]);
    if (intersects[i].object.id === sphereId) {
      // console.log("true");
      intersects[i].object.material.color.set(0x00ff00);
    }
  }

  renderer.render(scene, camera);
}

animate();

// * Resize

// window.addEventListener("resize", () => {
//   const s = {
//     width: window.innerWidth,
//     height: window.innerHeight,
//   };

//   camera.updateProjectionMatrix(); // Must be called after updating any camera options.
//   camera.aspect = s.width / s.height;
//   renderer.setSize(s.width, s.height);
// });

const tl = gsap.timeline({
  defaults: {
    duration: 1,
  },
});

tl.fromTo(cube.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
