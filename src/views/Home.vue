<template>
  <div class="home" onload="InitDemo()">
    <h1>GL CANVAS</h1>
    <div class="canvas-container">
      <canvas 
        id="webGL"
        @click="simpleConsole"
        @dblclick="doubleConsole"
        width="1280px"
        height="720px"
      >

      </canvas>
    </div>
  </div>
</template>

<script>

import createShaders from '@/utils/shaders';
import GLObject from '@/utils/GLobject';

export default {
  name: "WebGLCanvas",
  data() {
    return {
      canvas: null,
      gl: null,
      shaderProgram: null,
      glToRender: new Array(),
      itemCount: 0
    }
  },
  mounted() {
    this.canvas = document.getElementById('webGL');
    this.gl = this.canvas.getContext('webgl2');
    //  setup shader  
    const shaderProgram = createShaders(this.gl);
    this.gl.useProgram(shaderProgram);
    this.shaderProgram = shaderProgram;

    const triangleData = [
      // X , Y
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 1.0,
      1.0, 0.0
    ]


    const ob1 = new GLObject(0, this.shaderProgram, this.gl);
    ob1.setVertexArr(triangleData);
    ob1.setTranslatePoint(-1.0,-1.0);
    ob1.setRotateDegree(0);
    ob1.setScaleSize(1.0,1.0);
    ob1.setColorVector(1.0, 1.0, 0.0, 1.0);
    ob1.bindBuffer();

    const ob2 = new GLObject(0, this.shaderProgram, this.gl);
    ob2.setVertexArr(triangleData);
    ob2.setTranslatePoint(0.0,0.0);
    ob2.setRotateDegree(0);
    ob2.setScaleSize(1.0,1.0);
    ob2.setColorVector(1.0, 0.0, 0.0, 1.0);
    ob2.bindBuffer();

    this.addObject(ob1)
    this.addObject(ob2)
  },
  methods: {
    clearCanvas() {
      this.gl.clearColor(1,1,1,1);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    },
    addObject(obj) {
      this.glToRender.push(obj)
      this.itemCount++;
    },
    deleteObject(index) {
      this.glToRender.splice(index, 1);
      this.itemCount--;
    },
    render() {
      this.clearCanvas();
      for(const obj of this.glToRender) {
        obj.draw()
      }
    },
    createObject() {
      const newObj = new GLObject(this.itemCount, this.shaderProgram, this.gl);
      this.addObject(newObj)
    }
  },
  watch: {
    itemCount() {
      this.render();
    }
  }
};
</script>

<style lang="scss" scoped>
.canvas-container {
  border: solid 1px black;
}
</style>
