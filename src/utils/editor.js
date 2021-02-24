// import squareObject from './square'

import GLVertexObject from "./GLvertexObject";

const getMouseCoordinates = (e, canvas, gl) => 
{
    const bound = canvas.getBoundingClientRect();
      const mouseCoordinates = {
        x: (e.clientX - bound.left) * gl.canvas.width / canvas.clientWidth,
        y: this.gl.canvas.height - (e.clientY - bound.top) * gl.canvas.height / canvas.clientHeight - 1
      }
      console.log(mouseCoordinates.x, mouseCoordinates.y);

      return mouseCoordinates;
}

const getPositionDelta = (pos1, pos2) =>
{
    const delta = {
        x: pos2.x - pos1.x,
        y: pos2.y - pos1.y
    }

    return delta;
}

export default class Editor
{
    constructor(canvas, glContext)
    {
        this.canvas = canvas;
        this.points = [];
        this.glContext = glContext;
    }

    addPoints(count)
    {
        while (this.points.length < count)
        {
            // Add validation later
            this.canvas.addEventListener("mouseclick", e =>
            {
                this.points.push(getMouseCoordinates(e, this.canvas, this.glContext));
            }
            )
            console.log("Added point");
        }
    }

    clearPoints()
    {
        this.points = [];
    }

    showVertexes(object, itemCount)
    {   
        var i;
        var vertexPointers = new Array();
        for (i = 0; i < this.object.vertexArr.length; i+=2)
        {
            // console.log("vertexes ", i/2);
            // console.log(object.vertexArr[i], object.vertexArr[i+1]);
            vertexPointers.push(new GLVertexObject(itemCount, object.shaderProgram, object.glContext, object.vertexArr[i], object.vertexArr[i+1], object, i/2));
            itemCount++;
            // console.log(vertexPointers[i/2]);
        }

        this.vertexPointers = vertexPointers;

        return vertexPointers;
    }

    hideVertexes()
    {
        // var toDelete = new Array();
        // for (var obj in this.vertexPointers)
        // {
        //     toDelete.push(obj.id);
        // }

        // this.vertexPoin
    }

    // On key down
    selectObject(object, mousePos)
    {
        this.clearPoints();
        this.points.push(mousePos); // initial mouse point
        this.points.push(object.translatePoint);
        this.object = object;
        this.object.setTranslatePoint(this.object.translatePoint.x, this.object.translatePoint.y);
        // console.log("Translate from ", this.object.translatePoint.x, "and ", this.object.translatePoint.y);
        // console.log("START AT", this.object.vertexArr[0]);
        // this.object.highlight = true;
    }

    // On key down + on mouse move 
    // assumes an object is selected
    moveObject(mousePos)
    {
        this.object.setTranslatePoint(0, 0);
        this.points[2] = mousePos; // set currentmouse
        // this.points[3] = this.object.translatePoint;
        // this.object.setTranslatePoint(this.points[1].x, this.points[1].y);
        var delta = getPositionDelta(this.points[0], this.points[2]);
        this.object.setTranslatePoint(delta.x, delta.y);

        // console.log("Translate to ", this.object.translatePoint.x, "and ", this.object.translatePoint.y);

        // this.points[0] = mousePos; // set currentmouse to prev mouse
    }

    // On key up
    releaseObject()
    {
        // console.log("Translate to ", this.object.translatePoint.x, "and ", this.object.translatePoint.y);
        this.object.setTranslate();
        // this.object.highlight = false;
        // console.log("END AT", this.object.vertexArr[0]);
        this.clearPoints();
        // this.object = null;
    }
}