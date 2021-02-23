<template>
  <div class="home" onload="InitDemo()">
    <h1>GL CANVAS</h1>
    <div class="canvas-container">
      <canvas 
        id="webGL"
        width="1280px"
        @mousemove="updateMouse"
        @mousedown="mouseDown = true"
        @mouseup="mouseUpHandler"
        @click="onClickHandler"
        height="720px"
      >
      </canvas>
    </div>

    <div class="menu-container">
      <button id="create-line" @click="selectFeature(`line`)">LINE</button>
      <button id="create-square" @click="selectFeature(`square`)">SQUARE</button>
      <button id="create-polygon" @click="selectFeature(`polygon`)">POLYGON</button>
      <button id="select-object" @click="selectFeature(`select`)">SELECT</button>
      <button id="file-save">SAVE</button>
      <button id="file-open">OPEN FILE</button>
    </div>
    <h2>{{ currentFeature }}</h2>

  </div>
</template>

<script>

import { createProgramShader, createSelectShader } from '@/utils/shaders';
import GLObject from '@/utils/GLobject';
import Editor from '@/utils/editor';

export default {
  name: "WebGLCanvas",
  data() {
    return {
      canvas: null,
      gl: null,
      shaderProgram: null,
      selectProgram: null,
      glToRender: new Array(),
      itemCount: 0,
      frameBuffer: null,
      mousePos: {
        x: 0,
        y: 0
      },
      selectedObject: null,
      pointArr: null,
      mouseDown: false,
      currentFeature: null,
      lineObject: null,
    }
  },
  mounted() {
    this.canvas = document.getElementById('webGL');
    this.gl = this.canvas.getContext('webgl2');
    //  setup program shader  
    const shaderProgram = createProgramShader(this.gl);
    // setup select shader
    const selectProgram = createSelectShader(this.gl);

    this.shaderProgram = shaderProgram;
    this.selectProgram = selectProgram;
    // use program
    this.gl.useProgram(shaderProgram);
    // adjust view port 
    this.gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height);
    const u_resolution = this.gl.getUniformLocation(shaderProgram, 'u_resolution')
    this.gl.uniform2f(u_resolution, this.gl.canvas.width, this.gl.canvas.height)
    // texture buffer
    const textureBuffer = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, textureBuffer);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    // depth buffer
    const depthBuffer = this.gl.createRenderbuffer();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthBuffer);
    const setFrameBufferAttatchmentSizes = (width, height) => {
      this.gl.bindTexture(this.gl.TEXTURE_2D, textureBuffer);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
      this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthBuffer);
      this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
    };
    setFrameBufferAttatchmentSizes(this.gl.canvas.width, this.gl.canvas.height);
    // frame buffer
    const frameBuffer = this.gl.createFramebuffer();
    this.frameBuffer = frameBuffer;
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer);
    const attachmentPoint = this.gl.COLOR_ATTACHMENT0;
    const lvl = 0;
    // put it all together
    // using the texture and depth buffer with frame buffer
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachmentPoint, this.gl.TEXTURE_2D, textureBuffer, lvl);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthBuffer);

    const triangleData = [
      // X , Y
      0.0, 0.0,
      100.0, 0.0,
      0.0, 100.0,
      0.0, 100.0,
      100.0, 100.0,
      100.0, 0.0
    ]

    const ob1 = new GLObject(0, this.shaderProgram, this.gl);
    ob1.setVertexArr(triangleData);
    ob1.setTranslatePoint(-1.0,-1.0);
    ob1.setRotateDegree(0);
    ob1.setScaleSize(1.0,1.0);
    ob1.setColorVector(1.0, 0.5, 1.0, 1.0);
    ob1.bindBuffer();

    this.addObject(ob1);
    this.render();

    this.editor = new Editor(this.canvas, this.gl);
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
      this.gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height);
      for(const obj of this.glToRender) {
        obj.draw();
      }
    },
    renderTexture() {
      for(const obj of this.glToRender) {
        obj.drawSelect(this.selectProgram);
      }
    },
    createObject() {
      const newObj = new GLObject(this.itemCount, this.shaderProgram, this.gl);
      return newObj;
    },
    updateMouse(e) {
      const bound = this.canvas.getBoundingClientRect();
      const newMouse = {
        x: e.clientX - bound.left,
        y: e.clientY - bound.top
      }
      this.mousePos = newMouse;
    },
    inspectObject() {      
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      this.gl.useProgram(this.selectProgram);
      const resolutionPos = this.gl.getUniformLocation(this.selectProgram, 'u_resolution');
      this.gl.uniform2f(resolutionPos, this.gl.canvas.width, this.gl.canvas.height);

      this.renderTexture(this.selectProgram);
      // pixel X val
      const pixelX = this.mousePos.x * this.gl.canvas.width / this.canvas.clientWidth;
      const pixelY = this.gl.canvas.height - this.mousePos.y * this.gl.canvas.height / this.canvas.clientHeight - 1;

      const data = new Uint8Array(4);
      this.gl.readPixels(pixelX, pixelY, 1,1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);

      // search id
      const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);


      // erase frame buffer
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

      // use the programShader
      this.gl.useProgram(this.shaderProgram);
      this.render();

      // return object
      console.log(`Object ID ${id}`);
      if(id >=0 ) {
        this.selectedObject = this.glToRender[id];
      }
    },
    selectFeature(e) {
      if(this.currentFeature === e) {
        this.pointArr = null;
      }
      this.pointArr = [];
      this.selectedObject = null;
      this.currentFeature = null;
      this.lineObject = null;
      this.currentFeature = e;
    },
    onClickHandler() {
      switch (this.currentFeature) {
        case 'line':
          this.pointArr.push(...Object.values(this.mousePos));
          break;
        case 'point':
          break;
        case 'square':
          break;
        case 'select':
          this.inspectObject();
          alert(`You got GLObect with Id ${this.selectedObject}`);
          break;        
        default:
          console.log("NOTHING HEHE");
          break;
      }
    },
    mouseUpHandler() {
      this.mouseDown = false;
    }

  },
  watch: {
    itemCount() {
      this.render();
    },
    mousePos() {
      if(this.mouseDown && this.currentFeature === 'line') {
        if(this.pointArr.length > 2) {
          this.pointArr = [this.pointArr[0], this.pointArr[1]];
          this.glToRender.delete(this.itemCount-1);
          this.pointArr.push(...Object.values(this.mousePos));
        } else {
          this.pointArr.push(...Object.values(this.mouseDown));
        }
        console.log(this.pointArr);
        const line = this.createObject();
        line.setVertexArr(this.pointArr);
        line.bindBuffer();
        line.setRenderType(this.gl.LINES);
        this.addObject(line);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.canvas-container {
  border: solid 1px black;
}
</style>
