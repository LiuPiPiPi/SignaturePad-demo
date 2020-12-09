<template>
<div class="signature-pad-body">
  <div class="signature-pad">
    <div class="description">签名区域</div>
    <div class="signature-pad--body">
      <canvas id="signature-canvas"></canvas>
    </div>
    <div class="signature-pad--footer">
      <button type="button" class="buttonclear clear" id="undo">撤回</button>
      <button type="button" class="buttonclear clear" id="clear" data-action="clear">重签</button>
      <button type="button" class="buttonclear clear" id="save" data-action="clear">确定</button>
      <button type="button" class="button save" data-action="save-png">图片另存为 PNG</button>
      <button type="button" class="button save" data-action="save-jpg">图片另存为 JPG</button>
      <button type="button" class="button save" data-action="save-svg">图片另存为 SVG</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'SignaturePad',
  props: {
  },
  data () {
    return {
      imgStr: ''
    }
  },
  mounted () {
    var canvas = document.getElementById('signature-canvas')
    var signaturePad = new SignaturePad(canvas, { backgroundColor: '#DEDEDE', penColor: 'rgb(0, 0, 0)' })
    this.init(canvas, signaturePad)
  },
  methods: {
    /**
     * 初始化函数
     */
    init (canvas, signaturePad) {
      this.saveImg(signaturePad)
      this.basicFunc(signaturePad)
      window.onresize = this.resizeCanvas;
      this.resizeCanvas(canvas, signaturePad);
    },
    /**
     * 重定义 canvas 大小
     */
    resizeCanvas (canvas, signaturePad) {
      var ratio = Math.max(window.devicePixelRatio || 1, 1); // 清除画布
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      signaturePad.clear();
    },
    /**
     * 重签、撤销和提交
     */
    basicFunc (signaturePad) {
      var saveButton = document.getElementById('save')
      var cancelButton = document.getElementById('clear')
      var undoButton = document.getElementById('undo')
      saveButton.addEventListener('click', function (event) {
        // 签名为空的判断
        if(signaturePad.isEmpty()){
          alert("不能为空")
        }
        // signaturePad.jSignature('getData');
        var imgStr = signaturePad.toDataURL('image/png');
        //获取到 image 的 base64 可以把这个传到后台解析成图片
        //imgStr = data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAfgAAAL2CAYAAA......
        //去掉 data:image/png;base64, 我们只要后面的部分 iVBORw0KGgoAAAANSUhEUgAAAfgAAAL2CAYAAA......
        this.imgStr = imgStr.substring(22,imgStr.length);
      })
      cancelButton.addEventListener('click', function (event) {
        signaturePad.clear();
      })
      undoButton.addEventListener("click", function (event) {
        // 签名为空的判断
        if(signaturePad.isEmpty()){
          alert("已经是第一步")
        }
        var data = signaturePad.toData();
        if (data) {
          data.pop(); // remove the last dot or line
          signaturePad.fromData(data);
        }
      })
    },
    /**
     * 图片另存为
     */
    saveImg (signaturePad) {
      // 下载图片
      function download (dataURL, filename) {
        if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
          window.open(dataURL);
        } else {
          var blob = dataURLToBlob(dataURL);
          var url = window.URL.createObjectURL(blob);

          var a = document.createElement("a");
          a.style = "display: none";
          a.href = url;
          a.download = filename;

          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }
      // 解码 CanvastoBlob
      function dataURLToBlob (dataURL) {
        // Code taken from https://github.com/ebidel/filer.js
        var parts = dataURL.split(';base64,');
        var contentType = parts[0].split(":")[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
      }
      var savePNGButton = document.querySelector("[data-action=save-png]");
      var saveJPGButton = document.querySelector("[data-action=save-jpg]");
      var saveSVGButton = document.querySelector("[data-action=save-svg]");
      savePNGButton.addEventListener("click", function (event) {
        if (signaturePad.isEmpty()) {
          alert("请先书写签名！");
        } else {
          var dataURL = signaturePad.toDataURL();
          download(dataURL, "signature.png");
        }
      });
      saveJPGButton.addEventListener("click", function (event) {
        if (signaturePad.isEmpty()) {
          alert("请先书写签名！");
        } else {
          var dataURL = signaturePad.toDataURL("image/jpeg");
          download(dataURL, "signature.jpg");
        }
      });
      saveSVGButton.addEventListener("click", function (event) {
        if (signaturePad.isEmpty()) {
          alert("请先书写签名！");
        } else {
          var dataURL = signaturePad.toDataURL('image/svg+xml');
          download(dataURL, "signature.svg");
        }
      });
    },
  }
}
</script>

<style scoped>
.signature-pad-body {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin: 0;
  padding: 32px 16px;
  font-family: Helvetica, Sans-Serif;
}

.description {
  font-size: 2em;
  margin-bottom: 10px;
}

.signature-pad {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  font-size: 10px;
  width: 100%;
  height: 100%;
  max-width: 700px;
  max-height: 460px;
  border: 1px solid #e8e8e8;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
  border-radius: 4px;
  padding: 16px;
}

.signature-pad::before,
.signature-pad::after {
  position: absolute;
  z-index: -1;
  content: "";
  width: 40%;
  height: 10px;
  bottom: 10px;
  background: transparent;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
}

.signature-pad::before {
  left: 20px;
  -webkit-transform: skew(-3deg) rotate(-3deg);
  transform: skew(-3deg) rotate(-3deg);
}

.signature-pad::after {
  right: 20px;
  -webkit-transform: skew(3deg) rotate(3deg);
  transform: skew(3deg) rotate(3deg);
}

.signature-pad--body {
  position: relative;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  border: 1px solid #f4f4f4;
}

.signature-pad--body canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.02) inset;
}

.signature-pad--footer {
  color: #C3C3C3;
  text-align: center;
  font-size: 1.2em;
  margin-top: 20px;
}

.signature-pad--actions {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-top: 8px;
}

</style>
