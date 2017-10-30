
var localVideo = document.getElementById("localVideo");
var localCanvas = document.getElementById("localCanvas");

/*
initialize = function() {
    localVideo = document.getElementById("localVideo");
    localCanvas = document.getElementById("localCanvas");
    try {
        navigator.getUserMedia({video:true}, onGotStream, onFailedStream);
    } catch (e) {
        alert("getUserMedia error " + e);
    }
}*/

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
    //setTimeout(poll, 1000);
}

/*
onGotStream = function(stream) {
    localVideo.style.opacity = 1;
    localVideo.srcObject = stream;
    localStream = stream;
    setTimeout(poll, 1500);
}*/
/*
onFailedStream = function(error) {
    alert("Failed to get access to local media. Error code was " + error.code + ".");
}*/

//setTimeout(initialize, 1);


var videoSelect = document.querySelector('select#videoSource');
var selectors = [videoSelect];

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    var values = selectors.map(function(select) {
        return select.value;
    });
    selectors.forEach(function(select) {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    });
    for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];
        var option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        
        if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
            videoSelect.appendChild(option);
        }
    }
    
    selectors.forEach(function(select, selectorIndex) {
        if (Array.prototype.slice.call(select.childNodes).some(function(n) {
            return n.value === values[selectorIndex];
        })) {
            select.value = values[selectorIndex];
        }
    });
}

function handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

var pollTimerId = null;

function gotStream(stream) {
    //var videoElement = document.getElementById('localVideo');
    window.stream = stream; // make stream available to console
    //videoElement.srcObject = stream;

    localVideo.style.opacity = 1;
    localVideo.srcObject = stream;
    localStream = stream;
    //setTimeout(poll, 1500);

    if (pollTimerId) {
        clearInterval(pollTimerId);
    }
    pollTimerId = setInterval(poll, 1000);

    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
}

function start() {
    if (window.stream) {
        window.stream.getTracks().forEach(function(track) {
            track.stop();
        });
    }
    var videoSource = videoSelect.value;
    var constraints = {
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };

    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);

    //navigator.getUserMedia(constraints, onGotStream, onFailedStream);
}

videoSelect.onchange = start;

start();

//------------------------------------------

function switchChange(e) {
    console.log(e.checked);
    if (e.checked) {

    } else {
        
    }
}

function takeSnapshotBtuuon_click() {
    document.getElementById('panelDiv').style.display = 'none';
    document.getElementById('progressDiv').style.display = 'block';
    document.getElementById('otherDiv').style.display = 'block';
    document.getElementById('otherMsgTitle').style.display = 'none';
    document.getElementById('chooseCameraDiv').style.display = 'none';

    const myFirstPromise = new Promise((resolve, reject) => {
        // 執行一些非同步作業，最終呼叫:
        //
        //   resolve(someValue); // 實現
        // 或
        //   reject("failure reason"); // 拒絕

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

        resolve(context);
    });

    myFirstPromise.then(clipImageDone, null);
}

function clipImageDone(context) {
    context.canvas.toBlob(function(blob) {
        setTimeout(function(){
            processImage(blob);
        }, 500);
    });
}



function againDetectBtuuon_click() {
    document.getElementById('panelDiv').style.display = 'block';
    document.getElementById('progressDiv').style.display = 'none';
    document.getElementById('otherDiv').style.display = 'none';
    document.getElementById('resultDiv').style.display = 'none';
    document.getElementById('frameDiv').style.borderWidth = '0px';
    document.getElementById('againDetectBtuuon').style.display = 'none';
    document.getElementById('chooseCameraDiv').style.display = 'block';
}


