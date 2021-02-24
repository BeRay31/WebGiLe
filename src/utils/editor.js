// import squareObject from './square'

import GLVertexObject from "./GLvertexObject";

const getMouseCoordinates = (e, canvas, gl) => 
{
    const bound = canvas.getBoundingClientRect();
      const mouseCoordinates = {
        x: (e.clientX - bound.left) * gl.canvas.width / canvas.clientWidth,
        y: this.gl.canvas.height - (e.clientY - bound.top) * gl.canvas.height / canvas.clientHeight - 1
      }
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
            vertexPointers.push(new GLVertexObject(itemCount, object.shaderProgram, object.glContext, object.vertexArr[i], object.vertexArr[i+1], object, i/2));
            itemCount++;
        }

        this.vertexPointers = vertexPointers;

        return vertexPointers;
    }

    // On key down
    selectObject(object, mousePos, overlay)
    {
        this.clearPoints();
        this.points.push(mousePos); // initial mouse point
        this.points.push(object.translatePoint);
        this.object = object;
        this.object.setTranslatePoint(this.object.translatePoint.x, this.object.translatePoint.y);

        if (!this.object.vertexObject)
        {
            this.overlayArray = overlay;
        } else {
            this.overlayArray = [];
        }
    }

    // On key down + on mouse move 
    // assumes an object is selected
    moveObject(mousePos)
    {
        this.object.setTranslatePoint(0, 0);

        this.points[2] = mousePos; // set currentmouse
        var delta = getPositionDelta(this.points[0], this.points[2]);
        this.object.setTranslatePoint(delta.x, delta.y);

        if (this.object.vertexObject)
        {
            this.object.glObject.vertexArr[this.object.vID*2] = this.object.x + this.object.translatePoint.x;
            this.object.glObject.vertexArr[this.object.vID*2+1] = this.object.y + this.object.translatePoint.y; 
        }
    }

    moveOverlayObjects(mousePos)
    {
        var i;
        for(i = 0; i < this.overlayArray.length; i++)
        {
            this.overlayArray[i].setTranslatePoint(0, 0);

            this.points[2] = mousePos; // set currentmouse
            var delta = getPositionDelta(this.points[0], this.points[2]);
            this.overlayArray[i].setTranslatePoint(delta.x, delta.y);
        }

        // this.object.setTranslate();
    }

    // On key up
    releaseObject()
    {
        this.object.setTranslate();
        
        var i;
        for (i = 0; i < this.overlayArray.length; i++)
        {
            this.overlayArray[i].setTranslate();
        } 

        this.clearPoints();
    }
}