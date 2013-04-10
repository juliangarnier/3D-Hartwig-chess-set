/*
 * 3D Artwig chess set
 * @JulianGarnier
 *
 * Licensed under the MIT license.
 * Copyright 2012 Julian Garnier
 */

var chess = new Chess();
var currentColor = chess.turn();
var turn = 0;
var timeOut = null;
var photon = document.getElementsByClassName("photon-shader");
var sphere = document.getElementsByClassName("sphere");
var piece = document.getElementsByClassName("piece");
var square = document.getElementsByClassName("square");
var highlighted = document.getElementsByClassName("highlight");
var app = document.getElementById("app");
var scene = document.getElementById("scene");
var cursor = document.getElementById("cursor");
var sceneX = 40;
var sceneY = 90;
var controls = false;
var animated = false;
var mouseDown = false;
var leapDown = false;
var closestElement = null;
var white = "White";
var black = "Black";
var inverse = 1;
var fingerPos = {};

document.getElementById('overlay').addEventListener('click', function() {
  var el = document.documentElement,
      rfs = el.webkitRequestFullScreen;
      rfs.call(el);
});

function checkTouch() {
  var d = document.createElement("div");
  d.setAttribute("ontouchmove", "return;");
  return typeof d.ontouchmove === "function" ? true : false;
}

if(checkTouch()) {
  var press = "touchstart";
  var drag = "touchmove";
  var drop = "touchend";
} else {
  var press = "mousedown";
  var drag = "mousemove";
  var drop = "mouseup";
}

function initControls() {
  for(var i=0; i<piece.length; i++) { 
    piece[i].addEventListener(press, grabPiece, false);
  }
  app.addEventListener(drag, dragPiece, false);
  app.addEventListener(drop, dropPiece, false);
  app.addEventListener(drag, moveScene, false);
  app.onselectstart = function(event) { event.preventDefault(); }
  app.ontouchmove = function(event) { event.preventDefault(); }
}

function grabPiece(event) {
  if (!mouseDown && controls) {
    event.preventDefault();
    mouseDown = true;
    grabbed = this;
    console.log(this);
    grabbedID = grabbed.id.substr(-2);
    startX = event.pageX - (document.body.offsetWidth/2);
    startY = event.pageY - (document.body.offsetHeight/2);
    style = window.getComputedStyle(grabbed);
    matrix = style.getPropertyValue('-webkit-transform');
    matrixParts = matrix.split(",");
    grabbedX = parseInt(matrixParts[4]);
    grabbedY = parseInt(matrixParts[5]);
    grabbed.classList.add("grabbed");
    showMoves(grabbedID);
    highLight(grabbed, square);
  }
}

function dragPiece(event) {
  if (mouseDown && controls) {
    event.preventDefault();
    moveX = event.pageX - (document.body.offsetWidth/2);
    moveY = event.pageY - (document.body.offsetHeight/2);
    distX = moveX-startX;
    distY = moveY-startY;
    if (currentColor === "w") {
      newX  = grabbedX+distX;
      newY  = grabbedY+distY;
    } else {
      newX  = -(grabbedX+distX);
      newY  = -(grabbedY+distY);
    }
    grabbed.style.webkitTransform = "translateX(" + newX + "px) translateY(" + newY + "px) translateZ(2px)";
    highLight(grabbed, square);
  }
}

function dropPiece(event) {
  if (mouseDown && controls) {
    event.preventDefault();
    var squareEndPos = closestElement.id;
    function getMove(moveType) {
      return document.getElementById(squareEndPos).className.match(new RegExp('(\\s|^)'+moveType+'(\\s|$)'));
    }
    if ( getMove("valid") ) {
      if ( getMove("captured") ) {
        var type = chess.get(squareEndPos).type;
        var color = chess.get(squareEndPos).color;
        if (currentColor === "w") {
          createPiece(color, type, "w-jail");
        } else {
          createPiece(color, type, "b-jail");
        }
      }
      hideMoves(grabbedID);
      chess.move({ from: grabbedID, to: squareEndPos, promotion: 'q' });
    } else {
      hideMoves(grabbedID);
      grabbed.style.webkitTransform = "translateX(0px) translateY(0px) translateZ(2px)";
    }
    updateBoard();
    grabbed.classList.remove("grabbed");
    for(var i = 0; i < square.length; i++) {
      square[i].classList.remove("highlight");
    }
    mouseDown = false;
  }
}

