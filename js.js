var _scannerIsRunning = false;

function startScanner() {
    Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                // Or '#yourElement' (optional)
                target: document.querySelector('#scanner-container'),
                constraints: {
                    width: 700,
                    height: 200,
                    facingMode: "environment"
                },
                area: { // defines rectangle of the detection/localization area
                    top: "0%", // top offset
                    right: "0%", // right offset
                    left: "0%", // left offset
                    bottom: "0%" // bottom offset
                },
                singleChannel: false // true: only the red color-channel is read

            },
            decoder: {
                readers: ["code_128_reader"]
            }
        },
        function (err) {
            if (err) {
                console.log(err);
                return
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
            _scannerIsRunning = true;
        });
    Quagga.onProcessed(function (result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;
        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(
                    drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {
                        x: 0,
                        y: 1
                    }, drawingCtx, {
                        color: "green",
                        lineWidth: 2
                    });
                });
            }
            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {
                    x: 0,
                    y: 1
                }, drawingCtx, {
                    color: "#00F",
                    lineWidth: 2
                });
            }
            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {
                    x: 'x',
                    y: 'y'
                }, drawingCtx, {
                    color: 'red',
                    lineWidth: 3
                });
            }
        }
    });
    Quagga.onDetected(function (result) {
        console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
        document.getElementById('imprime').innerHTML = result.codeResult.code;
    });
}
// Start/stop scanner
document.getElementById("btn").addEventListener("click", function () {
    if (_scannerIsRunning) {
        Quagga.stop();
    } else {
        startScanner();
    }
}, false);