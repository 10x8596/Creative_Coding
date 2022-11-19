// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const glsl = require('glslify');
const risoColors = require('riso-colors').map(h => h.hex);
const Random = require("canvas-sketch-util/random");
const packSpheres = require("pack-spheres");

const settings = {
  dimensions: [ 2048, 2048 ],
  fps: 60,
  duration: 10,
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

  // color palette
  const palette = Random.shuffle(risoColors).slice(0, 3);
  const backgroundHex = palette.shift();
  const background = new THREE.Color(backgroundHex);

  // WebGL background color
  renderer.setClearColor("black", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 64, 32);

  const baseGeometry = new THREE.IcosahedronGeometry(1, 1);

  // get list of vectors of icosahedron to pass to shader
  // points is an array of vector 3's
  const points = baseGeometry.attributes.position.array;
  // console.log(points);

  // pack-spheres
  const spheres = packSpheres({
    maxCount: 20,
    maxRadius: 1.0,
    minRadius: 0.05
  });

  const meshes = spheres.map(sphere => {
    const [color0, color1] = Random.shuffle(palette);

    // Setup a material
    const material = new THREE.ShaderMaterial({
      // define is something we can access in a different way than uniforms
      defines: {
        POINT_COUNT: points.length
      },
      extensions: {
        derivatives: true
      },
      uniforms: {
        points: { value: points },
        time: { value: 0 },
        color: { value: new THREE.Color(color0) },
        pointColor: { value: new THREE.Color("black") },
      }, 

      // vertex shader
      vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
      }
    `,

      // fragment shader
      fragmentShader: glsl(/*glsl */ `
      #pragma glslify: noise = require('glsl-noise/simplex/3d'); 
      // anti-aliasing to smooth out dots
      #pragma glslify: aastep = require('glsl-aastep');

      varying vec2 vUv;
      varying vec3 vPosition;
      uniform vec3 color;
      uniform float time;

      uniform vec3 points[POINT_COUNT];

      // rim lighting
      uniform mat4 modelMatrix;
      float sphereRim (vec3 spherePosition) {
        vec3 normal = normalize(spherePosition.xyz);
        vec3 worldNormal = normalize(mat3(modelMatrix) * normal.xyz);
        vec3 worldPosition = (modelMatrix * vec4(spherePosition, 1.0)).xyz;
        vec3 V = normalize(cameraPosition - worldPosition);
        float rim = 1.0 - max(dot(V, worldNormal), 0.0);
        return pow(smoothstep(0.0, 1.0, rim), 0.5);
      }

      void main() {
        // define a distance
        float dist = 10000.0;
        // if distance from current point to uniform vec3 point is smaller
        // than dist, we're going to use that small value.
        for (int i = 0; i < POINT_COUNT; i++) {
          vec3 p = points[i];
          float d = distance(vPosition, p);
          dist = min(d, dist);
        }

        float mask = aastep(dist, 0.12);

        vec3 fragColor = mix(color, vec3(1.0), mask);

        // rim lighting. a value between 0..1
        float rim = sphereRim(vPosition);
        fragColor += rim * 0.4;

        gl_FragColor = vec4(vec3(fragColor), 1.0);
      }
    `),
      wireframe: false,
    });

    // Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.fromArray(sphere.position);
    mesh.scale.setScalar(sphere.radius);
    mesh.quaternion.fromArray(Random.quaternion());
    scene.add(mesh);
    return mesh;

    // Mesh of icosahedron
    // const baseMesh = new THREE.Mesh(baseGeom, material);
    // scene.add(baseMesh);

  });

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
    render({ time, playhead }) {
      // multiply by Math.PI * 2 to create a seamless rotation
      // also control animation speed
      //meshes.rotation = playhead * Math.PI * 2;
      //material.uniforms.time.value = time;
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
