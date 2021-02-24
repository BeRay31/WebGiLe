import { translate, rotate, scale, matrixMultiplication } from './projection';

export default class GLVertexObject {
    constructor(
      id, 
      shaderProgram, 
      glContext,
      x, y
    ) {
      this.id = id;
      this.vertexArr = [
            x-50, y-50,
            x-50, y+50,
            x+50, y+50,
            x+50, y-50
      ]; // init state `is empty`
      this.shaderProgram = shaderProgram;
      this.translatePoint = {
        x: 0,
        y: 0
      }; // default (no translation)
      this.rotateDegree = 0; // no rotation
      this.scaleSize = {
        x: 1,
        y: 1
      }; // default scaling
      this.colorVector = {
        R: 1.0,
        G: 1.0,
        B: 1.0,
        A: 1.0
      };
      this.glContext = glContext;
      this.renderType = this.glContext.TRIANGLES;
      this.highlight = false;
    }

    setTranslatePoint(x, y) { 
        this.translatePoint.x = x;
        this.translatePoint.y = y;

        console.log("vertex count ",this.vertexArr.length);
        var i = 0;
        for (i = 0; i < this.vertexArr.length; i+=2)
        {
          this.vertexArr[i] += this.translatePoint.x;
          this.vertexArr[i+1] += this.translatePoint.y;
          console.log("working on vertex set", i);
        }

        this.x += x;
        this.y += y;
    
        console.log("done");
        this.translatePoint.x = 0;
        this.translatePoint.y = 0;
    }

    calculateProjMat() { // ((rotation x scale) x translate)
        this.projectionMat =  matrixMultiplication(
          matrixMultiplication(
            rotate(this.rotateDegree),
            scale(this.scaleSize.x, this.scaleSize.y)
          ),
          translate(this.translatePoint.x, this.translatePoint.y)
        );
      }
    
      bindBuffer() {
        // https://stackoverflow.com/questions/27148273/what-is-the-logic-of-binding-buffers-in-webgl
        const newBuffer = this.glContext.createBuffer();
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, newBuffer); // set array buffer to points newBuffer
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(this.vertexArr), this.glContext.STATIC_DRAW); // set array buffer data to float array and context usage to static draw 
      }
    
      drawSelect(selectProgram) {
        this.calculateProjMat();
        this.bindBuffer();
        this.glContext.useProgram(selectProgram);
        let vertexPos = this.glContext.getAttribLocation(selectProgram, 'a_position');
        let uniformCol = this.glContext.getUniformLocation(selectProgram, 'u_fragColor');
        let uniformPos = this.glContext.getUniformLocation(selectProgram, 'u_proj_mat');
        this.glContext.uniformMatrix3fv(uniformPos, false, this.projectionMat)
        this.glContext.vertexAttribPointer(vertexPos, 2, this.glContext.FLOAT, false, 0, 0);
        this.glContext.enableVertexAttribArray(vertexPos);
        const uniformId = [
          ((this.id >> 0) & 0xFF) / 0xFF,
          ((this.id >> 8) & 0xFF) / 0xFF,
          ((this.id >> 16) & 0xFF) / 0xFF,
          ((this.id >> 24) & 0xFF) / 0xFF,
        ]
        this.glContext.uniform4fv(uniformCol, uniformId);
        this.glContext.drawArrays(this.renderType, 0, this.vertexArr.length/2);
      }
    
      draw() {
        this.calculateProjMat();
        this.bindBuffer();
        this.glContext.useProgram(this.shaderProgram);
        // get any attr and uniform from glsl
        let vertexPos = this.glContext.getAttribLocation(this.shaderProgram, 'a_position');
        let matProj = this.glContext.getUniformLocation(this.shaderProgram, 'u_proj_mat');
        let colorFrag = this.glContext.getUniformLocation(this.shaderProgram, 'u_fragColor');
        // https://webglfundamentals.org/webgl/lessons/webgl-attributes.html
        // https://stackoverflow.com/questions/26677685/what-is-the-purpose-of-vertexattribpointer
        this.glContext.vertexAttribPointer(vertexPos, 2, this.glContext.FLOAT, false, 0, 0);
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix
        this.glContext.uniformMatrix3fv(matProj, false, this.projectionMat);
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
        this.glContext.uniform4f(colorFrag, ...Object.values(this.colorVector)); // spread operator js `...`
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray
        this.glContext.enableVertexAttribArray(vertexPos);
    
        // draw
        this.glContext.drawArrays(this.renderType, 0, this.vertexArr.length/2);
      }
  }