
var mqtt;
var reconnectTimeout = 2000;
//window.host = "169.254.10.125";
var port = 9001;
window.TOPICS = ["Server", "Motors", "Camera", "Follow", "Stream"];
var username = 'Java';
var password = 'Script';

function sub_mqtt_msg(callback, error) {
  callback = callback || function(){};
  error    = error    || message;

  function onConnect() {
    callback();
    client.subscribe(TOPICS[0]);
    message("Waiting for " + TOPICS[0]);
  }

  function onMessageArrived(message) {
    let result = message.payloadString;
    message(result);
  }

  // Send an MQTT message
  client = new Paho.MQTT.Client(window.mqtt.host, port, "C");
  client.onMessageArrived = onMessageArrived;
  client.onConnectionLost = error.bind(null, "Connection lost :v");
  client.connect({onSuccess:onConnect});

  
  document.getElementById("estat").innerText = "Trying to connect...";
  
}


// Movement actions

function emerge() {
    let action = "up";
    const msg = JSON.stringify([action, 0, 0]);
    window.mqtt.send(TOPICS[1],msg); 
}

function immerse() {
    let action = "dwn";
    const msg = JSON.stringify([action, 0, 0]);
    window.mqtt.send(TOPICS[1],msg); 
}

function move_forward(speed_left, speed_right) {
    let action = "fwd";
    const msg = JSON.stringify([action, speed_left, speed_right]);
    window.mqtt.send(TOPICS[1],msg); 
}

function move_backward(speed_left, speed_right) {
    let action = "bkd";
    const msg = JSON.stringify([action, speed_left, speed_right]);
    window.mqtt.send(TOPICS[1],msg); 
}

function turn_left() {
    let action = "left";
    let speed = 0.2;
    const msg = JSON.stringify([action, speed]);;
    window.mqtt.send(TOPICS[1],msg); 
}

function turn_right() {
    let action = "right";
    let speed = 0.2;
    const msg = JSON.stringify([action, speed]);
    window.mqtt.send(TOPICS[1],msg); 
}

function stop() {
    let action = "stop";
    const msg = JSON.stringify([action, 0]);
    window.mqtt.send(TOPICS[1],msg);    
}


// Other actions
// Autonomous mode
function follow() {
  let is_follow = document.getElementById("follow-button").following;
  if (!is_follow) {
    document.getElementById("follow-button").following = true;
    button_toggle('follow-button', true);
    disable_controls();
    window.mqtt.send(TOPICS[3], "start");
  }
  else {
    document.getElementById("follow-button").following = false;
    button_toggle('follow-button', false);
    enable_controls();
    window.mqtt.send(TOPICS[3], "stop");
  }
}


// Take a picture
function capture_photo() {
  window.mqtt.send(TOPICS[2], "capture");
}

// Finish
function Finish() {
  window.mqtt.send("Follow", "stop");
  window.mqtt.send("Stream", "pause");
}

// window.load = null;
window.onunload = Finish();
