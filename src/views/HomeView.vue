<template>
  <main>
    <canvas
      ref="constellationBG"
      style="width: 100%; height: -webkit-fill-available"
    ></canvas>
  </main>
</template>

<script>
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
export default {
  mounted() {
    return new Promise((rex) => rex())
      .then(() => {
        this.init();
      })
      .then(() => {
        this.animate();
      });
  },
  data() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.control = null;
    this.mixer = null;
    this.mixers = null;
    this.clips = null;
    this.board = null;
    this.loader = new GLTFLoader();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    // view
    this.coffeeShop = null;
    this.meeShop = null;
    this.doodBar = null;
    this.starShop = null;
    this.temple = null;
    this.startLogo = null;
    this.startBtn = null;

    return {};
  },
  methods: {
    onPointerMove(event) {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      var intersects = this.raycaster.intersectObjects(
        this.scene.children,
        true
      );

      if (intersects.length > 0) {
        if (this.startLogo) {
          this.scene.remove(this.startLogo);
          this.scene.remove(this.startBtn);
          this.addBoard();
        }

        intersects.forEach((item) => {
          switch (item.object.name) {
            case "Discord":
              window.open("https://discord.gg/UAJsWwZygr", "_blank");
              break;
            case "OpenSea":
              window.open(
                "https://opensea.io/collection/apeironplanet",
                "_blank"
              );
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
              this.deleteScene();
              this.addCoffeeShop();
              break;
            case "starSaletab":
              this.deleteScene();
              this.addStarShop();
              break;
            case "doodBartab":
              this.deleteScene();
              this.addDoodBar();
              break;
            case "prayTempletab":
              this.deleteScene();
              this.addTemple();
              break;
            case "meeShoptab":
              this.deleteScene();
              this.addMeeShop();
              break;
            case "Object_17001_34":
              this.carAnimation();
              break;
            case "Cylinder013_10":
              this.barDoorAnimation();
              break;
            case "polySurface622_lambert6_0_1":
              this.coffeeDoorAnimation();
              break;
          }
        });
      }
    },
    deleteScene() {
      if (this.coffeeShop) {
        this.scene.remove(this.coffeeShop);
      }
      if (this.meeShop) {
        this.scene.remove(this.meeShop);
      }
      if (this.doodBar) {
        this.scene.remove(this.doodBar);
      }
      if (this.starShop) {
        this.scene.remove(this.starShop);
      }
      if (this.temple) {
        this.scene.remove(this.temple);
      }
    },
    init() {
      this.scene = new THREE.Scene();

      // camera setup
      this.camera = new THREE.PerspectiveCamera(
        12,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      // this.camera.rotation.set(-2.91, 1.47, 0.07);
      this.camera.position.set(9.076, 16.024, 40);

      // Create ambient light and add to scene.
      var light = new THREE.AmbientLight(0xffffff, 1); // soft white light
      this.scene.add(light);
      light = new THREE.DirectionalLight(0xffffff, 3); // soft white light
      light.castShadow = true;
      light.shadow.camera.far = 20;
      light.shadow.mapSize.set(1024, 1024);
      light.shadow.normalBias = 0.05;
      light.position.set(1.5, 1, 3);
      this.scene.add(light);

      this.addStartLogo();
      this.addStartBtn();
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.$refs.constellationBG,
        antialias: true,
      });
      this.renderer.domElement.addEventListener("click", this.onPointerMove);

      // render
      this.renderer.setSize(window.innerWidth, window.innerHeight, false);
      this.renderer.physicallyCorrectLights = true;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.CineonToneMapping;
      this.renderer.toneMappingExposure = 1.75;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.rotateSpeed = 0.5;
      this.controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      };
      this.controls.listenToKeyEvents(window);
    },
    addStartLogo() {
      this.loader.load(
        "./src/logo.glb",
        (gltf) => {
          this.startLogo = gltf.scene;
          this.camera.lookAt(
            this.startLogo.position.x,
            this.startLogo.position.y,
            this.startLogo.position.z
          );
          this.controls.target.set(
            this.startLogo.position.x,
            this.startLogo.position.y,
            this.startLogo.position.z
          );
          new TWEEN.Tween(this.startLogo.rotation)
            .repeat(Infinity)
            .to({ x: 0, y: Math.PI, z: 0 })
            .duration(5000)
            .start();
          this.scene.add(gltf.scene);
        },
        undefined,
        function (err) {
          console.log(err);
        }
      );
    },
    addStartBtn() {
      this.loader.load(
        "./src/startBtn.glb",
        (gltf) => {
          this.startBtn = gltf.scene;
          this.scene.add(gltf.scene);
        },
        undefined,
        function (err) {
          console.log(err);
        }
      );
    },
    addCoffeeShop() {
      this.addObject("src/coffeeShop.glb", "coffeeShop");
    },
    addMeeShop() {
      this.addObject("src/meeShop.glb", "meeShop");
    },
    addDoodBar() {
      // this.addObject("./src/doodBar.glb", "doodBar");
      this.loader.load(
        "src/doodBar.glb",
        (gltf) => {
          this.doodBar = gltf.scene;
          // gltf.scene.position.set(-5, 0, -10);
          this.camera.lookAt(0, 0, 0);
          this.controls.target.set(0, 0, 0);
          this.scene.background = new THREE.Color(0x000000);
          this.scene.add(gltf.scene);
          this.mixer = new THREE.AnimationMixer(gltf.scene);
          this.clips = gltf.animations;

          this.clips.forEach((ani) => {
            if (
              ani.name != "bar_doorAction" &&
              ani.name != "Cylinder.028Action"
            ) {
              const animation = THREE.AnimationClip.findByName(
                this.clips,
                ani.name
              );
              let animationAction = this.mixer.clipAction(animation);
              animationAction.play();
            }
          });
        },
        undefined,
        function (err) {
          console.log(err);
        }
      );
    },
    addStarShop() {
      this.loader.load(
        "src/starShop.glb",
        (gltf) => {
          this.starShop = gltf.scene;
          this.scene.background = new THREE.Color(0xbfe3dd);
          this.scene.add(gltf.scene);
          this.camera.lookAt(0, 0, 0);
          this.controls.target.set(0, 0, 0);
          this.mixer = new THREE.AnimationMixer(gltf.scene);
          this.clips = gltf.animations;

          // cat
          const cat = THREE.AnimationClip.findByName(this.clips, "Take 001");
          let catAction = this.mixer.clipAction(cat);
          catAction.play();

          // doods
          this.callAnimation("Cube.020Action");
          this.callAnimation("dood1Action");
        },
        undefined,
        function (err) {
          console.log(err);
        }
      );
    },
    addTemple() {
      this.loader.load(
        "src/temple.glb",
        (gltf) => {
          this.starShop = gltf.scene;
          this.scene.background = new THREE.Color(0xbfe3dd);
          this.scene.add(gltf.scene);
          this.camera.lookAt(0, 0, 0);
          this.controls.target.set(0, 0, 0);
          this.mixer = new THREE.AnimationMixer(gltf.scene);
          this.clips = gltf.animations;
          this.clips.forEach((ani) => {
            const animation = THREE.AnimationClip.findByName(
              this.clips,
              ani.name
            );
            let animationAction = this.mixer.clipAction(animation);
            animationAction.play();
          });
        },
        undefined,
        function (err) {
          console.log(err);
        }
      );
    },
    addBoard() {
      this.loader.load(
        "src/board.glb",
        (gltf) => {
          gltf.scene.position.set(5, 0, 10);
          this.camera.lookAt(5, 2, 10);
          this.controls.target.set(5, 2, 10);
          this.scene.add(gltf.scene);
        },
        undefined,
        function (err) {
          console.log(err);
        }
      );
    },
    addObject(link, type) {
      this.loader.load(
        link,
        (gltf) => {
          if (type == "meeShop") {
            this.meeShop = gltf.scene;
          } else if (type == "coffeeShop") {
            this.coffeeShop = gltf.scene;
          } else if (type == "addLogo") {
            this.startLogo = gltf.scene;
          }
          this.scene.background = new THREE.Color(0x000000);
          this.scene.add(gltf.scene);
          this.camera.lookAt(0, 0, 0);
          this.controls.target.set(0, 0, 0);
          this.mixer = new THREE.AnimationMixer(gltf.scene);
          this.clips = gltf.animations;
        },
        undefined,
        function (err) {
          console.log(err);
        }
      );
    },
    carAnimation() {
      const car = THREE.AnimationClip.findByName(
        this.clips,
        "car.001_9Action.001"
      );
      let carAction = this.mixer.clipAction(car);
      carAction.setLoop(THREE.LoopOnce);

      if (carAction.enabled == true) {
        carAction.play();
      } else {
        carAction.reset();
      }
    },
    barDoorAnimation() {
      const barDoor = THREE.AnimationClip.findByName(
        this.clips,
        "bar_doorAction"
      );
      let barDoorAction = this.mixer.clipAction(barDoor);
      barDoorAction.setLoop(THREE.LoopOnce);

      if (barDoorAction.enabled == true) {
        barDoorAction.play();
      }
    },
    coffeeDoorAnimation() {
      const barDoor = THREE.AnimationClip.findByName(
        this.clips,
        "coffee_door_open"
      );
      let barDoorAction = this.mixer.clipAction(barDoor);
      barDoorAction.setLoop(THREE.LoopOnce);
      if (barDoorAction.enabled == true) {
        barDoorAction.play();
        barDoorAction.clampWhenFinished = true;
      }
    },
    callAnimation(name) {
      const animation = THREE.AnimationClip.findByName(this.clips, name);
      let animationAction = this.mixer.clipAction(animation);
      animationAction.play();
    },
    animate() {
      requestAnimationFrame(this.animate);
      // background
      if (this.mixer) {
        this.mixer.update(0.01);
      }
      TWEEN.update();
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>