function moveScene(event) {
  if (animated) {
    eventStartX = event.pageX - (document.body.offsetWidth/2);
    eventStartY = event.pageY - (document.body.offsetHeight/2);
  }
  eventStartX = 0;
  eventStartY = 0;
  if (!controls && !animated) {
    document.body.classList.remove("animated");
    event.preventDefault();
    eventMoveX = event.pageX - (document.body.offsetWidth/2);
    eventDistX = (eventMoveX - eventStartX);
    eventMoveY = event.pageY - (document.body.offsetHeight/2);
    eventDistY = (eventMoveY - eventStartY);
    eventX = sceneY - (eventDistX*-.03);
    eventY = sceneX - (eventDistY*-.03);
    scene.style.webkitTransform = 'RotateX('+ eventY + 'deg) RotateZ('+ eventX + 'deg)';
    for(var i=0; i<sphere.length; i++) {
      updateSphere(sphere[i],eventY,eventX);
    }
  }
}

function showMoves(Target) {
  var validMoves = chess.moves({ target: Target, verbose: true });
  for(var i=0; i<validMoves.length; i++) {
    var validMove = validMoves[i];
    var from = validMove.from;
    var to = validMove.to;
    var captured = validMove.captured;
    document.getElementById(from).classList.add("current");
    document.getElementById(to).classList.add("valid");
    if (captured) { document.getElementById(to).classList.add("captured"); }
  }
}

function hideMoves(Target) {
  var validMoves = chess.moves({ target: Target, verbose: true });
  for(var i=0; i<validMoves.length; i++) {
    var validMove = validMoves[i];
    var from = validMove.from;
    var to = validMove.to;
    document.getElementById(from).classList.remove("current");
    document.getElementById(to).classList.remove("valid");
    document.getElementById(to).classList.remove("captured");
  }
}

function createPiece(color, piece, position) {
  var clone = document.getElementById(piece).cloneNode(true);
  clone.addEventListener(press, grabPiece, false);
  clone.setAttribute("id",color+piece+position);
  if ( color === "w" ) { clone.classList.add("white"); } 
  else { clone.classList.add("black"); }
  document.getElementById(position).appendChild(clone);
}

function updateBoard() {
  var updateTiles = {};
  var inCheck = chess.in_check();
  var inCheckmate = chess.in_checkmate();
  var inDraw = chess.in_draw();
  var inStalemate = chess.in_stalemate();
  var inThreefold = chess.in_threefold_repetition();
  chess.SQUARES.forEach(function(tile) {
    var boardS = board[tile];
    var chessS = chess.get(tile);
    if (boardS && chessS) {
      if (boardS.type !== chessS.type || boardS.color !== chessS.color) {
        updateTiles[tile] = chessS;   
      }
    } else if (boardS || chessS) {
      updateTiles[tile] = chessS;
    }
    board[tile] = chessS;
  });
  for (var id in updateTiles) {
    var titleID = document.getElementById([id]);
    if (updateTiles[id] === null) {
      titleID.innerHTML = "";
    } else {
      var color = updateTiles[id].color;
      var piece = updateTiles[id].type;
      var symbol = color + piece;
      if ( currentColor === color && !titleID.hasChildNodes()) {
        createPiece(color, piece, [id]);
      } else {
        titleID.innerHTML = "";
        createPiece(color, piece, [id]);
      }
    }
  }
  var fen = chess.fen();
  currentColor = chess.turn();
  function Log(message) {
    document.getElementById("log").innerHTML = message;
  }
  if (fen !== "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    document.getElementById("undo").dataset.state="active";
  } else {
    document.getElementById("undo").dataset.state="inactive";
  }
  if (currentColor === "w") {
    inverse = 1;
    updateView(sceneX,0);
    Log(white+"'s turn");
    if (inCheck) { 
      Log(white+"'s king is in check !");
    }
    if (inCheckmate) { 
      Log(white+"'s king is in checkmate ! "+black+" wins !");
    }
  } else {
    inverse = -1;
    updateView(sceneX,180);
    Log(black+"'s turn");
    if (inCheck) { 
      Log(black+"'s king is in check !");
    }
    if (inCheckmate) { 
      Log(black+"'s king is in checkmate ! "+white+" wins");
    }
  }
}

