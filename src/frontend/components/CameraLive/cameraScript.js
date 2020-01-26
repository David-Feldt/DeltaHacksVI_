const api = require("../../../backend/services/api")

setTimeout(()=>{


    const controls = document.querySelector('.controls');
    const cameraOptions = document.querySelector('.video-options>select');
    const video = document.querySelector('video');
    const canvas = document.querySelector('canvas');
    const buttons = [...controls.querySelectorAll('button')];
    let streamStarted = false;
    
    const [play, pause, screenshot] = buttons;
    
    const constraints = {
      video: {
        width: {
          min: 1280,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 720,
          ideal: 1080,
          max: 1440
        },
      }
    };
    
    cameraOptions.onchange = () => {
      const updatedConstraints = {
        ...constraints,
        deviceId: {
          exact: cameraOptions.value
        }
      };
    
      startStream(updatedConstraints);
    };
    
    play.onclick = () => {
      if (streamStarted) {
        video.play();
        play.classList.add('d-none');
        pause.classList.remove('d-none');
        return;
      }
      if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const updatedConstraints = {
          ...constraints,
          deviceId: {
            exact: cameraOptions.value
          }
        };
        startStream(updatedConstraints);
      }
    };
    
    const pauseStream = () => {
      video.pause();
      play.classList.remove('d-none');
      pause.classList.add('d-none');
    };
    
    const doScreenshot = () => {
      canvas.width = 500;
      canvas.height = 400;
      canvas.getContext('2d').drawImage(video, 0, 0);
      var dataURL = canvas.toDataURL();
      console.log('screenshot taken')
      api.predictObjects('test')
    };
    
    pause.onclick = pauseStream;

    setInterval(()=>{
      doScreenshot()
    }, 5000)
    
    const startStream = async (constraints) => {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleStream(stream);
    };
    
    
    const handleStream = (stream) => {
      video.srcObject = stream;
      play.classList.add('d-none');
      pause.classList.remove('d-none');
      screenshot.classList.remove('d-none');
    
    };
    
    
    const getCameraSelection = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
      });
      cameraOptions.innerHTML = options.join('');
    };
    
    getCameraSelection();
    
    }, 1000)
    