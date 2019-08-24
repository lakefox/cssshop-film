document.querySelector("#close_record").addEventListener("click", () => {
  document.querySelector("#menu_record").style.display = "none";
  document.querySelector("#record").style.display = "block";
  saveFrame();
});

document.querySelector("#record").addEventListener("click", () => {
  document.querySelector("#record").style.display = "none";
  document.querySelector("#menu_record").style.display = "block";
  saveFrame();
});

function play(startNum) {
  let frames = Object.keys(action.frames);
  for (var i = 0; i < frames.length; i++) {
    let frame = parseInt(frames[i]);
    setTimeout(() => {
      renderFrame(frame);
    }, frame);
  }
}

function displayArtboard() {
  saveFrame();
  let num = document.querySelector("#artboard_select").value;
  canvas = action.artboards[num];
  delete canvas.groups;
  delete canvas.groupName;
  let can = document.querySelector("#canvas");
  can.innerHTML = "";
  renderCanvas();
}

function renderFrame(frameNumber) {
  let frame = action.frames[frameNumber];
  canvas = action.artboards[frame.artboard];
  id = document.querySelector("#element_selector").value || Object.keys(canvas)[0];
  let can = document.querySelector("#canvas");
  can.innerHTML = "";
  renderCanvas(frameNumber);
  generateCanvasElements(frameNumber);
}

function renderFrameGroups(frameNumber) {
  console.log("Running");
  document.querySelector("#canvas").style.transform = `scale(1)`;
  let groupData = {canvas: []}
  let elements = document.querySelectorAll("div[data-group]");
  // Make the groups;
  for (var i = 0; i < elements.length; i++) {
    let id = elements[i].dataset.group;
    let container = document.querySelector(`div[data-container=${id}]`);
    if (!container) {
      container = document.createElement("div");
      container.dataset.container = id;
      document.querySelector("#canvas").appendChild(container);
      groupData[id] = [];
    }
    groupData[id] = groupData[id] || [];
    groupData[id].push(elements[i].dataset.name);
    container = document.querySelector(`div[data-container=${id}]`);
    container.appendChild(elements[i]);
  }
  let groupKeys = Object.keys(groupData);
  groupKeys.shift();
  for (var i = 0; i < groupKeys.length; i++) {
    let actions = action.frames[frameNumber].assets[parseInt(groupKeys[i].split("-").pop())].actions;
    let box = getBoundingBox(groupKeys[i], groupData[groupKeys[i]]);
    if (box != false) {
      let container = document.querySelector(`div[data-container=${groupKeys[i]}]`);
      if (container.getAttribute("style") == null) {
        container.style = `position: absolute; top: ${box.y+actions.y}px; left: ${box.x+actions.x}px; width: ${box.width}px; height: ${box.height}px; transform: rotate(${actions.rotate}deg) scale(${actions.scale}); z-index: ${actions.z};`;
      }
    }
  }
  document.querySelector("#canvas").style.transform = `scale(${zoom})`;
}

function generateCanvasElements(frameNumber) {
  let frame = action.frames[frameNumber];
  let assets = frame.assets;
  if (!canvas.group) {
    canvas.groups = {};
  }
  for (var i = 0; i < assets.length; i++) {
    let asset = assets[i];
      let assetData = action.assets[asset.id][asset.position];
      canvas = action.assets[asset.id].None[0];
      canvas.groups = assetData;
      canvas.groupName = asset.id+"-"+asset.position+"-"+i;
      renderCanvas(frameNumber);
  }
}

function renderGroups(frameNumber) {
  document.querySelector("#canvas").style.transform = `scale(1)`;
  let groups = canvas.groups || {};
  for (var a = 0; a < Object.keys(groups).length; a++) {
    let group = groups[Object.keys(groups)[a]];
    if (group.elements) {
      if (group.elements.length > 0) {
        let div = document.createElement("div");
        let box = getBoundingBox(Object.keys(groups)[a], group.elements);
        if (box != false) {
          div.style = `position: absolute; top: ${box.y+(parseInt(group.y) || 0)}px; left: ${box.x+(parseInt(group.x) || 0)}px; width: ${box.width}px; height: ${box.height}px; transform: ${Object.values(group.styles || {}).join(" ")}; z-index: ${group.zindex}; display: ${group.display};`;
          for (var b = 0; b < group.elements.length; b++) {
            let element = group.elements[b];
            let child = document.querySelector(`div[data-name="${element}"]`);
            if (child != null) {
              child.style.top = (parseInt(canvas[element].top || el_default.top)-box.y)+"px";
              child.style.left = (parseInt(canvas[element].left || el_default.left)-box.x)+"px";
              div.append(child);
            }
          }
          div.dataset.group = Object.keys(groups)[a];
          document.querySelector("#canvas").append(div);
        }
      }
    }
  }
  document.querySelector("#canvas").style.transform = `scale(${zoom})`;
  renderFrameGroups(frameNumber)
}

