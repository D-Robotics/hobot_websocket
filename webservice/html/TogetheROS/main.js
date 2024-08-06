// 'use strict';
let FPS = 30;
let timeout;
let frames = [];
let videos = [];
let AwesomeMessage = null;
let messageShowSelect = {};
let socketParameters = getURLParameter();
let pathNum = getVideoNum();
let pathNumArr  = [...new Array(pathNum).keys()];
let bgr_putpalette = [
  128, 64 , 128, 244, 35 , 232, 70 , 70 , 70 , 102, 102, 156, 190, 153, 153, 
  153, 153, 153, 250, 170, 30 , 220, 220, 0  , 107, 142, 35 , 152, 251, 152, 
  0  , 130, 180, 220, 20 , 60 , 255, 0  , 0  , 0  , 0  , 142, 0  , 0  , 70 , 
  0  , 60 , 100, 0  , 80 , 100, 0  , 0  , 230, 119, 11 , 32 , 216, 191, 69 , 
  50 , 33 , 199, 108, 59 , 247, 249, 96 , 97 , 97 , 234, 195, 239, 202, 156, 
  81 , 177, 90 , 180, 100, 245, 251, 146, 184, 245, 26 , 209, 56 , 20 , 144, 
  210, 56 , 241, 19 , 75 , 171, 144, 17 , 198, 216, 105, 125, 108, 212, 181, 
  75 , 189, 225, 137, 152, 226, 210, 107, 81 , 130, 189, 63 , 4  , 31 , 139, 
  106, 202, 255, 184, 64 , 56 , 200, 69 , 31 , 62 , 129, 13 , 19 , 235, 0  , 
  255, 129, 8  , 238, 24 , 80 , 176, 115, 54 , 232, 100, 164, 13 , 192, 234, 
  48 , 140, 176, 178, 145, 83 , 115, 225, 250, 18 , 6  , 98 , 34 , 156, 78 , 
  74 , 120, 22 , 185, 5  , 159, 111, 133, 243, 170, 252, 118, 23 , 29 , 143, 
  237, 6  , 163, 104, 231, 87 , 18 , 15 , 185, 45 , 152, 178, 147, 116, 56 , 
  28 , 197, 148, 134, 46 , 205, 243, 200, 47 , 5  , 233, 70 , 224, 88 , 0  , 
  237, 82 , 6  , 180, 104, 75 , 80 , 91 , 20 , 95 , 225, 61 , 91 , 37 , 187, 
  129, 183, 114, 246, 21 , 181, 26 , 90 , 201, 218, 8  , 81 , 97 , 14 , 208, 
  51 , 172, 247,
];

createVideo();
changeCheckboxShow();
changeCheckboxSelect();
protobufInit();
multipathInit();

function fullFloatMatrix(width, height) {
  let widths  = [...new Array(width).keys()];
  let heights  = [...new Array(height).keys()];
  let FullFloatMatrix = []
  widths.map(() => {
    heights.map(() => {
      FullFloatMatrix.push(255, 255, 255, 255)
    })
  })
  return FullFloatMatrix;
}

function getVideoNum() {
  let num = 1;
  let obj = {};
  const cookies = document.cookie.split('; ');
  cookies.map(item => {
    let arr = item.split('=');
    obj[arr[0]] = arr[1] * 1;
  })
  if (typeof obj.path_num !== 'undefined') {
    num = obj.path_num;
  }
  return num;
}

function createVideo() {
  let w = 100;
  let h = 100;
  let names = 'video';
  if (pathNum === 2) {
    w /= 2;
    names = 'video two';
  }
  if (pathNum === 3 || pathNum === 4) {
    w /= 2;
    h /= 2;
    names = 'video four';
  }
  if (pathNum === 5 || pathNum === 6) {
    w /= 3;
    h /= 2;
    names = 'video six';
  }
  if (pathNum === 7 || pathNum === 8) {
    w /= 3;
    h /= 3;
    names = 'video eight';
  }
  
  const videocontHtml = document.getElementById('wrapper-cnt');
  const performanceHtml = document.getElementById('performance-message');
  // <img class="logo1" src="../assets/images/usbcam-top.png" alt="">
  pathNumArr.map(i => {
    const port = 8080 + i * 2;
    const str = `
      <div class="${names}" id="video-wrap-${port}" style="width: ${w}%; height: ${h}%;">
        <div class="cont">
          <div class="cam" id="cam">
            <img class="logo2" src="../assets/images/logo.png" alt="">
            <img src="" class="layer" id="video-${port}" alt="">
            <canvas class="canvas" id="canvas-${port}-1"></canvas>
            <canvas class="canvas" id="canvas-${port}-2"></canvas>
            <ul class="canvas info-panel-1" id="info-panel-${port}-1">
            </ul>
            <ul class="canvas info-panel-2" id="info-panel-${port}-2">
            </ul>
          </div>
        </div>
      </div>
    `;
    const str2 = `<li id="performance-${port}"></li>`
    videocontHtml.innerHTML += str;
    performanceHtml.innerHTML += str2;
  })
}

