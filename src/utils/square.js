export const drawSquare = (x, y, length, gl, shaderProgram) => {
  // xCenter, yCenter -> float, length -> integer

  // square coordinates
  const squareData = [
    x, y,
    x, y + length,
    x + length, y + length,
    x, y,
    x + length, y + length,
    x + length, y
  ];

  const s_vertBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, s_vertBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareData), gl.STATIC_DRAW);

  const s_vertexPos = gl.getAttribLocation(shaderProgram, 'a_position');
  gl.vertexAttribPointer(s_vertexPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(s_vertexPos);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

