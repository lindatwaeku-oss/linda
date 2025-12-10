import "aframe";
import "./style.css";

// Initialize A-Frame scene: assumes the base scene markup exists in `index.html`.
function initScene() {
  const scene = document.querySelector("a-scene");
  if (!scene) {
    console.error("a-scene not found in DOM");
    return;
  }

  const onLoaded = () => {
    buildScene(scene);
    buildWindows(scene);
    setupSceneController();
  };

  if (scene.hasLoaded) {
    onLoaded();
  } else {
    scene.addEventListener("loaded", onLoaded, { once: true });
  }
}

function buildScene(scene) {
  //MY LIGHTING SETUP
  const mainLight = document.createElement("a-entity");
  mainLight.setAttribute(
    "light",
    "type: point; color: #FFF8DC; intensity: 1.2; distance: 20; decay: 1.5; castShadow: true"
  );
  mainLight.setAttribute("position", "0 3.2 0");
  mainLight.setAttribute("shadow", "mapSize: 2048");
  mainLight.setAttribute(
    "animation",
    "property: light.intensity; from: 1.0; to: 1.3; dir: alternate; loop: true; dur: 3000"
  );
  scene.appendChild(mainLight);

  const ambientLight = document.createElement("a-entity");
  ambientLight.setAttribute(
    "light",
    "type: ambient; color: #D4B8A8; intensity: 0.5"
  );
  scene.appendChild(ambientLight);

  const dirLight = document.createElement("a-entity");
  dirLight.setAttribute(
    "light",
    "type: directional; color: #FFE8CC; intensity: 0.6; castShadow: true"
  );
  dirLight.setAttribute("position", "5 4 -5");
  dirLight.setAttribute("shadow", "mapSize: 2048");
  scene.appendChild(dirLight);

  const rightLight = document.createElement("a-entity");
  rightLight.setAttribute(
    "light",
    "type: point; color: #F5DEB3; intensity: 0.4; distance: 12"
  );
  rightLight.setAttribute("position", "6 2.5 0");
  scene.appendChild(rightLight);

  const leftLight = document.createElement("a-entity");
  leftLight.setAttribute(
    "light",
    "type: point; color: #F5DEB3; intensity: 0.4; distance: 12"
  );
  leftLight.setAttribute("position", "-6 2.5 0");
  scene.appendChild(leftLight);

  // MY CAMERA
  const camera = document.createElement("a-entity");
  camera.setAttribute("camera", "far: 1000; fov: 75; near: 0.01");
  camera.setAttribute("position", "0 1.6 5.5");
  camera.setAttribute("look-controls", "reverseMouseDrag: false");
  camera.setAttribute("wasd-controls", "");
  const cursor = document.createElement("a-entity");
  cursor.setAttribute("cursor", "fuse: false; rayOrigin: mouse");
  cursor.setAttribute("raycaster", "objects: .interactive");
  cursor.setAttribute(
    "geometry",
    "primitive: ring; radiusInner: 0.01; radiusOuter: 0.015"
  );
  cursor.setAttribute("material", "color: #ffffff; shader: flat; opacity: 0.9");
  camera.appendChild(cursor);
  scene.appendChild(camera);

  // MY ROOM ARCHITECTURE
  // Floor
  const floor = document.createElement("a-plane");
  floor.setAttribute("position", "0 0 0");
  floor.setAttribute("rotation", "-90 0 0");
  floor.setAttribute("width", "18");
  floor.setAttribute("height", "16");
  floor.setAttribute("shadow", "receive: true");
  floor.setAttribute(
    "material",
    "color: #9B8B7D; repeat: 9 8; roughness: 0.75; metalness: 0.02; toneMapped: true; src: #tiles"
  );
  scene.appendChild(floor);

  // Ceiling
  const ceiling = document.createElement("a-plane");
  ceiling.setAttribute("position", "0 3 0");
  ceiling.setAttribute("rotation", "90 0 0");
  ceiling.setAttribute("width", "18");
  ceiling.setAttribute("height", "16");
  // Use color-only material (flat shader) for a clean ceiling appearance
  ceiling.setAttribute(
    "material",
    "roughness: 1; metalness: 0; toneMapped: false; src: #glass"
  );
  scene.appendChild(ceiling);

  // Back Wall
  const backWall = document.createElement("a-box");
  backWall.setAttribute("position", "0 1.5 -8");
  backWall.setAttribute("width", "18");
  backWall.setAttribute("height", "3");
  backWall.setAttribute("depth", "0.15");
  backWall.setAttribute("material", {
    shader: "standard",
    src: "#wood-texture",
    repeat: "9 1.5",
    color: "#FFFFFF",
    roughness: 0.7,
    metalness: 0.1,
    side: "front",
    toneMapped: true,
  });
  backWall.setAttribute("shadow", "receive: true");
  scene.appendChild(backWall);

  // Left Wall
  const leftWall = document.createElement("a-box");
  leftWall.setAttribute("position", "-9 1.5 0");
  leftWall.setAttribute("width", "0.15");
  leftWall.setAttribute("height", "3");
  leftWall.setAttribute("depth", "16");
  leftWall.setAttribute("material", {
    shader: "standard",
    src: "#wood-texture",
    repeat: "8 1.5",
    color: "#FFFFFF",
    roughness: 0.7,
    metalness: 0.1,
    side: "front",
    toneMapped: true,
  });
  leftWall.setAttribute("shadow", "receive: true");
  scene.appendChild(leftWall);

  // Right Wall
  const rightWall = document.createElement("a-box");
  rightWall.setAttribute("position", "9 1.5 0");
  rightWall.setAttribute("width", "0.15");
  rightWall.setAttribute("height", "3");
  rightWall.setAttribute("depth", "16");
  rightWall.setAttribute("material", {
    shader: "standard",
    src: "#wood-texture",
    repeat: "8 1.5",
    color: "#FFFFFF",
    roughness: 0.7,
    metalness: 0.1,
    side: "front",
    toneMapped: true,
  });
  rightWall.setAttribute("shadow", "receive: true");
  scene.appendChild(rightWall);

  // Door
  const doorEntity = document.createElement("a-entity");
  doorEntity.setAttribute("position", "-8.92 1 1");

  const doorFrame = document.createElement("a-box");
  doorFrame.setAttribute("width", "0.12");
  doorFrame.setAttribute("height", "2.3");
  doorFrame.setAttribute("depth", "1.2");
  doorFrame.setAttribute(
    "material",
    "color: #8B7355; roughness: 0.7; metalness: 0.1; toneMapped: true"
  );
  doorEntity.appendChild(doorFrame);

  const doorPanel = document.createElement("a-box");
  doorPanel.setAttribute("position", "0.1 0 0");
  doorPanel.setAttribute("width", "0.12");
  doorPanel.setAttribute("height", "2.2");
  doorPanel.setAttribute("depth", "1.1");
  doorPanel.setAttribute(
    "material",
    "color: #A68B7F; roughness: 0.65; metalness: 0.12; toneMapped: true"
  );
  doorEntity.appendChild(doorPanel);

  const doorKnob = document.createElement("a-sphere");
  doorKnob.setAttribute("position", "0.14 0 -0.5");
  doorKnob.setAttribute("radius", "0.06");
  doorKnob.setAttribute(
    "material",
    "color: #C0C0C0; roughness: 0.25; metalness: 0.85; toneMapped: true"
  );
  doorEntity.appendChild(doorKnob);
  scene.appendChild(doorEntity);

  // DINING TABLE
  const tableEntity = document.createElement("a-entity");
  tableEntity.setAttribute("id", "dining-table");
  tableEntity.setAttribute("position", "0 0 0");

  const tableTop = document.createElement("a-cylinder");
  tableTop.setAttribute("position", "0 0.96 0");
  tableTop.setAttribute("radius", "1.5");
  tableTop.setAttribute("height", "0.08");
  tableTop.setAttribute("shadow", "cast: true; receive: true");
  tableTop.setAttribute(
    "material",
    "roughness: 0.75; metalness: 0.25; toneMapped: true; src: #plaster"
  );
  tableEntity.appendChild(tableTop);

  const tablePedestal = document.createElement("a-cylinder");
  tablePedestal.setAttribute("position", "0 0.45 0");
  tablePedestal.setAttribute("radius", "0.45");
  tablePedestal.setAttribute("height", "0.9");
  tablePedestal.setAttribute("segments-radial", "32");
  tablePedestal.setAttribute(
    "material",
    "roughness: 0.75; metalness: 0.25; toneMapped: true; src: #plaster"
  );
  tablePedestal.setAttribute("shadow", "cast: true");
  tableEntity.appendChild(tablePedestal);
  scene.appendChild(tableEntity);

  // MiLo Tin
  const miloTin = document.createElement("a-entity");
  miloTin.setAttribute("position", "0.6 -0.03 -0.3");

  const miloBody = document.createElement("a-cylinder");
  miloBody.setAttribute("position", "0 1.1 1");
  miloBody.setAttribute("rotation", "0 -90 0");
  miloBody.setAttribute("radius", "0.12");
  miloBody.setAttribute("height", "0.3");
  miloBody.setAttribute(
    "material",
    "src: #milo; roughness: 0.1; metalness: 0.1; toneMapped: true"
  );
  miloTin.appendChild(miloBody);

  const miloLid = document.createElement("a-cylinder");
  miloLid.setAttribute("position", "0 1.26 1");
  miloLid.setAttribute("radius", "0.13");
  miloLid.setAttribute("height", "0.03");
  miloLid.setAttribute("color", "#EEEEEE");
  miloTin.appendChild(miloLid);

  const miloBase = document.createElement("a-cylinder");
  miloBase.setAttribute("position", "0 1.0 1");
  miloBase.setAttribute("radius", "0.13");
  miloBase.setAttribute("height", "0.03");
  miloBase.setAttribute("color", "#E3E3E3");
  miloTin.appendChild(miloBase);
  scene.appendChild(miloTin);

  // Milk Tin
  const milkTin = document.createElement("a-entity");
  milkTin.setAttribute("position", "-0.6 -0.03 0");

  const milkBody = document.createElement("a-cylinder");
  milkBody.setAttribute("position", "0 1.1 1");
  milkBody.setAttribute("rotation", "0 -150 0");
  milkBody.setAttribute("radius", "0.12");
  milkBody.setAttribute("height", "0.3");
  milkBody.setAttribute(
    "material",
    "src: #milk; roughness: 0.1; metalness: 0.1; toneMapped: true"
  );
  milkTin.appendChild(milkBody);

  const milkLid = document.createElement("a-cylinder");
  milkLid.setAttribute("position", "0 1.26 1");
  milkLid.setAttribute("radius", "0.13");
  milkLid.setAttribute("height", "0.03");
  milkLid.setAttribute("color", "#EEEEEE");
  milkTin.appendChild(milkLid);

  const milkBase = document.createElement("a-cylinder");
  milkBase.setAttribute("position", "0 1.0 1");
  milkBase.setAttribute("radius", "0.13");
  milkBase.setAttribute("height", "0.03");
  milkBase.setAttribute("color", "#E3E3E3");
  milkTin.appendChild(milkBase);
  scene.appendChild(milkTin);

  // CUPS
  const cup1 = document.createElement("a-entity");
  cup1.setAttribute("position", "0 0 0");

  const cup1Cylinder = document.createElement("a-cylinder");
  cup1Cylinder.setAttribute("position", "-0.4 1.08 1");
  cup1Cylinder.setAttribute("radius", "0.08");
  cup1Cylinder.setAttribute("height", "0.17");
  cup1Cylinder.setAttribute("color", "#001affff");
  cup1.appendChild(cup1Cylinder);

  const cup1Handle = document.createElement("a-torus");
  cup1Handle.setAttribute("position", "-0.3 1.1 1");
  cup1Handle.setAttribute("radius", "0.05");
  cup1Handle.setAttribute("radius-tubular", "0.008");
  cup1Handle.setAttribute("rotation", "0 45 0");
  cup1Handle.setAttribute("color", "#001affff");
  cup1.appendChild(cup1Handle);

  scene.appendChild(cup1);

  const cup2 = document.createElement("a-entity");
  cup2.setAttribute("position", "1 0 0");

  const cup2Cylinder = document.createElement("a-cylinder");
  cup2Cylinder.setAttribute("position", "-0.4 1.08 1");
  cup2Cylinder.setAttribute("radius", "0.08");
  cup2Cylinder.setAttribute("height", "0.17");
  cup2Cylinder.setAttribute("color", "#FFFFFF");
  cup2.appendChild(cup2Cylinder);

  const cup2Handle = document.createElement("a-torus");
  cup2Handle.setAttribute("position", "-0.5 1.1 1");
  cup2Handle.setAttribute("radius", "0.05");
  cup2Handle.setAttribute("radius-tubular", "0.008");
  cup2Handle.setAttribute("rotation", "0 45 0");
  cup2Handle.setAttribute("color", "#FFFFFF");
  cup2.appendChild(cup2Handle);

  scene.appendChild(cup2);

  // DINING CHAIRS
  buildChair(scene, "chair1", "-2.3 0 0", "0 90 0");
  buildChair(scene, "chair2", "2.3 0 0", "0 -90 0");
  buildChair(scene, "chair3", "0 0 -2.3", "0 180 0");
}