function getURLParameter() {
  let socketIP = getUrlQueryParameter('ws');
  let port = getUrlQueryParameter('port');
  let netId = getUrlQueryParameter('netid');
  let cameraId = getUrlQueryParameter('camera');
  let id = getUrlQueryParameter('id');

  let doc_socketIP = getUrlQueryParameter('doc_ws');
  let doc_port = getUrlQueryParameter('doc_port');
  let cam_id = getUrlQueryParameter('cam_id');

  return {
    socketIP,
    port,
    netId,
    cameraId,
    id,
    doc_socketIP,
    doc_port,
    cam_id
  }
}

function changeCheckboxSelect() {
  const performanceHtml = document.getElementById('performance');
  const messageShows = Array.from(document.querySelectorAll('.message-show'));
  messageShows.forEach(item => {
    messageShowSelect[item.getAttribute('dataType')] = item.checked;
    item.onclick = () => {
      messageShowSelect[item.getAttribute('dataType')] = item.checked;
      performanceHtml.style.display = messageShowSelect.performance ? 'block' : 'none';
    }
  })
}

function changeCheckboxShow() {
  let messageChangeV = document.querySelector('.message-v');
  let messageChangeH = document.querySelector('.message-h');
  let messageDiv = document.getElementById('message');

  messageChangeH.onclick = function () {
    messageDiv.style.display = 'block';
    this.style.display = 'none';
    messageChangeV.style.display = 'block';
  }
  messageChangeV.onclick = function () {
    messageDiv.style.display = 'none';
    this.style.display = 'none';
    messageChangeH.style.display = 'block';
  }
}

function protobufInit() {
  protobuf.load('../../protos/x3.proto', function (err, root) {
    if (err) throw err;
    AwesomeMessage = root.lookupType('x3.FrameMessage');
  });
}

function multipathInit() {
  pathNumArr.map(i => {
    const port = 8080 + 2 * i;
    videos[i] = new RenderFrame(
      { canvasId: `canvas-${port}-1` },
      { canvasId: `canvas-${port}-2` },
      `info-panel-${port}-1`,
      `info-panel-${port}-2`,
      `video-${port}`,
      `performance-${port}`
    );
    wsInit(i, port);
  })
  pathNumArr = null;
}

function wsInit(i, port) {
  let { socketIP, cameraId, id, netId } = socketParameters;

  // 部署
  hostport = document.location.hostname;
  socketIP = hostport.replace(/_/g, '.');
  socket = new ReconnectingWebSocket(`ws://${socketIP}:${port}`, null, { binaryType: 'arraybuffer' });

  // 本地开发用
  // let ip = '10.64.35.196'
  // let socket = new ReconnectingWebSocket(`ws://${ip}:${port}`, null, { binaryType: 'arraybuffer' });

  socket.onopen = function (e) {
    if (e.type === 'open') {
      let data = { filter_prefix: netId + '/' + cameraId + '/' + id };
      socket.send(JSON.stringify(data));
      console.log('opened');
    }
  };

  socket.onclose = function (e) {
    if (socket) {
      console.log(`close:${socket.url} `, e);
      socket.close();
    }
  };

  socket.onerror = function (e) {
    if (socket) {
      console.log(`error:${socket.url} `, e);
    }
  };

  socket.onmessage = function (e) {
    // console.log(e)
    if (e.data) {
      frames[i] = transformData(e.data);
    }
    delete e;
  };
  clearTimeout(timeout);
  sendMessage();
}

function sendMessage() {
  videos.map((item, index) => {
    if (item && frames[index]) {
      item.render(frames[index]);
      frames[index] = null;
    }
  })
  timeout = setTimeout(() => {
    sendMessage();
  }, 1000 / FPS);
}

