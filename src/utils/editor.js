// import squareObject from './square'

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
        y: pos2.x - pos1.y
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

    createLine()
    {
        this.addPoints(2);   
    }

    createSquare()
    {
        // this.addPoints(2);
        // var length = Math.min(this.points[0].x - this.points[1].x, this.points[0].y - this.points[1].y);
        // var squareObject = new squareObject(this.points[0].x, this.points[0].y, length, this.glContext);
        // clearPoints();
        // return squareObject;
    }

    createPolygon()
    {
        
    }

    // On key down
    selectObject(object, mousePos)
    {
        this.clearPoints();
        this.points.push(mousePos); // prevmouse
        this.points.push(mousePos); // currmouse
        this.object = object;
    }

    // On key down + on mouse move 
    // assumes an object is selected
    moveObject(mousePos)
    {
        this.points[1] = mousePos; // set currentmouse
        var delta = getPositionDelta(this.points[0], this.points[1])
        this.object.setTranslatePoint(delta.x, delta.y);

        this.points[0] = mousePos; // set currentmouse to prev mouse
    }

    // On key up
    releaseObject()
    {
        this.clearPoints();
    }
}