const getMouseCoordinates = (canvas) => 
{
    const bound = canvas.getBoundingClientRect();
      const mouseCoordinates = {
        x: e.clientX - bound.left,
        y: e.clientY - bound.top
      }
      console.log(mouseCoordinates.x, mouseCoordinates.y);

      return mouseCoordinates;
}

export default class Editor
{
    constructor(canvas)
    {
        this.canvas = canvas;
        this.points = [];
    }

    addPoints(count)
    {
        while (this.points.length < count)
        {
            // Add validation later
            this.points.push(getMouseCoordinates(this.canvas));
        }
    }
}