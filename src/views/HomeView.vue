<template>
  <main>
    <!-- <canvas
      ref="constellationBG"
      style="width: 100%; height: -webkit-fill-available"
    ></canvas> -->
    <!-- <el-progress :percentage="progressValue" /> -->
    <div class="progress-bar-contain">
      <progress value="0" max="100" id="progress-bar"></progress>
    </div>
    <button
      @click="stopMusic"
      style="position: absolute"
      class="stop-btn"
      id="stop-btn"
    >
      Stop music
    </button>
    <button
      @click="replayMusic"
      style="position: absolute"
      class="replay-btn"
      id="replay-btn"
    >
      Replay music
    </button>
  </main>
</template>

<style lang="scss">
.progress-bar-contain {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  #progress-bar {
    width: 30%;
  }
}

.stop-btn,
.replay-btn {
  display: none;
  top: 20px;
  right: 20px;
}
</style>

<script setup>
import * as THREE from "three";
import gsap from "gsap";
import * as TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// let progressValue = ref(20);
let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let mixer = null;
let clips = null;
let manager = new THREE.LoadingManager();
let loader = new GLTFLoader(manager);
let raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const audioListener = new THREE.AudioListener();
let oceanAmbientSound = null;
let coffeeShop = null;
let meeShop = null;
let doodBar = null;
let starShop = null;
let temple = null;
let startLogo = null;
let startBtn = null;

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  var intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    if (startLogo) {
      scene.remove(startLogo);
      scene.remove(startBtn);
      addBoard();
      startLogo = null;
      startBtn = null;
    }
    intersects.forEach((item) => {
      switch (item.object.name) {
        case "Discord":
          window.open("https://discord.gg/UAJsWwZygr", "_blank");
          break;
        case "OpenSea":
          window.open("https://opensea.io/collection/apeironplanet", "_blank");
          break;
        case "twitter":
          window.open("https://twitter.com/ApeironNFT", "_blank");
          break;
        case "telegram":
          window.open("https://t.me/apeiron_official", "_blank");
          break;
        case "website":
          window.open("https://apeironnft.com/", "_blank");
          break;
        case "market":
          window.open("https://marketplace.apeironnft.com/", "_blank");
          break;
        case "planetCoffeetab":
          if (!coffeeShop) {
            if (oceanAmbientSound) {
              stopMusic();
              oceanAmbientSound = null;
            }
            return new Promise((rex) => rex())
              .then(() => {
                deleteScene();
              })
              .then(() => {
                addCoffeeShop();
              });
          }
          break;
        case "starSaletab":
          if (!starShop) {
            if (oceanAmbientSound) {
              stopMusic();
              oceanAmbientSound = null;
            }
            return new Promise((rex) => rex())
              .then(() => {
                deleteScene();
              })
              .then(() => {
                addStarShop();
              });
          }
          addStarShop();
          break;
        case "doodBartab":
          if (oceanAmbientSound) {
            stopMusic();
            oceanAmbientSound = null;
          }
          deleteScene();
          addDoodBar();
          break;
        case "prayTempletab":
          if (oceanAmbientSound) {
            stopMusic();
            oceanAmbientSound = null;
          }
          deleteScene();
          addTemple();
          break;
        case "meeShoptab":
          if (oceanAmbientSound) {
            stopMusic();
            oceanAmbientSound = null;
          }
          deleteScene();
          addMeeShop();
          break;
        case "Cylinder013_10":
          barDoorAnimation();
          break;
        case "polySurface622_lambert6_0_1":
          coffeeDoorAnimation();
          break;
      }
    });
  }
}

function deleteScene() {
  if (coffeeShop) {
    scene.remove(coffeeShop);
    coffeeShop = null;
  }
  if (meeShop) {
    scene.remove(meeShop);
    meeShop = null;
  }
  if (doodBar) {
    scene.remove(doodBar);
    doodBar = null;
  }
  if (starShop) {
    scene.remove(starShop);
    starShop = null;
  }
  if (temple) {
    scene.remove(temple);
    temple = null;
  }
}

function init() {
  scene = new THREE.Scene();

  // camera setup
  camera = new THREE.PerspectiveCamera(
    12,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  // this.camera.rotation.set(-2.91, 1.47, 0.07);
  camera.position.set(9.076, 16.024, 40);

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

  const progressBar = document.getElementById("progress-bar");
  const progressBarContain = document.querySelector(".progress-bar-contain");
  manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    progressBarContain.style.display = "flex";
    progressBar.value = (itemsLoaded / itemsTotal) * 100;
    // progressValue.value = (itemsLoaded / itemsTotal) * 100;
  };

  manager.onLoad = function () {
    progressBarContain.style.display = "none";
    console.log("Loading complete!");
  };

  addStartLogo();
  addStartBtn();

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  // render
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.CineonToneMapping;
  renderer.toneMappingExposure = 1.75;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  controls = new OrbitControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };
  controls.listenToKeyEvents(window);
  document.body.appendChild(renderer.domElement);
}

