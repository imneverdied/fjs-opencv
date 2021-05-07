var srcImgEl = document.getElementById('srcimage');
//取得跨域圖片/get Cross-Origin Resource Sharing (CORS) picture
srcImgEl.crossOrigin = 'anonymous';
Oimage.crossOrigin = 'anonymous';
BWimage.crossOrigin = 'anonymous';
ADDimage.crossOrigin = 'anonymous';
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
(function() {
  var fileUploadEl = document.getElementById('file-upload');

  fileUploadEl.addEventListener(
    'change',
    function(e) {
      srcImgEl.src = URL.createObjectURL(e.target.files[0]);
    },
    false
  );

  srcImgEl.onload = function() {
    var src = cv.imread(srcImgEl); // load the image from <img>
    var dst = new cv.Mat();
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
    cv.Canny(src, dst, 50, 100, 3, false); // You can try more different parameters
    cv.imshow('canvas', dst); // display the output to canvas
    src.delete(); // remember to free the memory
    dst.delete();
    Oimage.src = canvas.toDataURL(); //Canny邊緣偵測
    BW(); //Canny黑白反轉
    ADD(); //邊緣疊加
  };
})();
// opencv  載入成功判斷
function onOpenCvReady() {
  document.getElementById('loading').remove();
}
function srcC() {
  //讀取intput src 更新/input src update
  let PICsrc = document.getElementById('imgsrc').value;
  alert(PICsrc);
  srcimage.src = PICsrc;
}

function BW() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (parseInt(avg) == 255) {
      avg = 0;
    } else {
      avg = 255;
    }
    data[i] = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  ctx.putImageData(imageData, 0, 0);
  BWimage.src = canvas.toDataURL();
}

function Canny() {
  let src = cv.imread(imgsrc); // load the image from <img>
  let dst = new cv.Mat();

  cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);

  cv.Canny(src, dst, 50, 100, 3, false); // You can try more different parameters

  cv.imshow('canvas', dst); // display the output to canvas

  src.delete(); // remember to free the memory
  dst.delete();

  Oimage.src = canvas.toDataURL();
  BW();
}

function ADD() {
  let src = cv.imread(srcImgEl); // load the image from <img>
  cv.imshow('canvasORG', src); // display the output to canvas
  src.delete(); // remember to free the memory

  var canvasORG = document.getElementById('canvasORG');
  var ctxORG = canvasORG.getContext('2d');
  const imageDataORG = ctxORG.getImageData(
    0,
    0,
    canvasORG.width,
    canvasORG.height
  );
  const dataORG = imageDataORG.data;
  dataORG.src = srcimage.src;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (var i = 0; i < data.length; i += 4) {
    var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    //在原圖蓋上Canny圖
    if (parseInt(avg) == 0) {
      data[i] = 0; // red
      data[i + 1] = 255; // green
      data[i + 2] = 0; // blue
    } else {
      data[i] = dataORG[i]; // red
      data[i + 1] = dataORG[i + 1]; // green
      data[i + 2] = dataORG[i + 2]; // blue
      //data[i + 3] = 0; // alpha
    }
  }
  ctx.putImageData(imageData, 0, 0);
  ADDimage.src = canvas.toDataURL();
}
