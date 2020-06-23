/*
 *  Derived from Aidan Lincoln's Handtrack to leds
 *  Aidan Lincoln aidanlincoln@nyu.edu
 *  ITP/NYU
 *  Handtrack.js victordibia
 *  https://github.com/victordibia/handtrack.js/
 */

const video = document.getElementById("webCam");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let updateNote = document.getElementById("message");

//turn video on or off
let renderVideo = false;

let videoLoaded = false;
let model = null;
let xCord;
let yCord;
let xCord2;
let yCord2;
let handCnt = 0;
let song, song1, song2;
const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 4, // maximum number of boxes to detect
  iouThreshold: 0.07, // ioU threshold for non-max suppression
  scoreThreshold: 0.6, // confidence threshold for predictions.
};

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
  // detect objects in the image.
  model = lmodel;
  updateNote.innerText = "";
  startVideo();
});

function startVideo() {
  handTrack.startVideo(video).then(function (status) {
    // console.log("video started", status);
    if (status) {
      updateNote.innerText = "";
      videoLoaded = true;
      runDetection();
    } else {
      updateNote.innerText = "Please enable video";
    }
  });
}

function runDetection() {
  model.detect(video).then((predictions) => {
    console.log(predictions.length);
    handCnt = predictions.length;
    // if (predictions[0]) {
    //   let bboxX = predictions[0].bbox[0] + predictions[0].bbox[2] / 2;
    //   let bboxY = predictions[0].bbox[1] + predictions[0].bbox[3] / 2;
    //   xCord = bboxX;
    //   yCord = bboxY;
    //   handCnt = 1;
    //   if (predictions[1]) {
    //     let bboxX2 = predictions[1].bbox[0] + predictions[1].bbox[2] / 2;
    //     let bboxY2 = predictions[1].bbox[1] + predictions[1].bbox[3] / 2;
    //     xCord2 = bboxX2;
    //     yCord2 = bboxY2;
    //     handCnt = 2;
    //   } else {
    //     handCnt = 3;
    //     xCord2 = null;
    //     yCord2 = null;
    //   }
    // } else {
    //   handCnt = 0;
    //   xCord = null;
    //   yCord = null;
    //   xCord2 = null;
    //   yCord2 = null;
    // }
    if (renderVideo) {
      model.renderPredictions(predictions, canvas, context, video);
    }
    if (videoLoaded) {
      requestAnimationFrame(runDetection);
    }
  });
}
function preload() {
  song = loadSound("assets/applause8.mp3");
  song1 = loadSound("assets/applause7.mp3");
  song2 = loadSound("assets/boo2.mp3");
}
function setup() {
  createCanvas(0, 0);
}

function draw() {
  background(0);
  //song.loop();
  //   var go = document.createElement("IMG");
  //   go.setAttribute("id", "small");
  //   go.setAttribute("src", "assets/sApplause.png");

  var go2 = document.createElement("IMG");
  go2.setAttribute("src", "assets/boo.png");
  go2.setAttribute("id", "boo");

  if (handCnt == 1) {
    song2.pause();
    song1.pause();
    if (!song.isPlaying()) {
      song.play();
      song.setVolume(0.3);
      document.getElementById("applause").style.visibility = "visible";
      // document.getElementById("small").style.visibility = "visible";
    }
  } else if (handCnt == 2) {
    song2.pause();
    song.pause();
    if (!song1.isPlaying()) {
      song1.play();
      song1.setVolume(0.3);
      //   document.getElementById("small").style.visibility = "hidden";
      document.getElementById("applause").style.visibility = "visible";
    }
  } else if (handCnt == 3) {
    if (!song2.isPlaying()) {
      song.pause();
      song1.pause();
      song2.play();
      song2.setVolume(0.3);
      document.getElementById("applause").style.visibility = "hidden";
    }
  } else {
    // document.getElementById("small").style.visibility = "hidden";
    document.getElementById("applause").style.visibility = "hidden";
    song.pause();
    song1.pause();
    song2.pause();
  }
}
