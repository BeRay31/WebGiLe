export const vert = `
attribute vec2 a_position;
uniform mat3 u_proj_mat;

void main() {
  vec2 position = (u_proj_mat * vec3(a_position, 1)).xy;
  gl_Position = vec4(position, 0, 1);
}`

export const frag = `precision mediump float;

uniform vec4 u_fragColor;
void main() {
  gl_FragColor = u_fragColor;
}`

export default function createShader(gl) {
  const vertShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShader, vert);
  gl.compileShader(vertShader);
  if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
    console.error("ERROR: Vertex shader failed to compile", gl.getShaderInfoLog(vertShader));
    return;
  }

  const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShader, frag);
  gl.compileShader(fragShader);
  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    console.error("ERROR: Vertex shader failed to compile", gl.getShaderInfoLog(fragShader));
    return;
  }
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);

  return shaderProgram;
}
