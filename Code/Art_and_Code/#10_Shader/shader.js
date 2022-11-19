const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  animate: true,
  duration: 10,
  fps: 24,
  dimensions: [ 1080, 1080 ],
  pixelsPerInch: 300,
};

// Your glsl code
const frag = glsl(/* glsl */`
  precision highp float;

  // some variables:
  // time, current time in seconds
  uniform float playhead;
  // fixing aspect ratio
  uniform float aspect;
  // vUv gives UV coordinates of the surface we are drawing to.
  varying vec2 vUv;

  // requiring noise onto shaders
  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  // introducing color
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

  void main () {
  
    // the center value is the exact center of the screen 
    vec2 center = vUv - 0.5;
    // shrinking the width of the radius to be responsive to browser resize
    center.x *= aspect;
    // want to find how far away from the center is the current pixel
    float dist = length(center);

    // smoothing out the edges
    // step function: if the first argument is less than the second,
    // return 0, otherwise return 1.
    // float alpha = step(dist, 0.25);
    // smoothstep: if dist value is less than first argument, return 0,
    // otherwise if dist is greater than second argument, return 1.
    // but if dist is in between min and max, its going to smoothly
    // roll of between 0 and 1.
    // smoothstep(min, max, any);
    float alpha = smoothstep(0.25115, 0.25, dist);

    // NOISE //
    // giving noise function 3 coordinates, because its a 3 dimensional noise fn
    // we're giving it the UV coord of the surface and time.
    // returns n which is a num b/w -1 and 1.
    float n = noise(vec3(vUv.xy * 0.5, playhead * 2.5));

    // COLORS //
    // vec3 colorA = cos(playhead) + vec3(1.0, 0.0, 0.0);
    // vec3 colorB = sin(playhead * 2.0) + vec3(0.0, 0.0, 1.0);

    // manipulating hue color based on noise value
    vec3 color1 = hsl2rgb(
      0.6 + n * 0.2,
      0.5,
      0.5
    );

    // mix function mixes the specified colors to form gradient
    // vec3 color = mix(colorA * n, colorB, vUv.x - vUv.y * sin(n));
    // gl_FragColor = vec4(color, alpha);

    gl_FragColor = vec4(color1, alpha);

  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // background color. false makes it transparent
    clearColor: 'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      playhead: ({ playhead }) => playhead,
      aspect: ({ width, height }) => width / height
    }
  });
};

canvasSketch(sketch, settings);