function showResultValues() {
    if (!resultJSON) {
        document.getElementById('otherMsgTitle').innerText = "[ 分析失敗!! ]";
        document.getElementById('otherMsgTitle').style.display = 'block';
        document.getElementById('progressDiv').style.display = 'none';
        document.getElementById('againDetectBtuuon').style.display = 'block';
        return;
    }

    let info = resultJSON["faceAttributes"];

    if (info) {
        document.getElementById('otherMsgTitle').innerText = "[ 分析結果 ]";
    } else {
        document.getElementById('otherMsgTitle').innerText = "[ 分析失敗!! ]";
        document.getElementById('otherMsgTitle').style.display = 'block';
        document.getElementById('progressDiv').style.display = 'none';
        document.getElementById('againDetectBtuuon').style.display = 'block';
        return;
    }


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

    //--------
    let aData = {
        "gender" : info["gender"],
        "age" : info["age"],
        "smile" : info["smile"],
        "glasses" : info['glasses'],
        "anger" : emotionInfo["anger"],
        "contempt" : emotionInfo["contempt"],
        "disgust" : emotionInfo["disgust"],
        "fear" : emotionInfo["fear"],
        "happiness" : emotionInfo["happiness"],
        "neutral" : emotionInfo["neutral"],
        "sadness" : emotionInfo["sadness"],
        "surprise" : emotionInfo["surprise"]
    };

    analysisData(aData);

    document.getElementById('progressDiv').style.display = 'none';
    document.getElementById('resultDiv').style.display = 'block';
    document.getElementById('otherMsgTitle').style.display = 'block';
    document.getElementById('frameDiv').style.borderWidth = '1px';
    document.getElementById('againDetectBtuuon').style.display = 'block';

    gotSeafoodSuggest();
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
        console.log(JSON.stringify(data, null, 2));

        resultJSON = data[0];
        showResultValues();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        let errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        console.log(errorString);

        document.getElementById('otherMsgTitle').innerText = "[ 分析失敗!! ]";
        document.getElementById('otherMsgTitle').style.display = 'block';
        document.getElementById('progressDiv').style.display = 'none';
        document.getElementById('againDetectBtuuon').style.display = 'block';
    });
}

//------------------------------------------


//----------------------------------------------------
//---------------------- Data ------------------------
// aData = {
//     "gender"    : 性別
//     "age"       : 年齡
//     "smile"     : 微笑
//     "glasses"   : 眼鏡
//     "anger"     : 憤怒
//     "contempt"  : 鄙視
//     "disgust"   : 嫌惡
//     "fear"      : 恐懼
//     "happiness" : 幸福
//     "neutral"   : 中立
//     "sadness"   : 悲傷
//     "surprise"  : 驚訝
// }

function analysisData(data) {
    if (data["gender"] === "male") {
        analysisMale(data);
    } else if (data["gender"] === "female") {
        analysisFemale(data);
    }
}

function analysisMale(data) {
    if (data["age"] > 40) {
        // 憂鬱大叔、凶神惡煞、大俠、黑社會大哥、大老闆、學者、陽光大叔
        // 雜魚大叔、無名路人、了無生趣
        if (data["sadness"] > 0.3) {
            document.getElementById('analysisTitle').innerHTML = "&nbsp;憂鬱大叔&nbsp;";
        } else if (data["anger"] > 0.3) {
            document.getElementById('analysisTitle').innerHTML = "&nbsp;凶神惡煞&nbsp;";
        } else if (data["glasses"] === "Sunglasses") {
            if (data["smile"] > 0.15) {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;大俠&nbsp;";
            } else {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;黑社會大哥&nbsp;";
            }
        } else if (data["glasses"] === "ReadingGlasses") {
            if (data["neutral"] < 0.7) {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;大老闆&nbsp;";
            } else {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;學者&nbsp;";
            }
        } else if (data["smile"] > 0.2) {
            document.getElementById('analysisTitle').innerHTML = "&nbsp;陽光大叔&nbsp;";
        } else {
            let maxNum = 2;  
            let minNum = 0;  
            let n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
            let array = ["雜魚大叔", "無名路人", "了無生趣"];
            document.getElementById('analysisTitle').innerHTML = "&nbsp;" + array[n] + "&nbsp;";
        }
    } else {
        // 憂鬱小生、小流氓、帥氣青年、耍酷男孩、年輕有為、文青、陽光大男孩
        // 雜魚小弟、無名路人、了無生趣
        if (data["sadness"] > 0.3) {
            document.getElementById('analysisTitle').innerHTML = "&nbsp;憂鬱小生&nbsp;";
        } else if (data["anger"] > 0.3) {
            document.getElementById('analysisTitle').innerHTML = "&nbsp;小流氓&nbsp;";
        } else if (data["glasses"] === "Sunglasses") {
            if (data["smile"] > 0.15){
                document.getElementById('analysisTitle').innerHTML = "&nbsp;帥氣青年&nbsp;";
            } else {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;耍酷男孩&nbsp;";
            }
        } else if (data["glasses"] === "ReadingGlasses") {
            if (data["neutral"] < 0.7) {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;年輕有為&nbsp;";
            } else {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;文青&nbsp;";
            }
        } else if (data["smile"] > 0.2) {
            document.getElementById('analysisTitle').innerHTML = "&nbsp;陽光大男孩&nbsp;";
        } else {
            let maxNum = 2;  
            let minNum = 0;  
            let n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
            let array = ["雜魚小弟", "無名路人", "了無生趣"];
            document.getElementById('analysisTitle').innerHTML = "&nbsp;" + array[n] + "&nbsp;";
        }
    }
}

