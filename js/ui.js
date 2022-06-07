const MESSAGE_DISPLAY_TIME = 10000; // ms


function pantalla(id) {
  for (const e of document.getElementsByClassName('pantalla'))
    e.style.display = 'none';
  document.getElementById(id).style.display = 'block';
  pantalla_rules(id);
}

function pantalla_rules(id) {
  // Rules/functions to apply when an specific screen is showed
  if (id == 'panel') {
    keyboard_install();
    ui_help_hide();
    setup_joystick();
  } else {
    keyboard_disable();
  }
}

function message(text) {
  // Show a message to the user.
  if (!text || text == "")
    document.getElementById("estat-cont").style.display = 'none';
  else {
    document.getElementById("estat-cont").style.display = 'block';
    document.getElementById("estat").innerText = text;
    try {
      clearInterval(window._ui_message_interval);
    } catch (err) {}
    window._ui_message_interval = setTimeout(message, MESSAGE_DISPLAY_TIME);
  }
}

function ui_connecting_animation(show) {
  document.getElementById('loading-overlay').style.display = ['none', 'block'][+!!show];
}

function button_toggle(id, state) {
  let elem = document.getElementById(id);
  console.log(elem, state);
  if (state)
    elem.classList.add('active');
  else
    elem.classList.remove('active');
}

function disable_contextmenu() {
    return false;
}

function disable_controls() {
  for (const but of document.getElementsByClassName('move'))
    but.style.display = 'none';
}

function enable_controls() {
  for (const but of document.getElementsByClassName('move'))
    but.style.display = 'block';
}

function setup_joystick() {
  if (window._joystick) {
    // Already installed, force to recalculate it.
    window._joystick.resize();
    return;
  }
  // Install it
  let elem = document.getElementById('joystick');
  if (elem)
    window._joystick = (
      Joystick(elem, joystick_move)
        .set_background("#00000040")
        .set_foreground("#FFFFFF")
        .set_background_radius(20)
        .set_joystick_size(.75)
    );
}

function joystick_move(x, y) {
    const last = window._last_move || new Date(1999, 9, 6);
    const now = Date.now();
    if (x != 0 && y != 0 && (now - last) < 400) { // Milliseconds
	return;
    }
    window._last_move = now;
    if (y >= 0 && x > 0) {
	let spd = Math.min(Math.sqrt(x**2 + y**2), 1);
	let spd_l = spd;
	let spd_r = spd - x;
	window.move_forward(spd_l, spd_r);
    }
    else if (y > 0 && x <= 0) {
	let spd = Math.min(Math.sqrt(x**2 + y**2), 1);
	let spd_l = spd + x;
	let spd_r = spd;
	window.move_forward(spd_l, spd_r);
    }
    else if (y <= 0 && x < 0) {
	let spd = Math.min(Math.sqrt(x**2 + y**2), 1);
	let spd_l = spd + x;
	let spd_r = spd;
	window.move_backward(spd_l, spd_r);
    }
    else if (y < 0 && x >= 0) {
	let spd = Math.min(Math.sqrt(x**2 + y**2), 1);
	let spd_l = spd;
	let spd_r = spd - x;
	window.move_backward(spd_l, spd_r);
    }
    else if (y == 0 && x == 0) {
	window.stop();
    };
    console.log("joystick: ", x, y);
}
// Help overlayer

function ui_help() {
  document.getElementById('help').style.display = 'block';
}

function ui_help_hide() {
  document.getElementById('help').style.display = 'none';
}

function install_ui_keyboard_descriptions() {
  let elem = document.getElementById('help-keyboard');
  elem.innerHTML = "";
  keyboard_descriptions().forEach(([keys, description]) => {
    let row = document.createElement("div");
    row.className = "row";

    // Description
    let desc = document.createElement("div");
    desc.className = "description";
    desc.innerText = description;
    row.appendChild(desc);

    // Keys
    let keycont = document.createElement('div');
    keycont.className = 'keys';
    for (const key of keys) {
      let keyelem = document.createElement('div');
      keyelem.className = 'key';
      keyelem.innerText = key;
      keycont.appendChild(keyelem);
    }
    row.appendChild(keycont);
    elem.appendChild(row);
  });
}

/* Display fullscreen */
function open_fullscreen() {
  var elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
  else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  }
  else if (elem.webkitRequestFullscreen) { /* Chrome and Safari */
    elem.webkitRequestFullscreen();
  }
  else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem = window.top.document.body;
     elem.msRequestFullscreen();
  }
    document.getElementById("fullscreen").value = "open";
    document.getElementById("fullscreen").innerText = "⇲";
}

/* Close fullscreen */
function close_fullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
    document.getElementById("fullscreen").value = "close";
    document.getElementById("fullscreen").innerText = "⇱";
}

/* Enable/disable fullscreen */
function change_fullscreen() {
    var screen = document.getElementById("fullscreen").value;
    if (screen == "close") {
	open_fullscreen();
    }
    else if (screen == "open") {
	close_fullscreen();
    }
}

function apply_mobile() {
    for (let elem of document.getElementsByClassName("mobile"))
	elem.classList.add("hide");
}

// Main

function main() {
  message();

  // One time installs:
  install_ui_keyboard_descriptions();
  
  // Find platform
  if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    apply_mobile();	
  }   
  // Boot:
  pantalla('intro');
 
}

window.onload = main;
