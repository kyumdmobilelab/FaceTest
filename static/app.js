
var localVideo;
var localCanvas;

initialize = function() {
    localVideo = document.getElementById("localVideo");
    localCanvas = document.getElementById("localCanvas");
    try {
        navigator.getUserMedia({video:true}, onGotStream, onFailedStream);
    } catch (e) {
        alert("getUserMedia error " + e);
    }
}

var FaceCompX = 0;
var FaceCompY = 0;
var FaceCompWidth = 0;
var FaceCompHeight = 0;

poll = function() {
    var w = localVideo.videoWidth;
    var h = localVideo.videoHeight;
    var canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(localVideo, 0, 0, w, h);
    var comp = ccv.detect_objects({ "canvas" : ccv.grayscale(canvas),
                                    "cascade" : cascade,
                                    "interval" : 5,
                                    "min_neighbors" : 1 });
    /* draw detected area */
    localCanvas.width = localVideo.clientWidth;
    localCanvas.height = localVideo.clientHeight;
    var ctx2 = localCanvas.getContext('2d');
    ctx2.lineWidth = 2;
    ctx2.lineJoin = "round";
    ctx2.clearRect (0, 0, localCanvas.width,localCanvas.height);
    var x_offset = 0, y_offset = 0, x_scale = 1, y_scale = 1;
    if (localVideo.clientWidth * localVideo.videoHeight > localVideo.videoWidth * localVideo.clientHeight) {
        x_offset = (localVideo.clientWidth - localVideo.clientHeight *
                    localVideo.videoWidth / localVideo.videoHeight) / 2;
    } else {
        y_offset = (localVideo.clientHeight - localVideo.clientWidth *
                    localVideo.videoHeight / localVideo.videoWidth) / 2;
    }
    x_scale = (localVideo.clientWidth - x_offset * 2) / localVideo.videoWidth;
    y_scale = (localVideo.clientHeight - y_offset * 2) / localVideo.videoHeight;
    for (var i = 0; i < comp.length; i++) {
        FaceCompX = comp[i].x;
        FaceCompY = comp[i].y;
        FaceCompWidth = comp[i].width;
        FaceCompHeight = comp[i].height;

        comp[i].x = comp[i].x * x_scale + x_offset;
        comp[i].y = comp[i].y * y_scale + y_offset;
        comp[i].width = comp[i].width * x_scale;
        comp[i].height = comp[i].height * y_scale;
        var opacity = 0.1;
        if (comp[i].confidence > 0) {
            opacity += comp[i].confidence / 10;
            if (opacity > 1.0) opacity = 1.0;
        }
        //ctx2.strokeStyle = "rgba(255,0,0," + opacity * 255 + ")";
        ctx2.lineWidth = opacity * 10;
        ctx2.strokeStyle = "rgb(255,0,0)";
        ctx2.strokeRect(comp[i].x, comp[i].y, comp[i].width, comp[i].height);
    }
    setTimeout(poll, 1000);
}

onGotStream = function(stream) {
    localVideo.style.opacity = 1;
    localVideo.srcObject = stream;
    localStream = stream;
    setTimeout(poll, 2000);
}
onFailedStream = function(error) {
    alert("Failed to get access to local media. Error code was " + error.code + ".");
}

setTimeout(initialize, 1);


//------------------------------------------


function takeSnapshotBtuuon_click() {
    document.getElementById('panelDiv').style.display = 'none';
    document.getElementById('progressDiv').style.display = 'block';
    document.getElementById('otherDiv').style.display = 'block';
    document.getElementById('otherMsgTitle').style.display = 'none';

    let myvideo = document.getElementById('localVideo');

    let tempCanvas = document.createElement('canvas');
    let context = tempCanvas.getContext('2d');

    let x = FaceCompX - (FaceCompWidth/4);
    let y = FaceCompY - (FaceCompHeight/4)
    let width = FaceCompWidth + (FaceCompWidth/4)*2;
    let height = FaceCompHeight + (FaceCompHeight/5)*3;

    tempCanvas.width = width;
    tempCanvas.height = height;

    context.drawImage(myvideo, x, y, width, height, 0, 0, width, height);
    let imageData = context.canvas.toDataURL("image/png");
    document.getElementById('faceImage').src = imageData;

    context.canvas.toBlob(function(blob) {
        setTimeout(function(){
            processImage(blob);
        }, 1000);
    });
}