function analysisFemale(data) {
    if (data["age"] > 40) {
        // 憂鬱阿姨、憤怒阿姨、女俠、新潮美魔女、女強人、氣質美女、陽光大嬸
        // 雜魚大姊、無名路人、了無生趣
        if (data["sadness"] > 0.3) {
            document.getElementById('analysisTitle').innerHTML = "&nbsp;憂鬱阿姨&nbsp;";
        } else if (data["anger"] > 0.4) {
            document.getElementById('analysisTitle').innerHTML = "&nbsp;憤怒阿姨&nbsp;";
        } else if (data["glasses"] === "Sunglasses") {
            if (data["smile"] > 0.15){
                document.getElementById('analysisTitle').innerHTML = "&nbsp;女俠&nbsp;";
            } else {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;新潮美魔女&nbsp;";
            }
        } else if (data["glasses"] === "ReadingGlasses") {
            if (data["neutral"] < 0.7) {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;女強人&nbsp;";
            } else {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;氣質美女&nbsp;";
            }
        } else if (data["smile"] > 0.2) {
            document.getElementById('analysisTitle').innerHTML = "&nbsp;陽光大嬸&nbsp;";
        } else {
            let maxNum = 2;  
            let minNum = 0;  
            let n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
            let array = ["雜魚大姊", "無名路人", "了無生趣"];
            document.getElementById('analysisTitle').innerHTML = "&nbsp;" + array[n] + "&nbsp;";
        }
    } else {
        // 多愁少女、恰北北、時尚美女、前衛少女、文藝少女、氣質少女、妙齡美女
        // 雜魚妹妹、無名路人、了無生趣
        if (data["sadness"] > 0.3) {
            document.getElementById('analysisTitle').innerHTML = "&nbsp;多愁少女&nbsp;";
        } else if (data["anger"] > 0.3) {
            document.getElementById('analysisTitle').innerHTML = "&nbsp;恰北北&nbsp;";
        } else if (data["glasses"] === "Sunglasses") {
            if (data["smile"] > 0.15){
                document.getElementById('analysisTitle').innerHTML = "&nbsp;時尚美女&nbsp;";
            } else {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;前衛少女&nbsp;";
            }
        } else if (data["glasses"] === "ReadingGlasses") {
            if (data["neutral"] < 0.7) {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;文藝少女&nbsp;";
            } else {
                document.getElementById('analysisTitle').innerHTML = "&nbsp;氣質少女&nbsp;";
            }
        } else if (data["smile"] > 0.2) {
            document.getElementById('analysisTitle').innerHTML = "&nbsp;妙齡美女&nbsp;";
        } else {
            let maxNum = 2;  
            let minNum = 0;  
            let n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
            let array = ["雜魚妹妹", "無名路人", "了無生趣"];
            document.getElementById('analysisTitle').innerHTML = "&nbsp;" + array[n] + "&nbsp;";
        }
    }
}


