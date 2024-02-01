# API Guide

# TODO

- createImageData

  ```js
  console.log(ctx.createImageData(100, 100));
  // ImageData { width: 100, height: 100, data: Uint8ClampedArray[40000] }
  ```

  `40000` 表示一个 100x100 的 ImageData 对象，每个像素点有 4 个字节。

  [draw noise](https://github.com/Lil-El/noise)
