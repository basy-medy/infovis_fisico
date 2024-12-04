import CameraMovement from './js/cameraMovement.js';

import Protobject from './js/protobject.js';

CameraMovement.start(30, 0); //generate events each 300 ms; 0 is the webcam id
CameraMovement.showPreview({ top: 50, left: 50, width: 640, height: 480 });
CameraMovement.onData((data) => {
    //console.log(data.magnitude);
  Protobject.send({ key: data.magnitude }).to('main.js');
});