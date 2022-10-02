<template>
  <main><canvas id="myCanvas"></canvas></main>
</template>

<script>
import * as THREE from "three";
import * as YUKA from "yuka";
import * as TWEEN from "@tweenjs/tween.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

var renderer = null;
var dood = null;
var plane = null;
var run = null;
var idle = null;
var mixer = null;
var mixerMainDood = null;
var camera = null;
var controls = null;
var actionSpeed = null;
const scene = new THREE.Scene();
const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const entityManager = new YUKA.EntityManager();
const vehicle = new YUKA.Vehicle();
const target = new YUKA.GameEntity();

// camera
function setCamera() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 7, 12);
  camera.lookAt(scene.position);
}

// background control
// function setControl() {
//   controls = new OrbitControls(camera, renderer.domElement);
//   controls.rotateSpeed = 0.5;
//   controls.enablePan = false;
//   controls.mouseButtons = {
//     LEFT: THREE.MOUSE.ROTATE,
//     MIDDLE: THREE.MOUSE.DOLLY,
//     RIGHT: THREE.MOUSE.PAN,
//   };
// }

// light
function setLight() {
  // Create ambient light and add to scene.
  var light = new THREE.AmbientLight(0xffffff, 1); // soft white light
  scene.add(light);
  light = new THREE.DirectionalLight(0xffffff, 3); // soft white light
  light.castShadow = true;
  light.shadow.camera.far = 20;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.normalBias = 0.05;
  light.position.set(1.5, 1, 3);
  scene.add(light);
}

// dood
function addDood() {
  vehicle.scale.set(0.5, 0.5, 0.5);

  entityManager.add(vehicle);

  const loader = new GLTFLoader();
  const group = new THREE.Group();
  loader.load("/src/dood.glb", function (glb) {
    dood = glb;
    dood.scene.matrixAutoUpdate = false;
    mixerMainDood = new THREE.AnimationMixer(dood.scene);
    group.add(dood.scene);
    group.position.z = 1;
    group.position.y = 0.5;
    scene.add(group);
    vehicle.setRenderComponent(dood.scene, sync);
  });
}

// ground
// function addGround() {
//   const geometry = new THREE.PlaneGeometry(100, 100);
//   const material = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     side: THREE.DoubleSide,
//   });
//   plane = new THREE.Mesh(geometry, material);
//   plane.rotation.x = Math.PI / 2;
//   plane.name = "plane";
//   scene.add(plane);
// }

function addBackGround() {
  const loader = new GLTFLoader();
  loader.load("/src/background.glb", function (glb) {
    let background = glb;
    mixer = new THREE.AnimationMixer(background.scene);
    const clips = background.animations;
    clips.forEach((ani) => {
      const animation = THREE.AnimationClip.findByName(clips, ani.name);
      let animationAction = mixer.clipAction(animation);
      animationAction.play();
    });
    // let hiAnimation = THREE.AnimationClip.findByName(clips, "hi.action");
    // let hiAction = mixer.clipAction(hiAnimation);
    // hiAction.play();
    scene.add(background.scene);
  });
}

function sync(entity, renderComponent) {
  renderComponent.matrix.copy(entity.worldMatrix);
}

// setup
function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector("#myCanvas"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.CineonToneMapping;
  renderer.toneMappingExposure = 1.75;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  setCamera();
  // setControl();
  setLight();
  // addGround();
  addDood();
  addBackGround();

  target.setRenderComponent(plane, sync);
  entityManager.add(target);

  const arriveBehavior = new YUKA.ArriveBehavior(target.position, 1, 0.5);
  vehicle.steering.add(arriveBehavior);
  renderer.setAnimationLoop(animate);
}

function animate() {
  entityManager.update(0.05);
  TWEEN.update();

  if (mixerMainDood) {
    mixerMainDood.update(actionSpeed);
  }

  if (mixer) {
    mixer.update(0.01);
  }

  renderer.render(scene, camera);
}

window.addEventListener("mousedown", function (e) {
  mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / this.window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mousePosition, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects[0].object.name === "plane") {
    const p = intersects[0].point;
    const distance = target.position.distanceTo(p);
    const move = new TWEEN.Tween({
      x: target.position.x,
      y: 0,
      z: target.position.z,
    }).to(
      {
        x: intersects[0].point.x,
        y: 0,
        z: intersects[0].point.z,
      },
      (500 / 2.2) * distance
    );
    const clips = dood.animations;
    idle = THREE.AnimationClip.findByName(clips, "idle.action");
    run = THREE.AnimationClip.findByName(clips, "run.action");
    let runAction = mixerMainDood.clipAction(run);
    let idleAction = mixerMainDood.clipAction(idle);
    move
      .onUpdate(function (object) {
        actionSpeed = 0.05;
        idleAction.stop();
        // idleAction.fadeOut(0.1);
        // runAction.reset();
        runAction.play();
        // runAction.fadeIn(0.1);
        target.position.set(object.x, object.y, object.z);
        camera.position.set(target.position.x, 7, target.position.z + 12);
        camera.lookAt(target.position.x, target.position.y, target.position.z);
      })
      .start()
      .onComplete(() => {
        // runAction.fadeOut(0.1);
        runAction.stop();
        // idleAction.reset();
        idleAction.play();
        actionSpeed = 0.005;
        // idleAction.fadeIn(0.1);
      });
  }
});
window.addEventListener("DOMContentLoaded", init);
</script>
