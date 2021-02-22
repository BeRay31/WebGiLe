<template>
  <div class="home" onload="InitDemo()">
    <h1>GL CANVAS</h1>
    <div class="canvas-container">
      <canvas 
        id="webGL"
        @click="simpleConsole"
        @dblclick="doubleConsole"
        width="1280"
        height="720"
      >

      </canvas>
    </div>
  </div>
</template>

<script>

import createShaders from '@/utils/shaders';
import { transalte, rotate, scale, matrixMultiplication } from '@/utils/projection';

export default {
  name: "WebGLCanvas",
  data() {
    return {
      canvas: null,
      gl: null,
      buffer: [],
    }
  },
  mounted() {
    this.canvas = document.getElementById('webGL');
    this.gl = this.canvas.getContext('webgl2');

    const triangleData = [
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0
    ]

    this.gl.clearColor(1,1,1,1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const vertBuf = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertBuf)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleData), this.gl.STATIC_DRAW)

    const shaderProgram = createShaders(this.gl);
    this.gl.useProgram(shaderProgram);

    const projectMat = matrixMultiplication(matrixMultiplication(rotate(270), scale(0.25, 0.25)), transalte(-0.12, 0));
    const uniformPos = this.gl.getUniformLocation(shaderProgram, 'u_proj_mat')
    this.gl.uniformMatrix3fv(uniformPos, false, projectMat);

    const vertexPos = this.gl.getAttribLocation(shaderProgram, 'a_position');
    const uniformCol = this.gl.getUniformLocation(shaderProgram, 'u_fragColor');
    this.gl.vertexAttribPointer(vertexPos, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform4fv(uniformCol, [1.0, 0.0, 0.0, 1.0]);
    this.gl.enableVertexAttribArray(vertexPos);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, triangleData.length/2);
  },
  methods: {
    simpleConsole() {
      console.log("CLICKED");
    },
    doubleConsole() {
      console.log("dbClicked");
    }
  }
};
</script>

<style lang="scss" scoped>
.canvas-container {
  border: solid 1px black;
}
</style>
