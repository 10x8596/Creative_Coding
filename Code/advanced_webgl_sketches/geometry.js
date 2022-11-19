// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
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

  // Grid helper to visualise axis'
  scene.add(new THREE.GridHelper(5, 20));
  scene.add(new THREE.AxesHelper(15));

  // Setting up our own geometries
  const geometry = new THREE.BufferGeometry();
  // Creating a triangle. Array of vertices
  const verts = [
    new THREE.Vector3(-0.5, 0.5, 0),
    new THREE.Vector3(0.5, -0.5, 0),
    new THREE.Vector3(-0.5, -0.5, 0),
    // new THREE.Vector3(0.5, 0.5, 0)
  ];

  // Flatten into buffer attribute
  const vertsFlat = verts.map(p => p.toArray()).flat();
  const vertsArray = new Float32Array(vertsFlat);
  const vertsAttrib = new THREE.BufferAttribute(vertsArray, 3);
  geometry.addAttribute("position", vertsAttrib);
  
  // List of face
  const faces = [
    [ 0, 1, 2 ],
    [ 0, 3, 1 ]
  ];
  
  // Flatten into buffer attribute
  const facesFlat = faces.flat();
  const facesArray = new Uint16Array(facesFlat);
  const facesAttrib = new THREE.BufferAttribute(facesArray, 1);
  geometry.setIndex(facesAttrib);

  // Update the face normals
  geometry.computeVertexNormals();

  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide
  });

  // Create a mesh
  const mesh = new THREE.Mesh(geometry, material);

  // Add it to the scene
  scene.add(mesh);

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
