var action = JSON.parse(localStorage.action || `{
  "assets": {},
  "artboards": [],
  "frames": {}
}`);


var artboards = action.artboards;

if (artboards.length == 0) {
  artboards.push({});
}

var canvas = artboards[0];

function renderABS() {
  document.querySelector("#artboard_select").innerHTML = "";
  document.querySelector("#select_artboard").innerHTML = "";
  for (var i = 0; i < artboards.length; i++) {
    let op = document.createElement("option");
    op.value = i;
    op.innerHTML = `Artboard ${i+1}`;
    let op2 = document.createElement("option");
    op2.value = i;
    op2.innerHTML = `Artboard ${i+1}`;
    document.querySelector("#artboard_select").appendChild(op);
    document.querySelector("#select_artboard").appendChild(op2);
  }
}
renderABS();

function changeArtBoard() {
  let v = parseInt(document.querySelector("#artboard_select").value);
  canvas = artboards[v]
  delete canvas.groups;
  delete canvas.groupName;
  id = Object.keys(canvas)[0];
  renderMenu();
}

function addArtBoard() {
  artboards.push({});
  renderABS();
  changeArtBoard();
}

function removeArtBoard() {
  artboards.splice(parseInt(document.querySelector("#artboard_select").value),1);
  renderABS();
  changeArtBoard();
}

document.querySelector("#close").addEventListener("click", () => {
  document.querySelector("#menu").style.display = "none";
  document.querySelector("#open").style.display = "block";
});

document.querySelector("#open").addEventListener("click", () => {
  document.querySelector("#open").style.display = "none";
  document.querySelector("#menu").style.display = "block";
});

var id = "";

function createEl() {
  let el_id = document.querySelector("#element_id").value;
  if (el_id == "") {
    return ;
  }
  canvas[el_id] = {};
  id = el_id;
  document.querySelector("#element_id").value = "";
  displayArtboard();
  renderMenu();
}

function deleteEl() {
  let el_id = document.querySelector("#element_selector").value;
  delete canvas[el_id];
  let op = document.querySelector(`option[value="${el_id}"]`);
  if (op != null) {
    document.querySelector("#element_selector").removeChild(op);
    document.querySelector("#rename_element").value = "";

    id = document.querySelector("#element_selector").value || undefined;
    displayArtboard();
    renderMenu();
  }
}

function renameEl() {
  let new_key = document.querySelector("#rename_element").value;
  let old_key = document.querySelector("#element_selector").value;
  if (old_key !== new_key) {
    Object.defineProperty(canvas, new_key,
        Object.getOwnPropertyDescriptor(canvas, old_key));
    delete canvas[old_key];
  }
  let op = document.querySelector(`option[value="${old_key}"]`);
  op.value = new_key;
  op.innerHTML = new_key;
  id = new_key;
}

function changeElement() {
  id = document.querySelector("#element_selector").value;
  console.log(id);
  displayArtboard();
  console.log(id);
  renderMenu();
}

const el_default = {
  "text_decoration_color": "#eeeeee",
  "background_color": "",
  "border_color": "#000000",
  "border_radius": "0",
  "border_style": "solid",
  "border_width": "1",
  "color": "#eeeeee",
  "font_family": "sans-serif",
  "font_size": "20",
  "font_weight": "400",
  "height": "100",
  "left": "100",
  "line_height": "20",
  "padding_bottom": "0",
  "padding_left": "0",
  "padding_right": "0",
  "padding_top": "0",
  "top": "100",
  "width": "100",
  "z_index": "0",
  "background_image": "",
  "opacity": "1",
  "transform": ""
}

const postfixes = {
  "border_radius": "px",
  "border_width": "px",
  "font_size": "px",
  "height": "px",
  "left": "px",
  "line_height": "px",
  "padding_bottom": "px",
  "padding_left": "px",
  "padding_right": "px",
  "padding_top": "px",
  "top": "px",
  "width": "px",
  "background_image": "')"
}

const prefixes = {
  "background_image": "url('"
}

const el_default_buttons = {
  "Bold": false,
  "Center​": false,
  "Cover": false,
  "Italic": false,
  "Justify": false,
  "Left": true,
  "Center": false,
  "Repeat": false,
  "Right": false,
  "Line-Through": false,
  "Underline": false
}

const attrs = {
  "Bold": "font-weight",
  "Center​": "background-position",
  "Cover": "background-size",
  "Italic": "font-style",
  "Justify": "text-align",
  "Left": "text-align",
  "Center": "text-align",
  "Repeat": "background-repeat",
  "Right": "text-align",
  "Line-Through": "text-decoration-line",
  "Underline": "text-decoration-line"
}

function button(e) {
  let title = e.title;
  let v = e.classList.toggle("active");
  if (v) {
    addStyle(title);
  } else {
    removeStyle(title);
  }
}

function addStyle(style) {
  canvas[id][style] = true;
  displayArtboard();
}

function removeStyle(style) {
  canvas[id][style] = false;
  displayArtboard();
}

function update(e) {
  canvas[id][e.id] = e.value;
  displayArtboard();
}

function updateHTML(e) {
  canvas[id].innerHTML = e.value;
  displayArtboard();
}