function transformData(buffer) {
  // console.time('渲染计时器')
  // console.time('解析计时器')
  let unit8Array = new Uint8Array(buffer);
  // console.log(222, unit8Array)
  let message = AwesomeMessage.decode(unit8Array);
  let object = AwesomeMessage.toObject(message);
  // console.log(333, object);

  let imageBlob;
  let imageWidth = 1920;
  let imageHeight = 1080;
  let performance = [];
  let smartMsgData = [];
  if (object) {
    // 性能数据
    if (object['StatisticsMsg_'] &&
        object['StatisticsMsg_']['attributes_'] &&
        object['StatisticsMsg_']['attributes_'].length
    ) {
      performance = object['StatisticsMsg_']['attributes_']
    }
    // 图片
    if (object['img_'] &&
        object['img_']['buf_'] &&
        object['img_']['buf_'].length
    ) {
      imageBlob = new Blob([object['img_']['buf_']], { type: 'image/jpeg' });
      imageWidth = object['img_']['width_'] || 1920
      imageHeight = object['img_']['height_'] || 1080
    }
    // 智能数据
    if (object['smartMsg_'] &&
        object['smartMsg_']['targets_'] &&
        object['smartMsg_']['targets_'].length
    ) {
      let FullFloatMatrix = null;
      if (messageShowSelect.floatMatrixsMatting) {
        FullFloatMatrix = fullFloatMatrix(imageWidth, imageHeight);
      }
      object['smartMsg_']['targets_'].map(item => {
        if (item) {
          let obj = {
            id: messageShowSelect.trackId ? item['trackId_'] : undefined,
            boxes: [],
            attributes: { attributes: [], type: item['type_'] },
            fall: { fallShow: false },
            points: [],
            segmentation: [],
          }
          let labelBodyBox = null;
          let k = 0;

          // 检测框
          if (messageShowSelect.boxes && item['boxes_'] && item['boxes_'].length ) {
            item['boxes_'].map((val, ind) => {
              let boxs = transformBoxes(val)
              if (boxs) {
                obj.boxes.push({ type: val['type_'] || '', p1: boxs.box1, p2: boxs.box2 });

                if (ind === 0) {
                  obj.attributes.box = { p1: boxs.box1, p2: boxs.box2 }
                  obj.fall.box = { p1: boxs.box1, p2: boxs.box2 }
                }
                if (val['type_'] === 'body') {
                  labelBodyBox = boxs
                }
                boxs = null;
              }
              
              if (messageShowSelect.scoreShow && ind === 0) {
                obj.attributes.score = val.score
              }
            })
            obj.boxes = !messageShowSelect.handBox && obj.boxes.length ? obj.boxes.filter(item => item.type !== 'hand') : obj.boxes
          }
          // 关节点
          if (item['points_'] && item['points_'].length ) {
            item['points_'].map(val => {
              if (val['points_'] && val['points_'].length) {
                let bodyType = messageShowSelect.body ? '' : 'body_landmarks'
                let faceType = messageShowSelect.face ? '' : 'face_landmarks'
                if (val['type_'] === 'mask') {
                  // 目标分割
                  if (messageShowSelect.floatMatrixsMask) {
                    obj.segmentation.push({ type: 'target_img', data: val['points_'] })
                  }
                } else if (val['type_'] === 'hand_landmarks') {
                  if (messageShowSelect.handMarks) {
                    obj.points.push({ type: val['type_'], skeletonPoints: transformPoints(val['points_'])})
                  }
                } else if (val['type_'] === 'corner') {
                  if (messageShowSelect.corner) {
                    obj.points.push({ type: val['type_'], skeletonPoints: transformPoints(val['points_'])})
                  }
                }  else if (val['type_'] === 'lmk_106pts') {
                  if (messageShowSelect.face) {
                    obj.points.push({ type: val['type_'], skeletonPoints: transformPoints(val['points_']), diameterSize: 2 })
                  }
                } else if (val['type_'] === 'parking') {
                  if (messageShowSelect.boxes) {
                    obj.points.push({ type: val['type_'], skeletonPoints: transformPoints(val['points_'])})
                  }
                } else if (val['type_'] !== bodyType && val['type_'] !== faceType) {
                  let skeletonPoints = [];
                  val['points_'].map((val, index) => {
                    let key = Config.skeletonKey[index];
                    skeletonPoints[key] = {
                      x: val['x_'],
                      y: val['y_'],
                      score: val['score_'] || 0
                    };
                  });
                  obj.points.push({ type: val['type_'], skeletonPoints })
                }
              }
            })
          }
          // 属性
          if (item['attributes_'] && item['attributes_'].length) {
            item['attributes_'].map(val => {
              // 分割的系数
              k = val['type_'] === 'expansion_ratio' && val['value_'] ?  val['value_'] : 0
              // 摔倒
              if (val['type_'] === 'fall' && val['value_'] === 1) {
                obj.fall.fallShow = true;
                obj.fall.attributes = {
                  type: val['type_'],
                  value: val['value_'],
                  score: messageShowSelect.scoreShow ? val['score_'] : undefined
                };
              } else if (messageShowSelect.attributes && val['valueString_']) {
                obj.attributes.attributes.push({
                  type: val['type_'],
                  value: val['valueString_'],
                  score: messageShowSelect.scoreShow ? val['score_'] : undefined
                })
              }
            })
          }
          // 车
          if (item['subTargets_'] && item['subTargets_'].length) {
            item['subTargets_'].map(val => {
              if (messageShowSelect.boxes && val['boxes_'] && val['boxes_'].length) {
                let boxs = transformBoxes(val['boxes_'][0])
                if (boxs) {
                  obj.boxes.push({ p1: boxs.box1, p2: boxs.box2 })
                  boxs = null;
                }
              }
              // 车牌框数据
              if (messageShowSelect.attributes && val['attributes_'] && val['attributes_'].length) {
                val['attributes_'].map(v => {
                  if (v['valueString_']) {
                    obj.attributes.attributes.push({
                      type: v['type_'],
                      value: v['valueString_'],
                      score: messageShowSelect.scoreShow ? v['score_'] : undefined
                    })
                  }
                })
              }
            })
          }
          // 全图分割 segmentation
          if ( item['floatMatrixs_'] && item['floatMatrixs_'].length ) {
            let floatType = item['floatMatrixs_'][0]['type_']
            if (floatType === 'segmentation' && messageShowSelect.floatMatrixs) {
              let floatdata = []
              item['floatMatrixs_'][0]['arrays_'].map(values => {
                values['value_'].map(index => {
                  floatdata.push(bgr_putpalette[(index % 81) * 3], 
                                 bgr_putpalette[(index % 81) * 3 + 1], 
                                 bgr_putpalette[(index % 81) * 3 + 2], 
                                 155)
                })
              })
              obj.segmentation.push({
                type: 'full_img',
                w: item['floatMatrixs_'][0]['arrays_'][0]['value_'].length,
                h: item['floatMatrixs_'][0]['arrays_'].length,
                data: floatdata
              })
            } else { // 抠图分割
              if (messageShowSelect.floatMatrixsMatting && labelBodyBox && FullFloatMatrix) {
                let labelWidth = labelBodyBox.box2.x - labelBodyBox.box1.x;
                let labelHeight = labelBodyBox.box2.y - labelBodyBox.box1.y;
                if (floatType === 'matting') {
                  let dataWidth = Math.trunc(item['floatMatrixs_'][0]['arrays_'][0]['value_'].length * labelWidth / 224)
                  let dataHeight = Math.trunc(item['floatMatrixs_'][0]['arrays_'].length * labelHeight / 224)
    
                  let datas = scaleData(dataWidth, dataHeight, item['floatMatrixs_'][0]['arrays_']);
                  
                  datas.map((values, i) => {
                    values['value_'].map((valuess, j) => {
                      if (valuess > 0) {
                        let x = (j - labelWidth / 224 * 16) + labelBodyBox.box1.x;
                        let y = (i - labelHeight / 224 * 16) + labelBodyBox.box1.y;
                        let index = Math.trunc(y) * 1920 * 4 + Math.trunc(x) * 4 + 3;
                        FullFloatMatrix[index] = 255 - valuess;
                      }
                    })
                  })
                  obj.segmentation.push({ type: 'full_img', w: imageWidth, h: imageHeight, data: FullFloatMatrix })
                }
              }
            }
          }
          // matting_trimapfree抠图分割
          if ( item['imgs_'] && item['imgs_'].length ) {
            let floatType = item['imgs_'][0]['type_']
            if (messageShowSelect.floatMatrixsMatting && labelBodyBox && FullFloatMatrix) {
              let labelWidth = labelBodyBox.box2.x - labelBodyBox.box1.x;
              let labelHeight = labelBodyBox.box2.y - labelBodyBox.box1.y;
              if (floatType === 'matting_trimapfree' && k >= 0){
                // 计算出状态 3
                let expand_roi_x1 = labelBodyBox.box1.x - labelWidth * k;
                let expand_roi_y1 = labelBodyBox.box1.y - labelHeight * k;
                let expand_roi_height = Math.trunc(labelHeight + 2 * labelHeight * k);
                let expand_roi_width = Math.trunc(labelWidth + 2 * labelWidth * k);

                // 计算出状态 2 的缩放系数
                let ratio = 0;
                let ratio1 = item['imgs_'][0]['height_'] * 1.0 / expand_roi_height;
                let ratio2 = item['imgs_'][0]['width_'] * 1.0 / expand_roi_width;

                if (ratio1 > ratio2) {
                  ratio = ratio2;
                } else {
                  ratio = ratio1;
                }

                // 计算出状态 2 的框
                let resize_roi_height = Math.trunc(expand_roi_height * ratio);
                let resize_roi_width = Math.trunc(expand_roi_width * ratio);

                // 创建一个 resize_matting[resize_roi_height][resize_roi_width] 的数组,
                // 并将抠图结果映射到状态 2 的框即 resize_matting 数组
                let arrHeight  = [...new Array(resize_roi_height).keys()];
                let arrWidth  =  [...new Array(resize_roi_width).keys()];
                let resize_matting = arrHeight.map((values) => {
                  return {
                    value_: arrWidth.map(valuess => {
                      return item['imgs_'][0]['buf_'][values * item['imgs_'][0]['width_'] + valuess];
                    })
                  }
                });

                // 二插值计算出状态 1
                let expand_matting = scaleData(expand_roi_width, expand_roi_height, resize_matting);

                // 渲染到 原图
                expand_matting.map((values, i) => {
                  values['value_'].map((valuess, j) => {
                    let row = i + expand_roi_y1;
                    let col = j + expand_roi_x1;
                    if (valuess > 0 && row >= 0 && col >= 0 && row < 1080 && col < 1980) {
                      valuess = valuess * 4;
                      if (valuess > 255) {
                        valuess = 255;
                      }
                      let temp = 255 - valuess;
                      let index = Math.trunc(row) * 1920 * 4 + Math.trunc(col) * 4 + 3;
                      FullFloatMatrix[index] = Math.min(FullFloatMatrix[index], temp);
                    }
                  })
                })

                obj.segmentation.push({ type: 'full_img', w: imageWidth, h: imageHeight, data: FullFloatMatrix })
              }
            }
          }
          smartMsgData.push(obj);
          obj = null;
        }
        return null;
      })
    }
  }
  // console.timeEnd('解析计时器')
  return {
    imageBlob,
    imageWidth,
    imageHeight,
    performance,
    smartMsgData
  };
};