// Creation of windows
function buildWindows(scene) {
  //window
  buildWindow(scene, {
    position: "-8.92 1.5 -4",
    rotation: "0 90 0",
  });
}

function buildWindow(scene, options) {
  const { position, rotation } = options;

  // Window container
  const windowEntity = document.createElement("a-entity");
  windowEntity.setAttribute("position", position);
  windowEntity.setAttribute("rotation", rotation);

  // Window frame (outer frame)
  const windowFrame = document.createElement("a-box");
  windowFrame.setAttribute("position", "0 0 0.001");
  windowFrame.setAttribute("width", "1.0");
  windowFrame.setAttribute("height", "1.25");
  windowFrame.setAttribute("depth", "0.18");
  windowFrame.setAttribute("material", {
    color: "#fffcf8",
    roughness: 0.6,
    metalness: 0.1,
    toneMapped: true,
  });
  windowFrame.setAttribute("shadow", "cast: true; receive: true");
  windowEntity.appendChild(windowFrame);

  // Window pane (glass)
  const windowPane = document.createElement("a-box");
  windowPane.setAttribute("position", "0 0 0.09");
  windowPane.setAttribute("width", "0.95");
  windowPane.setAttribute("height", "1.2");
  windowPane.setAttribute("depth", "0.01");
  windowPane.setAttribute("material", {
    src: "#glass-texture",
    transparent: true,
    opacity: 0.5,
    roughness: 0.1,
    metalness: 0.5,
    toneMapped: true,
  });
  windowEntity.appendChild(windowPane);

  scene.appendChild(windowEntity);
}

