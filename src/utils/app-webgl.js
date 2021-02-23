import shader from "./shader.js"

var getRelativeMousePosition = function(event, canvas)
{
    canvas = canvas || event.target;
    var canvasRectangle = canvas.getBoundingClientRect();

    var pos;
    // Remove mouse offset relative to viewset
    pos.x = event.clientX - canvasRectangle.left;
    pos.y = event.clientY - canvasRectangle.top;

    // Change into WebGL coordinates
}

var InitDemo = function()
{
    console.log('Loaded');
    var canvas = document.getElementById('surface');
    var gl = canvas.getContext('webgl');

    // Program
    var program = shader(gl);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.error('ERROR: Program failed to link', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
    {
        console.error('ERROR: Program failed to validate', gl.getProgramInfoLog(program));
        return;
    }

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.useProgram(program);

    window.addEventListener('click', function() 
    { 
        console.log("CLICK");
    });

    var testTriangle = new GLObject(1, program, gl);
    var triangleVertices = 
        [// X       Y       Z     
            0.0,    0.5,    0.0,
            -0.4,   -0.5,   0.0,   
            0.4,    -0.5,   0.0  
        ];

    testTriangle.setVertex(triangleVertices);
    testTriangle.setColor([1, 0, 0]);

    var loop = function() {
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        testTriangle.draw();
        
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}
