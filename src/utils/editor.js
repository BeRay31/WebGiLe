// import squareObject from './square'

const getMouseCoordinates = (e, canvas) => 
{
    const bound = canvas.getBoundingClientRect();
      const mouseCoordinates = {
        x: e.clientX - bound.left,
        y: e.clientY - bound.top
      }
      console.log(mouseCoordinates.x, mouseCoordinates.y);

      return mouseCoordinates;
}

const getPositionDelta = (pos1, pos2) =>
{
    const delta = {
        x: pos1.x - pos2.x,
        y: pos1.x - pos2.y
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
                this.points.push(getMouseCoordinates(e, this.canvas));
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
    selectObject(object)
    {
        this.clearPoints();
        this.addPoints(1);
        this.object = object;
    }

    // On key down + on mouse move 
    // assumes an object is selected
    moveObject()
    {
        this.addPoints(1);
        var delta = getPositionDelta(this.points[0], this.points[1])
        this.object.setTranslatePoint(delta.x, delta.y);
    }

    // On key up
    releaseObject()
    {
        this.clearPoints();
    }
}