function gotSeafoodSuggest() {
    let str = document.getElementById('analysisTitle').innerHTML.replace(/&nbsp;/g, '');

    // 路人
    if (str === "雜魚妹妹" ||
        str === "雜魚大姊" ||
        str === "雜魚小弟" ||
        str === "雜魚大叔" ||
        str === "無名路人" ||
        str === "了無生趣")
    {
        let array = [
            "忙忙碌碌苦中求，<br/>何日雲開見日頭；<br/>難得祖基家可立，<br/>中年衣食漸無憂。",
            "此命福氣果如何，<br/>僧道門中衣祿多；<br/>離祖出家方為妙，<br/>朝晚拜佛念彌陀。",
            "勞勞碌碌苦中求，<br/>東奔西走何日休；<br/>若能終身勤與儉，<br/>老來稍可免憂愁。"
        ];

        let maxNum = 2;  
        let minNum = 0;
        let n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

        document.getElementById('SuggestText').innerHTML = array[n];
    }

    // 憂鬱
    if (str === "憂鬱大叔" ||
        str === "憂鬱小生" ||
        str === "憂鬱阿姨" ||
        str === "多愁少女")
    {
        let array = [
            "萬事由天莫苦求，<br/>須知福祿賴人修；<br/>中年財帛難如意，<br/>晚景欣然便不憂。",
            "平生衣祿苦中求，<br/>獨自營謀事不休；<br/>離祖出門宜早計，<br/>晚來衣食自無憂。",
            "得寬懷處且寬懷，<br/>何用雙眉皺不開；<br/>若使中年命運濟，<br/>那時名利一齊來。"
        ];

        let maxNum = 2;  
        let minNum = 0;
        let n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

        document.getElementById('SuggestText').innerHTML = array[n];
    }

    // 憤怒
    if (str === "凶神惡煞" ||
        str === "小流氓" ||
        str === "憤怒阿姨" ||
        str === "恰北北")
    {
        let array = [
            "一生作事少商量，<br/>難靠祖宗作主張；<br/>獨馬單槍空做去，<br/>早年晚歲總無長。",
            "為利為名終日勞，<br/>中年福祿也多遭；<br/>老年自有財星照，<br/>不比前番目下高。",
            "走馬揚鞭爭利名，<br/>少年做事費評論；<br/>一朝福祿源源至，<br/>富貴榮華顯六親。"
        ];

        let maxNum = 2;  
        let minNum = 0;
        let n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

        document.getElementById('SuggestText').innerHTML = array[n];
    }

    // 墨鏡
    if (str === "大俠" ||
        str === "黑社會大哥" ||
        str === "帥氣青年" ||
        str === "耍酷男孩" ||
        str === "女俠" ||
        str === "新潮美魔女" ||
        str === "時尚美女" ||
        str === "前衛少女")
    {
        let array = [
            "一世榮華事事通，<br/>不須勞苦自亨通；<br/>弟兄叔侄皆如意，<br/>家業成時福祿宏。",
            "平生福祿自然來，<br/>名利兼全福壽偕；<br/>雁塔題名為貴客，<br/>紫袍玉帶走金階。",
            "此命推來福不輕，<br/>自成自立顯門庭；<br/>從來富貴人親近，<br/>使婢差奴過一生。",
            "走馬揚鞭爭利名，<br/>少年做事費評論；<br/>一朝福祿源源至，<br/>富貴榮華顯六親。",
            "此命威權不可當，<br/>紫袍金帶坐高堂；<br/>榮華富貴誰能及，<br/>百世留名姓氏揚。"
        ];

        let maxNum = 4;  
        let minNum = 0;
        let n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

        document.getElementById('SuggestText').innerHTML = array[n];
    }

    // 大老闆
    if (str === "大老闆" ||
        str === "學者" ||
        str === "年輕有為" ||
        str === "文青" ||
        str === "女強人" ||
        str === "氣質美女")
    {
        let array = [
            "細推此命福不輕，<br/>富貴榮華孰與爭；<br/>定國安邦榮品人，<br/>威聲顯赫四方聞。",
            "命主為官福祿長，<br/>得來富貴定非常；<br/>名題雁塔傳金榜，<br/>顯耀門庭天下揚。",
            "細推此格秀且清，<br/>必定財高學業成；<br/>甲第之中應有分，<br/>揚鞭走馬顯威榮。",
            "此命推來厚且清，<br/>詩書滿腹功業成；<br/>豐衣足食自然穩，<br/>正是人間有福人。"
        ];

        let maxNum = 3;  
        let minNum = 0;
        let n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

        document.getElementById('SuggestText').innerHTML = array[n];
    }

    //陽光
    if (str === "文藝少女" ||
        str === "氣質少女" ||
        str === "陽光大叔" ||
        str === "陽光大男孩" ||
        str === "陽光大嬸" ||
        str === "妙齡美女")
    {
        let array = [
            "此命生來福不窮，<br/>讀書必定顯親族；<br/>紫衣金帶為卿相，<br/>富貴榮華皆可同。",
            "不作朝中金榜客，<br/>官為世上一財翁；<br/>聰明天賦經書熟，<br/>名顯高科自是榮。",
            "此命推來是不同，<br/>為人能幹異凡庸；<br/>中年還有逍遙福，<br/>不比前年運未通。",
            "君是人間衣祿星，<br/>一生富貴眾人欽；<br/>縱然福祿由天定，<br/>安享榮華過一生。"
        ];

        let maxNum = 3;  
        let minNum = 0;
        let n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

        document.getElementById('SuggestText').innerHTML = array[n];
    }
}

