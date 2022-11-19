// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const glsl = require('glslify');

const settings = {
  dimensions: [ 1080, 1080 ],
  fps: 24,
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

  // WebGL background color
  renderer.setClearColor("#fff", 1);

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

  // vertex shader
  const vertexShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
    }
  `;

  // fragment shader
  const fragmentShader = glsl(/*glsl */ `
    #pragma glslify: noise = require('glsl-noise/simplex/3d'); 

    varying vec2 vUv;
    uniform vec3 color;
    uniform float time;
    void main() {
      // on each face, depending on the distance from the center
      // make the outside black, and the center (circle) white
      // 0.5 is the center of (0,0) and (1,1)
      vec2 center = vec2(0.5, 0.5);
      // wrapping around polka dots multiple times
      // a % b = mod(a, b)
      // doing modulo 1 because we always want it to stay within 1 (0 to 1)
      // vUv is between 0 to 1. So 0 to 8.
      vec2 uv = vUv;
      // scaling the dots
      uv.x *= 2.0;
      vec2 pos = mod(uv * 10.0, 1.0);
      float dist = distance(pos, center);

      // masking (inverting the circle in the center)
      // float mask = dist > 0.25 ? 0.0 : 1.0;
      // try inverting for different effects
      // float mask = step(0.25, dist);
      // chaning 0.25 will change size of circles. (0.5 pretty good)

      // cool variations
      // vec2 pos = mod(uv * 5.0, 1.0);
      // 1. float mask = step(dist, 0.25 + sin(time + vUv.x * 2.5) * 0.1);
      // 2. float offset = noise(vec3(noiseInput.xy, time));
      // 2. float offset = noise(vec3(noiseInput.xy, time)) * 0.15;
      // 2. float mask = step(dist, 0.25 + offset);

      vec2 noiseInput = floor(uv * 10.0);
      float offset = noise(vec3(noiseInput.xy, time)) * 0.25;
      float mask = step(dist, 0.25 + offset);

      // introducing some color
      // color replaces background
      // vec3 is circle's color
      // interpolating using mask value (linear interpolation)
      vec3 fragColor = mix(color, vec3(1.0), mask);


      gl_FragColor = vec4(vec3(fragColor), 1.0);
    }
  `);

  // Setup a material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color('tomato') }
    },
    vertexShader,
    fragmentShader
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
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
      mesh.rotation.z = time * 0.35;
      material.uniforms.time.value = time;
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
