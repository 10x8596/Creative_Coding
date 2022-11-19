// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const { FlatShading } = require("three");
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases');
const BezierEasing = require('bezier-easing');

const settings = {
  dimensions: [ 2048, 2048 ],
  fps: 24,
  duration: 10,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  // Turn on MSAA
  attributes: { antialias: true}
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("black", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();
  // position: (x, y, z)
  // camera.position.set(0, 0, -4);
  // camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const box = new THREE.BoxGeometry(1, 1, 1);

  // palette
  const palette = random.pick(palettes);

  for (let i = 0; i < 50; i++) {

    // Setup a material
    const material = new THREE.MeshStandardMaterial({
      color: random.pick(palette),
      wireframe: false,
      // flatShading: true,
    });

    // Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(box, material);
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    // set scale of objects to random values.
    // makes them for thin or fat.
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    // scale the objects
    // multiplyScalar multiplies the x, y and z by the same value.
    // scales whole object
    mesh.scale.multiplyScalar(0.5);
    scene.add(mesh);
  }

  // Ambient light
  scene.add(new THREE.AmbientLight('hsl(0, 0%, 30%)'));

  // Adding some three directional light
  // params: color of light, intensity of light
  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 2, 4);
  scene.add(light);

  const easeFn = BezierEasing(0.67, 0.03, 0.29, 0.99);

  // // Specify an ambient / unlit color
  // scene.add(new THREE.AmbientLight('#59314f'));

  // // Add some light
  // const light = new THREE.PointLight('#45caf7', 1, 15,5);
  // light.position.set(2, 2, -4).multiplyScalar(1.5);
  // scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
     
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      // increase to zoom out
      const zoom = 2.0;
      
      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      
      // Near/Far
      camera.near = -100;
      camera.far = 100;
      
      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());
      
      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      // add rotation to the scene
      const rotation = Math.cos(playhead * Math.PI * 2) * 1.5;
      //scene.rotation.y = easeFn(rotation);
      scene.rotation.y = playhead * (1 * Math.PI * 2);
      // controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      // controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
