<template>
  <div class="home" onload="InitDemo()">
    <h1>WEB GiLe CanVas</h1>
    <div class="canvas-container">
      <canvas 
        id="webGL"
        width="1280px"
        height="720px"
        @mousemove="updateMouse"
        @mousedown="mouseDownHandler"
        @mouseup="mouseUpHandler"
      >
      </canvas>
    </div>

    <div class="menu-container">
      <div 
        class="btn"
        :class="[currentFeature == 'line' ? 'btn-secondary' : 'btn-secondary--alt']" 
        @click="selectFeature(`line`)">
        LINE
      </div>
      <div 
        class="btn btn-secondary" 
        :class="[currentFeature == 'square' ? 'btn-secondary' : 'btn-secondary--alt']" 
        @click="selectFeature(`square`)">
        SQUARE
      </div>
      <div 
        class="btn btn-secondary" 
        :class="[currentFeature == 'polygon' ? 'btn-secondary' : 'btn-secondary--alt']" 
        @click="selectFeature(`polygon`)">
        POLYGON
      </div>
      <div 
        class="btn btn-secondary" 
        :class="[currentFeature == 'select' ? 'btn-secondary' : 'btn-secondary--alt']" 
        @click="selectFeature(`select`)"
      >
        SELECT
      </div>
      <div 
        class="btn btn-secondary" 
        @click="openModal('', '')"
      >
        HELP
      </div>
    </div>
    <div class="menu-container">
      <div v-if="selectedObject" class="color-container">
        <input v-model.number="selectedSize" type="number" step="0.1">
        <div
          class="btn btn-secondary--alt" 
          @click="resizeObject">
          RESIZE
        </div>
      </div>
      <div v-if="selectedObject" class="color-container">
        <input type="color" v-model="selectedColor">
        <div
          class="btn btn-secondary--alt" 
          @click="attachColor">
          ATTACH COLOR
        </div>
      </div>
      <div 
        class="btn btn-secondary--alt" 
        @click="clickInputFile">
        OPEN FILE
      </div>
      <div 
        class="btn btn-secondary--alt"
        @click="saveCurrentCanvas">
        SAVE FILE
      </div>
      <div
        v-if="currentFeature == 'polygon'" 
        class="btn btn-secondary--alt" 
        @click="newPolygon">
        NEW POLYGON
      </div>
      <div 
        v-if="selectedObject" 
        class="btn btn-secondary--alt" 
        @click="deleteObject">
        DELETE OBJECT
      </div>
      <div 
        class="btn btn-secondary--alt" 
        @click="clearObject">
        CLEAR CANVAS
      </div>
    </div>
    <input 
      id="hidden-input-file-button" 
      type="file" 
      accept=".wbgile.json"
      @change="renderJSON"
    >
    <Modal
      v-if="modal.state"
      :state="modal.state"
      :title="modal.title"
      medium-height
      @closeModal="closeModal"
    >
      <div class="modal-content">
        <h2>
          Create a Line
        </h2>
        <div class="content">
          - Click LINE button<br>
          - Click and drag mouse from one point to other point <br>
        </div>
        <h2>
          Create a Square
        </h2>
        <div class="content">
          - Click SQUARE button<br>
          - Click and drag mouse from one point to other point 
        </div>
        <h2>
          Create a Polygon
        </h2>
        <div class="content">
          - Click POLYGON button<br>
          - Click at a point for the starting point <br>
          - Click at another point to be the next vertices<br>
          - Click NEW POLYGON button to start making a new polygon 
        </div>
        <h2>
          Move a Vertex
        </h2>
        <div class="content">
          - Click SELECT button<br>
          - Select an object <br>
          - Drag a vertex to move the vertex to the desired position
        </div>
        <h2>
          Move an Object
        </h2>
        <div class="content">
          - Click SELECT button<br>
          - Select an object <br>
          - Drag mouse to move object to the desired position
        </div>
        <h2>
          Resize an Object
        </h2>
        <div class="content">
          - Click SELECT button<br>
          - Select an object <br>
          - Put in a range enlargement number 
        </div>
        <h2>
          Recolor an Object
        </h2>
        <div class="content">
          - Click SELECT button<br>
          - Select an object <br>
          - Put in a RGB/HSL/HEX code or pick a color with the color picker/slider/mapper<br>
          - Click ATTACH COLOR button
        </div>
        <h2>
          Delete an Object
        </h2>
        <div class="content">
          - Click SELECT button<br>
          - Select an object <br>
          - Click on DELETE OBJECT button
        </div>
        <h2>
          Clear the Canvas
        </h2>
        <div class="content">
          - Click CLEAR CANVAS button<br>
        </div>
        <h2>
          Load a Saved File
        </h2>
        <div class="content">
          - Click OPEN FILE button<br>
          - Choose a desired file 
        </div>
        <h2>
          Save a File
        </h2>
        <div class="content">
          - Click SAVE FILE button 
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>