function addStartLogo() {
  loader.load(
    "./src/logo.glb",
    (gltf) => {
      startLogo = gltf.scene;
      // camera.lookAt(
      //   startLogo.position.x,
      //   startLogo.position.y,
      //   startLogo.position.z
      // );
      // controls.target.set(
      //   startLogo.position.x,
      //   startLogo.position.y,
      //   startLogo.position.z
      // );
      gsap.to(camera.position, {
        x: startLogo.position.x,
        y: startLogo.position.y,
        z: 30,
        duration: 5,
        onUpdate: function () {
          camera.lookAt(0, 0, 0);
        },
      });
      new TWEEN.Tween(startLogo.rotation)
        .repeat(Infinity)
        .to({ x: 0, y: Math.PI, z: 0 })
        .duration(5000)
        .start();
      scene.add(gltf.scene);
    },
    undefined,
    function (err) {
      console.log(err);
    }
  );
}

function addStartBtn() {
  loader.load(
    "./src/startBtn.glb",
    (gltf) => {
      startBtn = gltf.scene;
      scene.add(gltf.scene);
    },
    undefined,
    function (err) {
      console.log(err);
    }
  );
}

function addCoffeeShop() {
  console.log("debug here");
  addObject("src/coffeeShop.glb", "coffeeShop");
}

function addMeeShop() {
  addObject("src/meeShop.glb", "meeShop");
}

function addDoodBar() {
  // this.addObject("./src/doodBar.glb", "doodBar");
  loader.load(
    "src/doodBar.glb",
    (gltf) => {
      doodBar = gltf.scene;
      // gltf.scene.position.set(-5, 0, -10);
      scene.add(gltf.scene);
      gsap.to(camera.position, {
        x: 0,
        y: 35,
        z: 80,
        duration: 3,
        onUpdate: function () {
          camera.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
        },
      });
      scene.background = new THREE.Color(0x000000);
      scene.add(gltf.scene);
      mixer = new THREE.AnimationMixer(gltf.scene);
      clips = gltf.animations;

      clips.forEach((ani) => {
        if (ani.name != "bar_doorAction" && ani.name != "Cylinder.028Action") {
          const animation = THREE.AnimationClip.findByName(clips, ani.name);
          let animationAction = mixer.clipAction(animation);
          animationAction.play();
        }
      });
    },
    undefined,
    function (err) {
      console.log(err);
    }
  );
  document.getElementById("stop-btn").style.display = "none";
  document.getElementById("replay-btn").style.display = "none";
}

function addStarShop() {
  loader.load(
    "src/starShop.glb",
    (gltf) => {
      starShop = gltf.scene;
      scene.background = new THREE.Color(0xbfe3dd);
      scene.add(gltf.scene);
      gsap.to(camera.position, {
        x: 0,
        y: 80,
        z: 130,
        duration: 3,
        onUpdate: function () {
          camera.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
        },
      });
      mixer = new THREE.AnimationMixer(gltf.scene);
      clips = gltf.animations;

      // cat
      const cat = THREE.AnimationClip.findByName(clips, "Take 001");
      let catAction = mixer.clipAction(cat);
      catAction.play();
      carAnimation();
      // doods
      callAnimation("Cube.020Action");
      callAnimation("dood1Action");
    },
    undefined,
    function (err) {
      console.log(err);
    }
  );
  document.getElementById("stop-btn").style.display = "none";
  document.getElementById("replay-btn").style.display = "none";
}

function addTemple() {
  loader.load(
    "src/temple.glb",
    (gltf) => {
      starShop = gltf.scene;
      scene.background = new THREE.Color(0xbfe3dd);
      scene.add(gltf.scene);
      gsap.to(camera.position, {
        x: 0,
        y: 40,
        z: 70,
        duration: 3,
        onUpdate: function () {
          camera.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
        },
      });
      mixer = new THREE.AnimationMixer(gltf.scene);
      clips = gltf.animations;
      clips.forEach((ani) => {
        const animation = THREE.AnimationClip.findByName(clips, ani.name);
        let animationAction = mixer.clipAction(animation);
        animationAction.play();
      });
    },
    undefined,
    function (err) {
      console.log(err);
    }
  );
  document.getElementById("stop-btn").style.display = "none";
  document.getElementById("replay-btn").style.display = "none";
}

