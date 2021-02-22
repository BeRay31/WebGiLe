// const { glMatrix } = require("./gl-matrix");

var vertexShaderText = 
[
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    // 'attribute vec3 vertColor;',
    // 'varying vec3 fragColor;',
    // 'uniform mat4 mWorld;',
    // 'uniform mat4 mView;',
    // 'uniform mat4 mProj;',
    '',
    'void main()',
    '{',
    // '   fragColor = vertColor;',
    // '   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
    '   gl_Position = vec4(vertPosition, 1.0);',
    '}'
].join('\n');

var fragmentShaderText = 
[
    'precision mediump float;',
    '',
    'uniform vec3 color;',
    // 'varying vec3 fragColor;',
    'void main()',
    '{',
    '   gl_FragColor = vec4(color, 1.0);',
    '}'
].join('\n');

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

var convertToCanvasCoordinates = function(absoluteCoordinates, canvas)
{
    absoluteCoordinates.x = absoluteCoordinates.x / canvas.width * 2 - 1;
    absoluteCoordinates.y = absoluteCoordinates.y / canvas.height * -2 + 1;

    return absoluteCoordinates;
}

class GLObject {
    constructor(id, program, glContext)
    {
        this.id = id;
        this.program = program;
        this.gl = glContext;
        this.scaleFactor = [1, 1];
        this.translateDelta = [0, 0];
    }

    setVertex(vertexArray)
    {
        this.vertices = vertexArray;
    }

    setColor(colorRGB)
    {
        this.color = colorRGB;
    }

    scale(x, y)
    {
        this.scaleFactor = [x, y];
    }

    translate(x, y)
    {
        this.translateDelta = [x, y];
    }

    draw()
    {
        var positionAttribLocation = this.gl.getAttribLocation(this.program, 'vertPosition');
        this.gl.vertexAttribPointer(
            positionAttribLocation,
            3,
            this.gl.FLOAT,
            this.gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );

        this.gl.enableVertexAttribArray(positionAttribLocation);
        this.gl.useProgram(this.program);

        var colorUniformLocation = this.gl.getUniformLocation(this.program, 'color');
        this.gl.uniform3f(colorUniformLocation, this.gl.FALSE, this.color[0], this.color[1], this.color[2]);

        var vertexBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }
}

var InitDemo = function()
{
    console.log('Loaded');
    var canvas = document.getElementById('surface');
    var gl = canvas.getContext('webgl');

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    {
        console.error('ERROR: Vertex shader failed to compile', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    {
        console.error('ERROR: Fragment shader failed to compile', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    // Program
    var program = gl.createProgram();
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