function transformBoxes(box) {
  if (box &&
      box['topLeft_']['x_'] &&
      box['topLeft_']['y_'] &&
      box['bottomRight_']['x_'] &&
      box['bottomRight_']['y_']
  ) {
    let box1 = {
      x: box['topLeft_']['x_'],
      y: box['topLeft_']['y_']
    };
    let box2 = {
      x: box['bottomRight_']['x_'],
      y: box['bottomRight_']['y_']
    };
    return { box1, box2 };
  }
};

function transformPoints(points) {
  let skeletonPoints = [];
  points.map((val) => {
    skeletonPoints.push({
      x: val['x_'],
      y: val['y_'],
      score: val['score_'] || 0
    });
  });
  return skeletonPoints;
};

function scaleData(w, h, data) {
	let resData = new Array(h);
	
	for (let j = 0; j < h; j++) {
		let line = new Array(w);
		for (let i = 0; i < w; i++) {
      let v = bilinearInter(w, h, i, j, data);
			line[i] = Math.round(v);
		}
		resData[j] = { value_: line };
	}
	
	return resData;
}

function bilinearInter(sw, sh, x_, y_, data) {
	let w = data[0]['value_'].length;
	let h = data.length;
	
	let x = (x_ + 0.5) * w / sw - 0.5;
  let y = (y_ + 0.5) * h / sh - 0.5;
	
	let x1 = Math.floor(x);
	let x2 = Math.floor(x + 0.5);
	let y1 = Math.floor(y);
	let y2 = Math.floor(y + 0.5);
	
	x1 = x1 < 0 ? 0 : x1;
	y1 = y1 < 0 ? 0 : y1;
	
	x1 = x1 < w - 1 ? x1 : w - 1;
	y1 = y1 < h - 1 ? y1 : h - 1;
	
	x2 = x2 < w - 1 ? x2 : w - 1;
  y2 = y2 < h - 1 ? y2 : h - 1;
  
	let f11 = data[y1]['value_'][x1];
	let f21 = data[y1]['value_'][x2];
	let f12 = data[y2]['value_'][x1];
  let f22 = data[y2]['value_'][x2];
  
	let xm = x - x1;
	let ym = y - y1;
	let r1 = (1 - xm) * f11 + xm * f21;
  let r2 = (1 - xm) * f12 + xm * f22;
	let value = (1-ym) * r1 + ym * r2;
	
	return value;
}
