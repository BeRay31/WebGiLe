// const { glMatrix } = require("./gl-matrix");

var vertexShaderText = 
[
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    '',
    'void main()',
    '{',
    '   fragColor = vertColor;',
    // '   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
    '   gl_Position = vec4(vertPosition, 1.0);',
    '}'
].join('\n');

var fragmentShaderText = 
[
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    '   gl_FragColor = vec4(fragColor, 1.0);',
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

var InitDemo = function()
{
    console.log('Loaded');
    var canvas = document.getElementById('webGL');
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

    var instances = [];
    // Buffers
    var x = 0;
    function addTriangle()
    {
        var triangleVertices = 
        [// X       Y       Z       R   G   B
            0.0,    0.5+x,    0.0,    1,  0,  0,
            -0.4,   -0.5+x,   0.0,    0,  1,  0,
            0.4,    -0.5+x,   0.0,    0,  0,  1
        ];

        x += 0.2;
        instances.push(triangleVertices);
        console.log('HEHE');
    }
    
    addTriangle();

    var triangleVertices = instances[0];
    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    console.log('HUHI');


    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
    )

    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    )

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);
    
    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);

    // glMatrix.mat4.identity(worldMatrix);
    // glMatrix.mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
    // glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    // Render loop

    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    window.addEventListener('click', function() 
    { 
        console.log("CLICK");
        addTriangle(); 
    });

    var angle = 0;
    var identityM = new Float32Array(16);
    glMatrix.mat4.identity(identityM);

    var loop = function() {
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        angle = performance.now() / 1000 / 6 * 2 * Math.PI;

        glMatrix.mat4.rotate(worldMatrix, identityM, angle, [0, 1, 0]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        for (var i = 0; i < instances.length; i++)
        {
            var triangleVertices = instances[i];
            gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

            gl.drawArrays(gl.TRIANGLES, 0, 3);
            console.log('HAHA');
        }
        
        

        
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

// var canvas = document.querySelector('canvas');

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// var c = canvas.getContext('webgl');