import { createProgramShader, 
        createSelectShader, 
        prepareFrameTexture,
        hexToRgb
      } from '@/utils/shaders';
import Modal from '@/components/Modal';
import GLObject from '@/utils/GLobject';
import Editor from '@/utils/editor';

export default {
  name: "WebGLCanvas",
  components: {
    Modal
  },
  data() {
    return {
      // gl properties
      canvas: null,
      gl: null,
      shaderProgram: null,
      selectProgram: null,
      frameBuffer: null,
      glToRender: new Array(),
      overlayToRender: new Array(),
      itemCount: 0,
      mousePos: {
        x: 0,
        y: 0
      },
      JSONFile: null,
      // boolean and temp variables
      selectedObject: null,
      selectedSize: 1,
      pointArr: null,
      mouseDown: false,
      currentFeature: null,
      tempRenderedObject: null,
      selectedColor: "#000000",
      modal: {
        state: false,
        title: "How to Play",
        helpText: "BASDALSDLASDKASD",
        helpFeature: "SELECT BUTTON"
      }
    }
  },
  mounted() {
    this.canvas = document.getElementById('webGL');
    this.gl = this.canvas.getContext('webgl2');
    //  setup shader  
    const shaderProgram = createProgramShader(this.gl);
    const selectProgram = createSelectShader(this.gl);
    this.shaderProgram = shaderProgram;
    this.selectProgram = selectProgram;

    this.gl.useProgram(this.shaderProgram);
    // adjust view port 
    this.gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height);
    const u_resolution = this.gl.getUniformLocation(this.shaderProgram, 'u_resolution');
    this.gl.uniform2f(u_resolution, this.gl.canvas.width, this.gl.canvas.height);
    // prepare frame buffer
    this.frameBuffer = prepareFrameTexture(this.gl);

    this.editor = new Editor(this.canvas, this.gl);
  },
  methods: {
    closeModal() {
      this.modal.state = false;
    },
    openModal(subtitle, text) {
      this.modal.state = true;
      this.modal.helpFeature = subtitle;
      this.modal.helpText = text;
    },
    clearCanvas() {
      this.gl.clearColor(1,1,1,1);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    },
    addObject(obj) {
      this.glToRender.push(obj)
      this.itemCount++;
    },
    addToOverlay(obj) {
      this.overlayToRender.push(obj);
      this.itemCount++;
    },
    deleteObject() {
      const toBeDeleted = this.glToRender.findIndex(el => el.id === this.selectedObject.id);
      this.glToRender.splice(toBeDeleted, 1);
      this.clearOverlay();
      this.render();
    },
    clearOverlay() {
      this.overlayToRender = new Array();
    },
    render() {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      this.clearCanvas();
      this.gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height);
      for(const obj of this.glToRender) {
        obj.draw();
      }
      for(const obj of this.overlayToRender) {
        obj.draw();
      }
    },
    renderTexture() {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
      this.clearCanvas();
      for(const obj of this.glToRender) {
        obj.drawSelect(this.selectProgram);
      }
      for(const obj of this.overlayToRender) {
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
        x: (e.clientX - bound.left) * this.gl.canvas.width / this.canvas.clientWidth,
        y: this.gl.canvas.height - (e.clientY - bound.top) * this.gl.canvas.height / this.canvas.clientHeight - 1
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

      const data = new Uint8Array(4);
      this.gl.readPixels(this.mousePos.x , this.mousePos.y, 1.5, 1.5, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);

      // search id
      const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);

      // erase frame buffer
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      this.gl.disable(this.gl.DEPTH_TEST);

      // use the programShader
      this.gl.useProgram(this.shaderProgram);

      if(id >=0 ) {
        this.selectedObject = this.overlayToRender.find(el => el.id === id) || this.glToRender.find(el => el.id === id);
        if (!this.selectedObject.vertexObject)
        {
          this.lastSelectedObject = this.selectedObject;
        }
      } else {
        this.selectedObject = null;
      }
    },
    selectFeature(e) {
      if(this.currentFeature == e) {
        this.currentFeature = null;
      }
      this.pointArr = new Array();
      this.selectedObject = null;
      this.tempRenderedObject = null;
      this.currentFeature = e;

      if (this.currentFeature != 'select')
      {
        this.clearOverlay();
        this.selectedObject = null;
        this.render();
      }
    },
    createOverlayForObject(obj)
    {
      if (!obj.vertexObject)
        {
          var vertexPointers = this.editor.showVertexes(obj, this.itemCount);

          var i;
          for (i = 0; i < vertexPointers.length; i++)
          {
            this.addToOverlay(vertexPointers[i]);
          }
        }
    },
    mouseDownHandler() {
      this.mouseDown = true;
      let prevObject;
      switch (this.currentFeature) {
        case 'line':
          this.pointArr.push(...Object.values(this.mousePos));
          break;
        case 'square':
          this.pointArr.push(...Object.values(this.mousePos));
          break;
        case 'polygon':
          this.drawPolygon(this.mousePos);
          break;
        case 'select':
          prevObject = this.selectedObject;
          this.inspectObject();
          if (prevObject != this.selectedObject && 
            !this.selectedObject.vertexObject
          ) {
            this.clearOverlay();
          }
          this.pointArr = new Array();
          this.editor.selectObject(this.selectedObject, this.mousePos, this.overlayToRender);

          if (prevObject != this.selectedObject)
          {
            this.createOverlayForObject(this.selectedObject);
          }            
          break;        
        default:
          console.log("NOTHING HEHE");
          break;
      }
      this.render();
    },
    mouseUpHandler() {
      this.mouseDown = false;
      if(this.currentFeature == 'line' ||
        this.currentFeature == 'square'
      ) {
        this.pointArr = new Array(); 
        this.selectedObject = null; 
        this.tempRenderedObject = null;
      } else if(this.currentFeature == 'polygon'){
        this.pointArr.push(...Object.values(this.mousePos));
      } else if(this.currentFeature == 'select') {
        this.pointArr = new Array();
        this.editor.releaseObject();
        for (let i = 0; i < this.overlayToRender.length; i++)
        {
          this.overlayToRender[i].setTranslate();
        }
      }
      // this.editor.releaseObject();
      this.render();
    },
    drawLine(value) {
      if(this.pointArr.length > 2) {
        this.pointArr = [this.pointArr[0], this.pointArr[1]];
        this.pointArr.push(...Object.values(value));
      } else {
        this.pointArr.push(...Object.values(value));
      }
      if(!this.tempRenderedObject) {
        this.tempRenderedObject = this.createObject();
        this.tempRenderedObject.setVertexArr([...this.pointArr]);	
        this.tempRenderedObject.setRenderType(this.gl.LINES);	
        this.tempRenderedObject.setColorVector(0.5, 0.5, 1, 1);
        this.addObject(this.tempRenderedObject);
      } else {
        this.tempRenderedObject.setVertexArr([...this.pointArr]);	
        this.tempRenderedObject.setRenderType(this.gl.LINES);	
        this.render();
      }
    },
    drawSquare(value) {
      let squareVertex = [];
      if(this.pointArr.length > 2) {
        this.pointArr = [this.pointArr[0], this.pointArr[1]];
        this.pointArr.push(...Object.values(value));
      } else {
        this.pointArr.push(...Object.values(value));
      }
      // compute square arr
      const x = this.pointArr[0];
      const y = this.pointArr[1];
      const a = this.pointArr[2];
      const b = this.pointArr[3];

      const lengthX = a-x;
      const lengthY = b-y;

      // let minLength = 0
      const minLength = (Math.max(Math.abs(lengthX),Math.abs(lengthY)) == Math.abs(lengthX)) ? Math.abs(lengthY) : Math.abs(lengthX);
      if (a >= x) {
        if (b >= y) { // kanan atas
          squareVertex = [
            x, y,
            x, (y + minLength),
            (x + minLength), (y + minLength),
            (x + minLength), y
          ]
        } else { // kanan bawah
          squareVertex = [
            x, y,
            (x + minLength), y,
            (x + minLength), (y - minLength),
            x, (y - minLength),
          ]
        }
      } else {
        if (b >= y) { // kiri atas
          squareVertex = [
            x, y,
            (x - minLength), y,
            (x - minLength), (y + minLength),
            x, (y + minLength),
          ]
        } else { // kiri bawah
          squareVertex = [
            x, y,
            x, (y - minLength),
            (x - minLength), (y - minLength),
            (x - minLength), y
          ]
        }
      }
      
      if(!this.tempRenderedObject) {
        this.tempRenderedObject = this.createObject();
        this.tempRenderedObject.setVertexArr([...squareVertex]);	
        this.tempRenderedObject.setRenderType(this.gl.TRIANGLE_FAN);	
        this.tempRenderedObject.setColorVector(0.5, 0.5, 0, 1);
        this.addObject(this.tempRenderedObject);
      } else {
        this.tempRenderedObject.setVertexArr([...squareVertex]);	
        this.tempRenderedObject.setRenderType(this.gl.TRIANGLE_FAN);	
        this.render();
      }
    },
    drawPolygon(value) {
      const vertexArr = [...this.pointArr];
      vertexArr.push(...Object.values(value));
      if(!this.tempRenderedObject) {
        this.tempRenderedObject = this.createObject();
        this.tempRenderedObject.setVertexArr([...vertexArr]);	
        this.tempRenderedObject.setRenderType(this.gl.TRIANGLE_FAN);	
        this.tempRenderedObject.setColorVector(0.5, 0.0, 0.5, 1);
        this.addObject(this.tempRenderedObject);
      } else {
        this.tempRenderedObject.setVertexArr([...vertexArr]);	
        this.tempRenderedObject.setRenderType(this.gl.TRIANGLE_FAN);	
        this.render();
      }
    },
    moveObject(value) {
      const pointArr = [...this.pointArr];
      pointArr.push(value);
      const deltaX = pointArr[1].x - pointArr[0].x;
      const deltaY = pointArr[1].y - pointArr[0].y;
      this.selectedObject.setTranslatePoint(deltaX, deltaY);
      this.render();
    },
    resizeObject() {
      this.lastSelectedObject.setTranslatePoint(0, 0);
      this.lastSelectedObject.scaleVertex(this.selectedSize);

      this.clearOverlay();
      this.createOverlayForObject(this.selectedObject);

      this.render();
    },
    attachColor() {
      const currentRGB = hexToRgb(this.selectedColor);
      const vecColorObj = {
        r: currentRGB.r/255,
        g: currentRGB.g/255,
        b: currentRGB.b/255
      }
      this.selectedObject.setColorVector(...Object.values(vecColorObj), 1.0);
      this.render();
    },
    newPolygon() {
      this.pointArr = new Array(); 
      this.selectedObject = null; 
      this.tempRenderedObject = null;
    },
    clearObject() {
      this.glToRender = new Array();
      this.clearOverlay();
      this.itemCount = 0;
    },
    clickInputFile() {
      document.getElementById('hidden-input-file-button').click();
    },
    async renderJSON(e) {
      this.JSONFile = e.target.files[0];
      const JSONUrl = URL.createObjectURL(this.JSONFile);
      const jsonFile = await fetch(JSONUrl);
      const vertexArr = await jsonFile.json();
      for(const obj of vertexArr) {
        const newObj = this.createObject();
        newObj.setColorVector(...obj.colorVector);
        newObj.setVertexArr(obj.vertexArray);
        newObj.setRenderType(obj.renderType);
        this.addObject(newObj);
      }
      document.getElementById('hidden-input-file-button').value = null;
      this.render();
    },
    async saveCurrentCanvas() {
      const exportName = "webGiLeCanvas";
      const toBeSaved = [...this.glToRender.map(el => {
        return {
          vertexArray: el.vertexArr,
          colorVector: [...Object.values(el.colorVector)],
          renderType: el.renderType
        }
      })]
      const toBeDownloaded = JSON.stringify(toBeSaved);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(toBeDownloaded);
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", exportName + ".wbgile.json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  },
  watch: {
    itemCount() {
      this.render();
    },
    mousePos(value) {
      if(this.mouseDown) {
        switch (this.currentFeature) {
          case 'line':
            this.drawLine(value);
            break;
          case 'square':
            this.drawSquare(value);
            break;
          case 'polygon':
            this.drawPolygon(value);
            break;
          case 'select':
            if (this.selectedObject)
            {
              this.editor.moveObject(this.mousePos);
              if (!this.selectedObject.vertexObject) {
                console.log("THIS IS NOT A VERTEX OBJECT");
                this.editor.moveOverlayObjects(this.mousePos);
              }
            this.render();
            }
            
            break;
          default:
            break;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import './button';

.canvas-container {
  display: flex;
  align-items: center;
  justify-content: center;

  canvas {
  border: solid 1px black;
    width: 1280px;
    height: 720px;
  }
}

.menu-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

#hidden-input-file-button {
  display: none;
}

.color-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  border: solid $purple 1px;
  padding: 4px;
  border-radius: 5px;

  input {
    height: 80%;
  }
}
</style>