function updateCaptured() {
  var wbPiece  = document.getElementById("board").getElementsByClassName("white");
  var bbPiece  = document.getElementById("board").getElementsByClassName("black");
  var wjPiece  = document.getElementById("w-jail").getElementsByClassName("black");
  var bjPiece  = document.getElementById("b-jail").getElementsByClassName("white");
  if (wbPiece.length+bjPiece.length !== 16) {
    var child = document.getElementById("b-jail").lastChild;
    document.getElementById("b-jail").removeChild(child);
  }
  if (bbPiece.length+wjPiece.length !== 16) {
    var child = document.getElementById("w-jail").lastChild;
    document.getElementById("w-jail").removeChild(child);
  }
}

function undoMove() {
  chess.undo();
  updateBoard();
  updateCaptured();
}

function getClosestElement(element, square) {

  function getTransVal(obj) {
    var box = obj.getBoundingClientRect();
    return {
      x : box.left,
      y : box.top,
      w : box.width,
      h : box.height
    }
  }

  var elementLeft = getTransVal(element).x + getTransVal(element).w/2;
      elementRight = elementLeft + getTransVal(element).w - getTransVal(element).w/2,
      elementTop = getTransVal(element).y + getTransVal(element).h/2,
      elementBottom = elementTop + getTransVal(element).h - getTransVal(element).h/2,
      smallestDistance = null;

  for(var i = 0; i < square.length; i++) {

    if (currentColor === "w") {
    var squareLeft = getTransVal(square[i]).x,
        squareRight = squareLeft + getTransVal(square[i]).w,
        squareTop = getTransVal(square[i]).y,
        squareBottom = squareTop + getTransVal(square[i]).h;
    } else {
    var squareLeft = getTransVal(square[i]).x + getTransVal(square[i]).w/2,
        squareRight = squareLeft + getTransVal(square[i]).w,
        squareTop = getTransVal(square[i]).y + getTransVal(square[i]).h/2,
        squareBottom = squareTop + getTransVal(square[i]).h;
    }

    var xPosition = 0,
        yPosition = 0;

    if(squareRight < elementLeft) {
      xPosition = elementLeft - squareRight;
    } else if(squareLeft > elementRight) {
      xPosition = squareLeft - elementRight;
    }
    if(squareBottom < elementTop) {
      yPosition = elementTop - squareBottom;
    } else if(squareTop > elementBottom) {
      yPosition = squareTop - elementBottom;
    }
    var valueForComparison = 0;
    if(xPosition > yPosition) {
      valueForComparison = xPosition;
    } else {
      valueForComparison = yPosition;
    }
    if(smallestDistance === null) {
      smallestDistance = valueForComparison;
      var closestElement = square[i];
    } else if(valueForComparison < smallestDistance) {
      smallestDistance = valueForComparison;
      var closestElement = square[i];
    }

  }

  return closestElement;

}