function addBoard() {
  loader.load(
    "src/board.glb",
    (gltf) => {
      gltf.scene.position.set(5, 0, 10);
      scene.add(gltf.scene);
      gsap.to(camera.position, {
        x: 5,
        y: 5,
        z: 25,
        duration: 3,
        onUpdate: function () {
          camera.lookAt(5, 0, 0);
          controls.target.set(5, 0, 0);
        },
      });
    },
    undefined,
    function (err) {
      console.log(err);
    }
  );
}

function addObject(link, type) {
  loader.load(
    link,
    (gltf) => {
      if (type == "meeShop") {
        meeShop = gltf.scene;
      } else if (type == "coffeeShop") {
        coffeeShop = gltf.scene;
      } else if (type == "addLogo") {
        startLogo = gltf.scene;
      }
      scene.background = new THREE.Color(0x000000);
      scene.add(gltf.scene);
      gsap.to(camera.position, {
        x: 0,
        y: 80,
        z: 100,
        duration: 3,
        onUpdate: function () {
          camera.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
        },
      });
      mixer = new THREE.AnimationMixer(gltf.scene);
      clips = gltf.animations;
      if (type == "meeShop") {
        let ghostAction = mixer.clipAction(clips[0]);
        ghostAction.play();
      }
    },
    undefined,
    function (err) {
      console.log(err);
    }
  );
  document.getElementById("stop-btn").style.display = "none";
  document.getElementById("replay-btn").style.display = "none";
}

function carAnimation() {
  const car = THREE.AnimationClip.findByName(clips, "car.001_9Action.001");
  let carAction = mixer.clipAction(car);

  if (carAction.enabled == true) {
    carAction.play();
  } else {
    carAction.reset();
  }
}

function addMusic() {
  // add the listener to the camera
  camera.add(audioListener);

  // instantiate audio object
  oceanAmbientSound = new THREE.Audio(audioListener);

  // add the audio object to the scene
  scene.add(oceanAmbientSound);

  // instantiate a loader
  const loader = new THREE.AudioLoader();

  // load a resource
  loader.load(
    // resource URL
    "src/Crazy_Frog.mp3",

    // onLoad callback
    function (audioBuffer) {
      // set the audio object buffer to the loaded object
      oceanAmbientSound.setBuffer(audioBuffer);

      // play the audio
      oceanAmbientSound.play();
    },

    // onProgress callback
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },

    // onError callback
    function (err) {
      console.log("An error happened: ", err);
    }
  );
  document.getElementById("stop-btn").style.display = "unset";
  document.getElementById("replay-btn").style.display = "none";
}

function stopMusic() {
  if (oceanAmbientSound) {
    oceanAmbientSound.pause();
    document.getElementById("stop-btn").style.display = "none";
    document.getElementById("replay-btn").style.display = "unset";
  }
}

function replayMusic() {
  if (oceanAmbientSound) {
    oceanAmbientSound.play();
    document.getElementById("stop-btn").style.display = "unset";
    document.getElementById("replay-btn").style.display = "none";
  }
}

function barDoorAnimation() {
  if (!oceanAmbientSound) {
    addMusic();
  }
  const barDoor = THREE.AnimationClip.findByName(clips, "bar_doorAction");
  let barDoorAction = mixer.clipAction(barDoor);
  barDoorAction.setLoop(THREE.LoopOnce);

  if (barDoorAction.enabled == true) {
    barDoorAction.play();
  }
}

function coffeeDoorAnimation() {
  const barDoor = THREE.AnimationClip.findByName(clips, "coffee_door_open");
  let barDoorAction = mixer.clipAction(barDoor);
  barDoorAction.setLoop(THREE.LoopOnce);
  if (barDoorAction.enabled == true) {
    barDoorAction.play();
    barDoorAction.clampWhenFinished = true;
  }
}

function callAnimation(name) {
  const animation = THREE.AnimationClip.findByName(clips, name);
  let animationAction = mixer.clipAction(animation);
  animationAction.play();
}

function animate() {
  requestAnimationFrame(animate);
  // background
  if (mixer) {
    mixer.update(0.01);
  }
  TWEEN.update();
  renderer.render(scene, camera);
}

new Promise((rex) => rex())
  .then(async () => {
    await init();
  })
  .then(() => {
    animate();
  });

document.addEventListener("click", onPointerMove);
</script>