function renderMenu() {
  document.querySelector("#element_selector").innerHTML = "";
  for (var el in canvas) {
    if (canvas.hasOwnProperty(el) && el != "groups" && el != "groupName") {
      let op = document.createElement("option");
      op.value = el;
      op.innerHTML = el;
      document.querySelector("#element_selector").appendChild(op);
      if (el == id) {
        document.querySelector("#element_selector").selectedIndex = document.querySelector("#element_selector").options.length-1;
      }
    }
  }
  if (id && id != "groups" && id != "groupName") {
    document.querySelector("#rename_element").value = id;
    for (var style in el_default) {
      if (el_default.hasOwnProperty(style)) {
        try {
          document.querySelector(`#${style}`).value = canvas[id][style] || el_default[style];
        } catch (e) {
          console.log(e);
        }
      }
    }

    for (var title in el_default_buttons) {
      if (el_default_buttons.hasOwnProperty(title)) {
        let active = canvas[id][title] || el_default_buttons[title];
        if (active) {
          document.querySelector(`i[title="${title}"]`).classList.add("active");
        } else {
          document.querySelector(`i[title="${title}"]`).classList.remove("active");
        }
      }
    }
  }
  console.log(id);
}

function renderCanvas(frameNumber) {
  loadFont();
  let can = document.querySelector("#canvas");
  var name = "canvas";
  if (canvas.groupName) {
    name = canvas.groupName;
  }
  delete canvas.groupName;
  for (var el in canvas) {
    if (canvas.hasOwnProperty(el) && el != "groups") {

      let div = document.createElement("div");
      div.style.position = "absolute";
      div.dataset.name = el;
      div.dataset.group = name;
      div.innerHTML = canvas[el].innerHTML || "";

      for (var style in el_default) {
        if (el_default.hasOwnProperty(style)) {
          div.style[style.replace(/_/g,"-").replace(/​/g,"")] = (prefixes[style] || "") + (canvas[el][style] || el_default[style]) + (postfixes[style] || "");
        }
      }

      for (var style in el_default_buttons) {
        if (el_default_buttons.hasOwnProperty(style)) {
          if (canvas[el][style]) {
            div.style[attrs[style]] = style.toLowerCase();
          }
        }
      }

      if (canvas[el].Repeat) {
        div.style[attrs[style]] = "repeat";
      } else {
        div.style[attrs[style]] = "no-repeat";
      }
      can.appendChild(div);
    }
  }
  canvas.groupName = name;
  if (frameNumber != undefined) {
    renderGroups(frameNumber);
  }
}

var zoom = parseFloat(localStorage.zoom) || 1;
document.querySelector("#canvas").style.transform = `scale(${zoom})`;
document.querySelector("#amount").innerHTML = zoom.toFixed(1);

function zoomIn() {
  zoom += 0.1;
  document.querySelector("#canvas").style.transform = `scale(${zoom})`;
  document.querySelector("#amount").innerHTML = zoom.toFixed(1);
  localStorage.zoom = zoom;
}

function zoomOut() {
  zoom = Math.max(0.1, zoom-0.1);
  document.querySelector("#canvas").style.transform = `scale(${zoom})`;
  document.querySelector("#amount").innerHTML = zoom.toFixed(1);
  localStorage.zoom = zoom;
}

function download_file() {
  let filename = Math.floor(Math.random()*1000000);

  let action = JSON.parse(localStorage.action);
  action.artboards = artboards;
  let text = JSON.stringify(action);
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename+".act.csp");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function loadFont() {
  for (var el in canvas) {
    if (canvas.hasOwnProperty(el) && el != "groupName" && el != "groups") {
      if (canvas[el].font_family) {
        try {
          WebFont.load({
            google: {
              families: [canvas[el].font_family]
            }
          });
        } catch (e) {
          let doesnothing = e;
        }
      }
    }
  }
}

function openFile(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    var text = reader.result;
    let name = document.querySelector(`input[type="file"]`).value;
    if (name.indexOf(".act.csp") > -1) {
      action = JSON.parse(text);
      artboards = action.artboards;
      localStorage.action = JSON.stringify(action);
      canvas = artboards[0];
      delete canvas.groups;
      delete canvas.groupName;
      if (Object.keys(canvas)[0]) {
        console.log("init rendering");
        id = Object.keys(canvas)[0];
        displayArtboard();
        renderMenu();
        let frames = Object.keys(action.frames);
        console.log(frames.length);
        if (frames.length > 0) {
          renderFrame(parseInt(frames.pop()));
        }
      }
    }
  };
  reader.readAsText(input.files[0]);
};


function readImg() {
  if (document.querySelector("#background_image").files && document.querySelector("#background_image").files[0]) {
    var FR= new FileReader();
    FR.addEventListener("load", function(e) {
      console.log("Read");
      canvas[id].background_image = e.target.result;
      displayArtboard();
    });
    console.log("reading");
    FR.readAsDataURL(document.querySelector("#background_image").files[0]);
  }
}

function removeIMG() {
  canvas[id].background_image = "";
  displayArtboard();
}
window.onload = () => {
  delete canvas.groups;
  delete canvas.groupName;
  if (Object.keys(canvas)[0]) {
    console.log("init rendering");
    id = Object.keys(canvas)[0];
    displayArtboard();
    renderMenu();
    let frames = Object.keys(action.frames);
    console.log(frames.length);
    if (frames.length > 0) {
      renderFrame(parseInt(frames.pop()));
    }
  }
}
