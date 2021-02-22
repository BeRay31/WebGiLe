export const translate = (x, y) => {
  return [
    1, 0, 0,
    0, 1, 0,
    x, y, 0
  ]
}

export const rotate = (degree) => {
  const rad = degree * Math.PI / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  return [
    cos, -sin, 0,
    sin, cos, 0,
    0, 0, 1
  ]
}

export const scale = (kx, ky) => {
  return [
    kx, 0, 0,
    0, ky, 0,
    0, 0, 1
  ]
}

export const matrixMultiplication = (m1, m2) => {
  const res = [];
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
      res[i*3+j] = 0;
      for(let k = 0; k < 3; k++) {
        res[i*3+j] += m1[i*3 + k] * m2[k*3 +j];
      }
    }
  }
  return res;
}