function buildChair(scene, id, position, rotation) {
  const chair = document.createElement("a-entity");
  chair.setAttribute("id", id);
  chair.setAttribute("position", position);
  chair.setAttribute("rotation", rotation);
  chair.setAttribute("interactive-seat", "");
  chair.setAttribute("class", "interactive");
  // Determine variant colors based on id
  let seatColor = "#A0522D"; // default
  let backColor = "#8B4513";
  if (id && id.includes("chair1")) {
    seatColor = "#2B6CB0"; // deep blue fabric
    backColor = "#264E86";
  } else if (id && id.includes("chair2")) {
    seatColor = "#2F855A"; // green
    backColor = "#276749";
  } else if (id && id.includes("chair3")) {
    seatColor = "#6B7280"; // slate grey
    backColor = "#4B5563";
  }

  // Rounded seat (cushioned)
  const seat = document.createElement("a-cylinder");
  seat.setAttribute("position", "0 0.53 0");
  seat.setAttribute("radius", "0.38");
  seat.setAttribute("height", "0.14");
  seat.setAttribute("segments-radial", "32");
  seat.setAttribute(
    "material",
    `color: ${seatColor}; roughness: 0.6; metalness: 0.02; toneMapped: true`
  );
  seat.setAttribute("shadow", "cast: true; receive: true");
  chair.appendChild(seat);

  // Curved back rest (shallow cylinder rotated to form a curve)
  const backRest = document.createElement("a-cylinder");
  backRest.setAttribute("position", "0 1.02 -0.34");
  backRest.setAttribute("radius", "0.40");
  backRest.setAttribute("height", "0.14");
  backRest.setAttribute("rotation", "90 0 0");
  backRest.setAttribute("segments-radial", "48");
  backRest.setAttribute(
    "material",
    `color: ${backColor}; roughness: 0.7; metalness: 0.02; toneMapped: true`
  );
  backRest.setAttribute("shadow", "cast: true");
  chair.appendChild(backRest);

  // Slim horizontal armrests (rounded)
  const armrestLeft = document.createElement("a-cylinder");
  armrestLeft.setAttribute("position", "-0.45 0.72 0");
  armrestLeft.setAttribute("radius", "0.035");
  armrestLeft.setAttribute("height", "0.7");
  armrestLeft.setAttribute("rotation", "0 0 90");
  armrestLeft.setAttribute(
    "material",
    "color: #5C4033; roughness: 0.75; metalness: 0.15; toneMapped: true"
  );
  armrestLeft.setAttribute("shadow", "cast: true");
  chair.appendChild(armrestLeft);

  const armrestRight = document.createElement("a-cylinder");
  armrestRight.setAttribute("position", "0.45 0.72 0");
  armrestRight.setAttribute("radius", "0.035");
  armrestRight.setAttribute("height", "0.7");
  armrestRight.setAttribute("rotation", "0 0 90");
  armrestRight.setAttribute(
    "material",
    "color: #5C4033; roughness: 0.75; metalness: 0.15; toneMapped: true"
  );
  armrestRight.setAttribute("shadow", "cast: true");
  chair.appendChild(armrestRight);

  // Slimmer legs
  const legPositions = [
    { x: -0.28, z: -0.28 },
    { x: 0.28, z: -0.28 },
    { x: -0.28, z: 0.28 },
    { x: 0.28, z: 0.28 },
  ];

  legPositions.forEach((pos) => {
    const leg = document.createElement("a-cylinder");
    leg.setAttribute("position", `${pos.x} 0 ${pos.z}`);
    leg.setAttribute("radius", "0.03");
    leg.setAttribute("height", "0.7");
    leg.setAttribute(
      "material",
      "color: #4B2E22; roughness: 0.75; metalness: 0.2; toneMapped: true"
    );
    leg.setAttribute("shadow", "cast: true");
    chair.appendChild(leg);
  });

  scene.appendChild(chair);
}


