function inbetween(f1, f2, frameRate) {
  deleteInbetween(f1,f2)
  let cFrame = parseInt(f1);
  let nFrame = parseInt(f2);
  if (nFrame.toString() != "NaN") {
    let cFrameCopy = JSON.parse(JSON.stringify(action.frames[cFrame]));
    let nFrameCopy = JSON.parse(JSON.stringify(action.frames[nFrame]));
    action.frames[cFrame].og = true;
    action.frames[nFrame].og = true;
    // Make spots for the new frames
    let numOfFrames = parseInt(Math.abs(nFrame-cFrame)/frameRate);
    console.log(numOfFrames);
    for (var b = 0; b < numOfFrames; b++) {
      let frameIndex = cFrame+(frameRate*b);
      // Make sure that the frame isn't already made
      if (action.frames[frameIndex] == undefined) {
        // Define the frame using the first one
        action.frames[frameIndex] = JSON.parse(JSON.stringify(action.frames[cFrame]));

        let thisFrame = action.frames[frameIndex];
        thisFrame.og = false;
        // Change the asset actions
        for (var c = 0; c < thisFrame.assets.length; c++) {
          let thisAsset = thisFrame.assets[c];
          let nFrameAct = nFrameCopy.assets[c].actions;
          let cFrameAct = cFrameCopy.assets[c].actions;

          let xMulti = (nFrameAct.x-cFrameAct.x)/numOfFrames;
          let yMulti = (nFrameAct.y-cFrameAct.y)/numOfFrames;
          let zMulti = (nFrameAct.z-cFrameAct.z)/numOfFrames;
          let rotateMulti = (nFrameAct.rotate-cFrameAct.rotate)/numOfFrames;
          let scaleMulti = (nFrameAct.scale-cFrameAct.scale)/numOfFrames;
          let opacityMulti = (nFrameAct.opacity-cFrameAct.opacity)/numOfFrames;

          thisAsset.actions.x += xMulti*b;
          thisAsset.actions.y += yMulti*b;
          thisAsset.actions.scale += scaleMulti*b
          thisAsset.actions.opacity += opacityMulti*b
          thisAsset.actions.z += zMulti*b
          thisAsset.actions.rotate += rotateMulti*b
          console.log("adj");
        }
      }
    }
  }
}
function deleteInbetween(f1,f2) {
  let frames = Object.keys(action.frames);
  for (var a = 0; a < frames.length; a++) {
    if (parseInt(frames[a]) > parseInt(f1) && parseInt(frames[a]) < parseInt(f2)) {
      let og = action.frames[frames[a]].og;
      if (og == false) {
        delete action.frames[frames[a]];
      }
    }
  }
}
function updateF2() {
  let f1 = document.querySelector("#f1").value;
  document.querySelector("#f2").innerHTML = "";
  let keys = Object.keys(action.frames);
  keys.splice(keys.indexOf(f1),1);
  keys = keys.reverse();
  for (var i = 0; i < keys.length; i++) {
    if (action.frames[keys[i]].og == false) {} else
    {
      let op = document.createElement("option");
      op.value = keys[i];
      op.innerHTML = keys[i];
      document.querySelector("#f2").appendChild(op);
    }
  }
}

function generateIBN() {
  let f1 = document.querySelector("#f1").value;
  let f2 = document.querySelector("#f2").value;
  let frameRate = parseInt(document.querySelector("#frameRate").value);
  inbetween(f1,f2, parseInt(1000/frameRate));
  saveFrame();
}
