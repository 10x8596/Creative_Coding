// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const { Mesh } = require("three");

const settings = {
  dimensions: [1080, 1080],
  // orientation: 'landscape',
  pixelsPerInch: 300,
  scaleToView: true,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  // Apply a texture
  const loader = new THREE.TextureLoader();
  const earthTexture = loader.load("earth.jpg");
  const moonTexture = loader.load("moon.jpg");

  // Setup a material
  const earthMaterial = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    map: earthTexture,
  });

  // Setup a mesh with geometry + material
  const earthMesh = new THREE.Mesh(geometry, earthMaterial);
  scene.add(earthMesh);
  
  // use group to add moon to a different group that will rotate
  const moonGroup = new THREE.Group();
  const moonMaterial = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    map: moonTexture,
  });

  const moonMesh = new THREE.Mesh(geometry, moonMaterial);
  moonMesh.position.set(1.5, -0.1, 0);
  moonMesh.scale.setScalar(0.15);
  moonGroup.add(moonMesh);
  scene.add(moonGroup);

  // adding some lighting
  const light = new THREE.PointLight("white", 2);
  light.position.set(-3, 3, -3);
  moonGroup.add(light);

  // light helper to visualise where light is coming from
  scene.add(new THREE.PointLightHelper(light, 1));

  // Grid helper to visualise axis'
  scene.add(new THREE.GridHelper(5, 20));
  scene.add(new THREE.AxesHelper(15));

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      earthMesh.rotation.y = time * 0.35;
      moonMesh.rotation.y = time * 0.2;
      // moon's orbit
      moonGroup.rotation.y = time;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