function getBoundingBox(group, names) {
  let ogX = window.scrollX;
  let ogY = window.scrollY;
  window.scrollTo(0,0);
  let el = document.querySelector(`div[data-container="${group}"] > div[data-name="${names[0]}"]`);
  if (el != null) {
    let box = el.getBoundingClientRect();
    box = JSON.parse(JSON.stringify(box));
    box.width = box.x + box.width;
    box.height = box.y + box.height;
    for (var i = 1; i < names.length; i++) {
      let el = document.querySelector(`div[data-container="${group}"] > div[data-name="${names[i]}"]`).getBoundingClientRect();
      box.x = Math.min(box.x, el.x);
      box.y = Math.min(box.y, el.y);
      box.width = Math.max(box.width, el.x + el.width);
      box.height = Math.max(box.height, el.y + el.height);
    }
    delete box.top;
    delete box.bottom;
    delete box.left;
    delete box.right;

    window.scrollTo(ogX, ogY);

    box.width = box.width-box.x;
    box.height = box.height-box.y;

    return box;
  } else {
    window.scrollTo(ogX, ogY);
    return false;
  }
}

function loadAsset(event) {
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function (readerEvt) {
    var text = reader.result;
    let name = document.querySelectorAll("input[type=file]")[1].value.slice(12,-8);
    action.assets[name] = JSON.parse(text);
    renderCanvas();
    renderABS();
    renderAssets();
    renderAssetSelector();
    saveFrame();
  };
  reader.readAsText(input.files[0]);
};

renderAssets();
function renderAssets() {
  document.querySelector("#add_asset").innerHTML = "";
  let keys = Object.keys(action.assets);
  for (var i = 0; i < keys.length; i++) {
    let op = document.createElement("option");
    op.value = keys[i];
    op.innerHTML = keys[i];
    document.querySelector("#add_asset").appendChild(op);
  }
}

function createFrame() {
  let frameTime = document.querySelector("#frame_index").value;
  action.frames[frameTime] = {
    assets: [],
    artboard: 0,
    canvas: {}
  };
  renderFrameSelector();
  renderFrameMenu();
  saveFrame();
}

renderFrameSelector();
function renderFrameSelector() {
  document.querySelector("#frame_selector").innerHTML = "";
  document.querySelector("#copy_selector").innerHTML = "";
  let keys = Object.keys(action.frames);
  for (var i = 0; i < keys.length; i++) {
    let op = document.createElement("option");
    op.value = keys[i];
    op.innerHTML = keys[i];
    document.querySelector("#frame_selector").appendChild(op);
    let op2 = document.createElement("option");
    op2.value = keys[i];
    op2.innerHTML = keys[i];
    document.querySelector("#copy_selector").appendChild(op2);
  }
}

function moveFrame(e) {
  let newTime = e.value;
  let oldTime = document.querySelector("#frame_selector").value;
  action.frames[newTime] = action.frames[oldTime];
  delete action.frames[oldTime];
  renderFrameSelector();
  document.querySelector("#frame_selector").value = newTime;
  saveFrame();
}

function selectArtboard() {
  let v = parseInt(document.querySelector("#select_artboard").value);
  action.frames[document.querySelector("#frame_selector").value].artboard = v;
  action.artboards = artboards;
  canvas = artboards[v]
  id = Object.keys(canvas)[0];
  renderMenu();
  renderCanvas();
  saveFrame();
}

renderFrameMenu();
function renderFrameMenu() {
  let time = document.querySelector("#frame_selector").value;
  if (time != "") {
    renderFrame(parseInt(time));
  }
  if (time != "") {
    let frame = action.frames[time];
    document.querySelector("#move_frame").value = time;
    document.querySelector("#select_artboard").value = frame.artboard;
    renderAssetSelector();
  }
}

