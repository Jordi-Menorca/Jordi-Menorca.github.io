window.MQTT_PORT = 9001;


function start_connection() {
  setTimeout(ui_connecting_animation.bind(null, true), 0); // async

  window.host = document.getElementById("host-ip").value;
 
  window.mqtt = new MQTT(
    window.host,
    MQTT_PORT,
    console.log,
    (err) => { // On error message:
      setTimeout(ui_connecting_animation.bind(null, false), 0); // async
      message(err);
  });
  window.mqtt.on_connect(() => {
    ui_connecting_animation(false);
    pantalla('panel');
    open_fullscreen();
    message('Connected to robot ✔');
  });
  window.mqtt.connect();
}