function highLight(element, square) {

  closestElement = getClosestElement(element, square);
  for(var i = 0; i < highlighted.length; i++) {
    highlighted[i].classList.remove("highlight");
  }
  closestElement.classList.add("highlight");

}

function updateView(sceneXAngle,sceneZAngle) {
  scene.style.webkitTransform = "rotateX( " + sceneXAngle + "deg) rotateZ( " + sceneZAngle + "deg)";
  setTimeout(function() {
    for(var i=0; i<sphere.length; i++) {
      updateSphere(sphere[i],sceneXAngle,sceneZAngle);
    }
  },1);
}

function updateSphere(sphere,sceneXAngle,sceneZAngle) {
  sphere.style.WebkitTransform = "rotateZ( " + ( -sceneZAngle ) + "deg ) rotateX( " + ( -sceneXAngle ) + "deg )";
}

function renderPoly() {
  var light = new Photon.Light( x = 50, y = 150, z = 250);
  var shadeAmount = 1;
  var tintAmount = 1;
  var pieces = new Photon.FaceGroup($("#container")[0], $("#container .face"), 1.6, .48, true);
  pieces.render(light, true);
}

function resetPoly() {
  for(var i = 0; i < photon.length; i++) {
    photon[i].setAttribute("style","");
  }
  if(timeOut != null) clearTimeout(timeOut);
  timeOut = setTimeout(renderPoly, 250);
}

function Continue() {
  updateBoard();
  controls = true;
  animated = true;
  document.getElementById("app").dataset.state="game";
  document.body.classList.add("animated");
}

function optionScreen() {
  updateView(sceneX,sceneY);
  controls = false;
  document.getElementById("app").dataset.state="menu";
  function setAnimated() { animated = false; }
  setTimeout(setAnimated, 2500);
}

function toggleFrame(event) {
  if (event.checked) {
    document.getElementById("app").dataset.frame="on";
  } else {
    document.getElementById("app").dataset.frame="off";
  }
  resetPoly();
}

function setState(event) {
  event.preventDefault();
  var data = this.dataset.menu;
  document.getElementById("app").dataset.menu=data;
}

function setTheme(event) {
  event.preventDefault();
  var data = this.dataset.theme;
  document.getElementById("app").dataset.theme=data;
  if (data === "classic" || data === "marble" ) { white = "White", black = "Black" }
  else if (data === "flat" || data === "wireframe" ) { white = "Blue", black = "Red" }
}

function UI() {
  var menuBtns = document.getElementsByClassName("menu-nav");
  var themeBtns = document.getElementsByClassName("set-theme");
  for(var i=0; i<menuBtns.length; i++) {
    menuBtns[i].addEventListener(press, setState, false);
  }
  for(var i=0; i<themeBtns.length; i++) {
    themeBtns[i].addEventListener(press, setTheme, false);
  }
  document.getElementById("continue").addEventListener(press, Continue, false);
  document.getElementById("open-menu").addEventListener(press, optionScreen, false);
  document.getElementById("undo").addEventListener(press, undoMove, false);
}

function leapOver(fingerPosX, fingerPosZ) {
  if (!leapDown && controls) {
    cursor.style.webkitTransform = "translateX( " + fingerPosX + "px) translateY( " + fingerPosZ + "px) translateZ( .4em)";
    var closestElement = getClosestElement(cursor, piece);
    var color = closestElement.id.charAt(0);
    if (color === currentColor) {
      highLight(cursor, piece);
      grabbed = document.getElementById(closestElement.id);
    }
  }
}

function leapGrab(fingerPosX, fingerPosZ) {
  if (!leapDown && controls) {
    startX = fingerPosX;
    startZ = fingerPosZ;
    grabbedID = grabbed.id.substr(-2);
    grabbed.classList.add("grabbed");
    showMoves(grabbedID);
    cursor.classList.add('hidden');
    console.log(grabbed);
    setTimeout(function(){
      leapDown = true;
    }, 100);
  }
}

