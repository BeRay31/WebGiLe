export const vert = `
attribute vec2 a_position;
uniform mat3 u_proj_mat;
uniform vec2 u_resolution;

void main() {
  vec2 position = (u_proj_mat * vec3(a_position, 1)).xy;
  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace, 0, 1);
}`

export const frag = `
precision mediump float;

uniform vec4 u_fragColor;
void main() {
  gl_FragColor = u_fragColor;
}`

export const select_vert = `
attribute vec2 a_position;
uniform mat3 u_proj_mat;
uniform vec2 u_resolution;

void main() {
  vec2 position = (u_proj_mat * vec3(a_position, 1)).xy;
  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace, 0, 1);
}`

export const select_frag = `
precision mediump float;

uniform vec4 u_fragColor;
void main() {
  gl_FragColor = u_fragColor;
}`


const loadShader = (gl, type, src) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('Error Compiling' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function createProgramShader(gl) {
  const vertShader = loadShader(gl, gl.VERTEX_SHADER, vert);
  const fragShader = loadShader(gl, gl.FRAGMENT_SHADER, frag);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Error on init shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

export function createSelectShader(gl) {
  const selectVertShader = loadShader(gl, gl.VERTEX_SHADER, select_vert);
  const selectFragShader = loadShader(gl, gl.FRAGMENT_SHADER, select_frag);
  const selectProgram = gl.createProgram();
  gl.attachShader(selectProgram, selectVertShader);
  gl.attachShader(selectProgram, selectFragShader);
  gl.linkProgram(selectProgram);

  if (!gl.getProgramParameter(selectProgram, gl.LINK_STATUS)) {
    alert('Error on init shader program: ' + gl.getProgramInfoLog(selectProgram));
    return null;
  }

  return selectProgram;
}
