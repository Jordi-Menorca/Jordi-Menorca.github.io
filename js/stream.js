// Uses globals window.host, window.TOPICS


var STREAM_PORT = 8090;
var RASPY_IP = "169.254.10.125"

function stream() {
  let elem = document.getElementById("streaming");
  let playing = !!elem.playing;
  if (playing) {
    elem.playing = false;
    elem.classList.remove("streaming-on");
    button_toggle('stream-button', false);
    elem.src = "images/stream_off.png";
    window.mqtt.send(window.TOPICS[4], "pause");
  }
  else {
    elem.playing = true;
    elem.retry = 100;
    elem.classList.add("streaming-on");
    button_toggle('stream-button', true);
    stream_refresh_img();
    window.mqtt.send(window.TOPICS[4], "play", () => {stream_refresh_img();});
  }
}

function stream_refresh_img() {
  let elem = document.getElementById("streaming");
  if (! elem.playing)
    return;
    elem.src = "http://"+RASPY_IP+":"+STREAM_PORT+"/?action=stream";
}

function stream_error() {
  let elem = document.getElementById('streaming');

  // Show nosignal image
  elem.src='images/nosignal.png';

  // Auto-retry in 2x time
  elem.retry = Math.min((elem.retry||100) * 2, 10000); // Up to 10s
  setTimeout(stream_refresh_img, elem.retry);
}

function stream_screenshot() {
  let url = document.getElementById('streaming').src.replace('=stream', '=snapshot');
  download_image(url, (new Date()).toISOString()+'.jpg');
}

function download_image(src, name) {
  let a = document.createElement('a');
  a.style.position = 'fixed';
  a.style.top      = '-800px';
  a.style.left     = '-800px';
  a.href     = src;
  a.download = name;
  a.target   = '_blank';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); }, 2000);
}