function leapMove(fingerPosX, fingerPosZ, fingerPosY) {
  if (leapDown && controls) {
    style = window.getComputedStyle(grabbed);
    matrix = style.getPropertyValue('-webkit-transform');
    matrixParts = matrix.split(",");
    grabbedX = parseInt(matrixParts[4]);
    grabbedZ = parseInt(matrixParts[5]);
    grabbed.classList.add("grabbed");
    moveX = fingerPosX;
    moveZ = fingerPosZ;
    distX = moveX-startX;
    distZ = moveZ-startZ;
    newX  = grabbedX+distX;
    newZ  = grabbedZ+distZ;
    grabbed.style.webkitTransform = "translateX(" + newX + "px) translateY(" + newZ + "px) translateZ( 2px)";
    showMoves(grabbedID);
    highLight(grabbed, square);
  }
}

function leapDrop() {
  if (leapDown && controls) {
    var squareEndPos = closestElement.id;
    function getMove(moveType) {
      return document.getElementById(squareEndPos).className.match(new RegExp('(\\s|^)'+moveType+'(\\s|$)'));
    }
    if ( getMove("valid") ) {
      if ( getMove("captured") ) {
        var type = chess.get(squareEndPos).type;
        var color = chess.get(squareEndPos).color;
        if (currentColor === "w") {
          createPiece(color, type, "w-jail");
        } else {
          createPiece(color, type, "b-jail");
        }
      }
      hideMoves(grabbedID);
      chess.move({ from: grabbedID, to: squareEndPos, promotion: 'q' });
    } else {
      hideMoves(grabbedID);
      grabbed.style.webkitTransform = "translateX(0px) translateY(0px) translateZ(2px)";
    }
    updateBoard();
    grabbed.classList.remove("highlight");
    grabbed.classList.remove("grabbed");
    cursor.classList.remove('hidden');
    leapDown = false;
  }
}

var controller = new Leap.Controller({enableGestures:true});
var fingers = {};
var gestures = {};
var startDirection = {};
var endDirection = {};

controller.loop(function(frame) {

  // Pointables
  var fingerIds = {};
  for(var i = 0; i < 1; i++) {
    var finger = frame.pointables[i];
    if (typeof(finger) != 'undefined') {
      fingerPos.x = (finger.tipPosition[0]*4)*inverse + (document.body.offsetWidth/2);
      fingerPos.y = finger.tipPosition[1];
      fingerPos.z = (finger.tipPosition[2]*4)*inverse + (document.body.offsetWidth/2);
      leapOver(fingerPos.x, fingerPos.z);
      leapMove(fingerPos.x, fingerPos.z, fingerPos.y);
    }
    //console.log(fingerPos);
  }

  // Gestures
  if (typeof(frame.gestures) != 'undefined') {
    for (var i = 0, gestureCount = frame.gestures.length; i != gestureCount; i++) {
      var gesture = frame.gestures[i];
      var type = gesture.type;
      var state = gesture.state;
      //console.log(gesture);
      if (type === "keyTap") {
        if (state === "stop") {
          //do stuff on tap
          if (!leapDown) {
            leapGrab(fingerPos.x, fingerPos.z);
          }
          if (leapDown) {
            leapDrop();
          }
        } 
      }
      if (type === "circle") {
        if (state === "start") {
          //do stuff on tap
          // if (!leapDown) {
          //   undoMove();
          // }
          if (leapDown) {
            leapDrop();
          }
        } 
      }
    }
  }
});

function init() {
  app.classList.remove("loading");
  document.body.classList.add("animated");
  animated = true;
  updateBoard();
  Continue();
  initControls();
  UI();
  function anime() { document.getElementById("logo").innerHTML = ""; }
  setTimeout(anime, 2000);
}

window.addEventListener("resize", resetPoly, false);

var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    renderPoly();
    init();
    clearInterval(readyStateCheckInterval);
  }
}, 3250);