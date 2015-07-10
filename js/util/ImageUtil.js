/**
 * Created by jackyanjiaqi on 15-6-18.
 */
function getColoredImg(srcImg,red,green,blue){
    var canvas = document.createElement('canvas');
    canvas.width = srcImg.width;
    canvas.height = srcImg.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(srcImg,0,0);
    var imgData = ctx.getImageData(0,0,srcImg.width,srcImg.height);
    for(var i=0;i<imgData.data.length;i+=4){
        imgData.data[i] = red;
        imgData.data[i+1] = green;
        imgData.data[i+2] = blue;
    }
    ctx.putImageData(imgData,0,0);
    return canvas;
}

function asGradientMapAlpha(srcImg,fromColor,toColor,isAlphaKeeped){
    var canvas = document.createElement('canvas');
    canvas.width = srcImg.width;
    canvas.height = srcImg.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(srcImg,0,0);
    var imgData = ctx.getImageData(0,0,srcImg.width,srcImg.height);
    for(var i=0;i<imgData.data.length;i+=4){
        var a = imgData.data[i+3];
        imgData.data[i] = (fromColor[0]*(255-a)+toColor[0]*a)/255;
        imgData.data[i+1] = (fromColor[1]*(255-a)+toColor[1]*a)/255;
        imgData.data[i+2] = (fromColor[2]*(255-a)+toColor[2]*a)/255;
        if(!isAlphaKeeped){
            imgData.data[i+3] = 255;
        }
    }
    ctx.putImageData(imgData,0,0);
    return canvas;
}