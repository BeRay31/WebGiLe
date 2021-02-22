export const vert = `
attribute vec2 a_position;
uniform mat3 u_proj_mat;

void main() {
  vec2 position = (u_proj_mat * vec3(a_position, 1)).xy;
  gl_Position = vec4(position, 0, 1);
}`

export const frag = `
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

export default function createShader(gl) {
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