function addAsset() {
  action.frames[document.querySelector("#frame_selector").value].assets.push({
    id: document.querySelector("#add_asset").value,
    position: "None",
    actions: {
      x: 0,
      y: 0,
      z: 0,
      rotate: 0,
      scale: 1
    }
  });
  renderAssetSelector();
  saveFrame();
}

function renderAssetSelector() {
  let time = parseInt(document.querySelector("#frame_selector").value);
  document.querySelector("#asset_selector").innerHTML = "";
  let assets = action.frames[time].assets;
  for (var i = 0; i < assets.length; i++) {
    let op = document.createElement("option");
    op.value = i;
    op.innerHTML = assets[i].id;
    document.querySelector("#asset_selector").appendChild(op);
  }
  changeAsset();
  renderPositions();
}

function renderPositions() {
  let time = document.querySelector("#frame_selector").value;
  document.querySelector("#position_selector").innerHTML = "";
  let positions = Object.keys(action.assets[document.querySelector("#add_asset").value]);
  for (var i = 0; i < positions.length; i++) {
    let op = document.createElement("option");
    op.value = positions[i];
    op.innerHTML = positions[i];
    document.querySelector("#position_selector").appendChild(op);
  }
}

function removeAsset() {
  let assetId = document.querySelector("#asset_selector").value;
  let frame = document.querySelector("#frame_selector").value;
  action.frames[frame].assets.splice(assetId, 1);
  renderAssetSelector();
  saveFrame();
}

function changeAsset() {
  let assetId = document.querySelector("#asset_selector").value;
  if (assetId) {
    let frame = document.querySelector("#frame_selector").value;
    let asset = action.frames[frame].assets[assetId];
    document.querySelector("#position_selector").value = asset.position;
    document.querySelector("#group_x").value = asset.actions.x;
    document.querySelector("#group_y").value = asset.actions.y;
    document.querySelector("#group_z").value = asset.actions.z;
    document.querySelector("#group_rotate").value = asset.actions.rotate;
    document.querySelector("#group_scale").value = asset.actions.scale;
  }
}

function updateAsset() {
  let assetId = document.querySelector("#asset_selector").value;
  let frame = document.querySelector("#frame_selector").value;
  let asset = action.frames[frame].assets[assetId];
  asset.actions.x = parseInt(document.querySelector("#group_x").value);
  asset.actions.y = parseInt(document.querySelector("#group_y").value);
  asset.actions.z = parseInt(document.querySelector("#group_z").value);
  asset.actions.rotate = parseInt(document.querySelector("#group_rotate").value);
  asset.actions.scale = parseFloat(document.querySelector("#group_scale").value);
  asset.position = document.querySelector("#position_selector").value;
  saveFrame();
}

function saveFrame() {
  let assets = Object.keys(action.assets);
  for (var a = 0; a < assets.length; a++) {
    let artboards = action.assets[assets[a]].None;
    for (var b = 0; b < artboards.length; b++) {
      delete artboards[b].groupName;
      delete artboards[b].groups;
    }
  }
  localStorage.action = JSON.stringify(action);
  // Render frame
  let frameNumber = parseInt(document.querySelector("#frame_selector").value);
  if (frameNumber.toString() != "NaN") {
    renderFrame(frameNumber);
  }
}

function deleteFrame() {
  let assets = Object.keys(action.assets);
  for (var a = 0; a < assets.length; a++) {
    let artboards = action.assets[assets[a]].None;
    for (var b = 0; b < artboards.length; b++) {
      delete artboards[b].groupName;
      delete artboards[b].groups;
    }
  }
  let frameNumber = document.querySelector("#frame_selector").value;
  delete action.frames[frameNumber];
  localStorage.action = JSON.stringify(action);
  // Render frame
  renderFrameSelector();
  document.querySelector("#frame_selector").value = "0";
  renderFrame(0);
}

function paste() {
  let pasteId = parseInt(document.querySelector("#frame_selector").value);
  let copyId = parseInt(document.querySelector("#copy_selector").value);
  let copy = JSON.parse(JSON.stringify(action.frames[copyId]));
  action.frames[pasteId] = copy;
  renderFrameSelector();
  renderFrameMenu();
  saveFrame();
}