function registerAframeComponents() {
  if (typeof AFRAME === "undefined" || !AFRAME.registerComponent) {
    console.warn("AFRAME not available");
    return;
  }

  AFRAME.registerComponent("interactive-seat", {
    init: function () {
      this.onSelect = this.onSelect.bind(this);
      this.el.classList.add("interactive");
      this.el.addEventListener("click", this.onSelect);
      this.el.addEventListener("triggerdown", this.onSelect);
    },
    onSelect: function () {
      const currentPos = this.el.getAttribute("position");
      if (!currentPos) return;
      this.el.setAttribute("animation__move", {
        property: "position",
        to: `${currentPos.x} ${currentPos.y} ${currentPos.z - 0.1}`,
        dur: 300,
        easing: "easeOutQuad",
      });
      this.el.setAttribute("animation__return", {
        property: "position",
        to: `${currentPos.x} ${currentPos.y} ${currentPos.z}`,
        dur: 300,
        delay: 300,
        easing: "easeInQuad",
      });
    },
    remove: function () {
      this.el.removeEventListener("click", this.onSelect);
      this.el.removeEventListener("triggerdown", this.onSelect);
    },
  });
}

function setupSceneController() {}

// Load A-Frame library and initialize scene
// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    registerAframeComponents();
    initScene();
  });
} else {
  registerAframeComponents();
  initScene();
}