function againDetectBtuuon_click() {
    document.getElementById('panelDiv').style.display = 'block';
    document.getElementById('progressDiv').style.display = 'none';
    document.getElementById('otherDiv').style.display = 'none';
    document.getElementById('resultDiv').style.display = 'none';
}


function showResultValues() {
    let info = resultJSON["faceAttributes"];
    document.getElementById('smileValue').innerText = "微笑指數: " + info["smile"];

    let gender = info["gender"];
    if (gender === "male") {
        document.getElementById('genderValue').innerHTML = "&nbsp;男性&nbsp;";
    } else if (gender === "female") {
        document.getElementById('genderValue').innerHTML = "&nbsp;女性&nbsp;";
    }

    document.getElementById('ageValue').innerHTML = "&nbsp;" + info["age"] + "歲&nbsp;";

    let glasses = info['glasses'];
    if (glasses === "NoGlasses") {
        document.getElementById('glassesValue').innerText = "有無眼鏡: 無";
    } else if (glasses === "ReadingGlasses") {
        document.getElementById('glassesValue').innerText = "有無眼鏡: 有，一般眼鏡";
    } else if (glasses === "Sunglasses") {
        document.getElementById('glassesValue').innerText = "有無眼鏡: 有，墨鏡";
    } else if (glasses === "SwimmingGoggles") {
        document.getElementById('glassesValue').innerText = "有無眼鏡: 有，泳鏡";
    }

    let emotionInfo = info['emotion'];
    document.getElementById('angerValue').innerText = "憤怒指數: " + emotionInfo["anger"];
    document.getElementById('contemptValue').innerText = "鄙視指數: " + emotionInfo["contempt"];
    document.getElementById('disgustValue').innerText = "嫌惡指數: " + emotionInfo["disgust"];
    document.getElementById('fearValue').innerText = "恐懼指數: " + emotionInfo["fear"];
    document.getElementById('happinessValue').innerText = "幸福指數: " + emotionInfo["happiness"];
    document.getElementById('neutralValue').innerText = "中立指數: " + emotionInfo["neutral"];
    document.getElementById('sadnessValue').innerText = "悲傷指數: " + emotionInfo["sadness"];
    document.getElementById('surpriseValue').innerText = "驚訝指數: " + emotionInfo["surprise"];
}

//------------------------------------------
//--------------- Face API -----------------
//------------------------------------------

var resultJSON = null; 

function processImage(imageBlob) {
    // **********************************************
    // *** Update or verify the following values. ***
    // **********************************************

    // Replace the subscriptionKey string value with your valid subscription key.
    var subscriptionKey = "c1564ca0154f4dc8a2de2e103c6707f1";

    // Replace or verify the region.
    //
    // You must use the same region in your REST API call as you used to obtain your subscription keys.
    // For example, if you obtained your subscription keys from the westus region, replace
    // "westcentralus" in the URI below with "westus".
    //
    // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
    // a free trial subscription key, you should not need to change this region.
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
    };

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        processData: false,
        // Request body.
        data: imageBlob
    })
    .done(function(data) {
        // Show formatted JSON on webpage.
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        console.log("Detect done.");

        resultJSON = data[0];
        showResultValues();

        document.getElementById('progressDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'block';
        document.getElementById('otherMsgTitle').style.display = 'block';
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        let errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        console.log(errorString);
    });
}

//------------------------------------------

