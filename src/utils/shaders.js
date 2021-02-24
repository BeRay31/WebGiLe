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

export function prepareFrameTexture(gl) {
  const textureBuffer = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // depth buffer
  const depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);

  const setFrameBufferAttatchmentSizes = (width, height) => {
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  };
  setFrameBufferAttatchmentSizes(gl.canvas.width, gl.canvas.height);
  // frame buffer
  const frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  const attachmentPoint = gl.COLOR_ATTACHMENT0;
  const lvl = 0;
  // put it all together
  // using the texture and depth buffer with frame buffer
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, textureBuffer, lvl);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  return frameBuffer;
}

export const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}