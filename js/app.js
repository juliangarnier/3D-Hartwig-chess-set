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
var app = document.getElementById("app");
var scene = document.getElementById("scene");
var sceneX = 70;
var sceneY = 90;
var controls = false;
var animated = false;
var mouseDown = false;
var closestElement = null;
var white = "White";
var black = "Black";

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
    grabbedID = grabbed.id.substr(-2);
    startX = event.pageX - (document.body.offsetWidth/2);
    startY = event.pageY - (document.body.offsetHeight/2);
    style = window.getComputedStyle(grabbed);
    matrix = style.getPropertyValue('-webkit-transform');
    matrixParts = matrix.split(",");
    grabbedW = parseInt(style.getPropertyValue('width'))/2;
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
    updateView(0,0);
    Log(white+"'s turn");
    if (inCheck) { 
      Log(white+"'s king is in check !");
    }
    if (inCheckmate) { 
      Log(white+"'s king is in checkmate ! "+black+" wins !");
    }
  } else {
    updateView(0,180);
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

function highLight(element, square) {

  function winPos(obj) {
    var box = obj.getBoundingClientRect();
    return {
      x : box.left,
      y : box.top
    }
  }

  var elementLeft = winPos(element).x + grabbedW;
      elementRight = elementLeft + element.offsetWidth - grabbedW,
      elementTop = winPos(element).y + grabbedW,
      elementBottom = elementTop + element.offsetHeight - grabbedW,
      smallestDistance = null;

  for(var i = 0; i < square.length; i++) {


    if (currentColor === "w") {
    var squareLeft = winPos(square[i]).x,
        squareRight = squareLeft + square[i].offsetWidth,
        squareTop = winPos(square[i]).y,
        squareBottom = squareTop + square[i].offsetHeight;
    } else {
    var squareLeft = winPos(square[i]).x + grabbedW,
        squareRight = squareLeft + square[i].offsetWidth,
        squareTop = winPos(square[i]).y + grabbedW,
        squareBottom = squareTop + square[i].offsetHeight;
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
      closestElement = square[i];
    } else if(valueForComparison < smallestDistance) {
      smallestDistance = valueForComparison;
      closestElement = square[i];
    }
  }

  for(var i = 0; i < square.length; i++) {
    square[i].classList.remove("highlight");
  }

  closestElement.classList.add("highlight");
  targetX = closestElement.offsetLeft;
  targetY = closestElement.offsetTop;

}

function updateView(sceneXAngle,sceneZAngle) {
  scene.style.webkitTransform = "rotateX( " + sceneXAngle + "deg) rotateZ( " + sceneZAngle + "deg)";
  for(var i=0; i<sphere.length; i++) {
    updateSphere(sphere[i],sceneXAngle,sceneZAngle);
  }
}

function updateSphere(sphere,sceneXAngle,sceneZAngle) {
  sphere.style.WebkitTransform = "rotateZ( " + ( - sceneZAngle ) + "deg ) rotateX( " + ( - sceneXAngle ) + "deg )";
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

function init() {
  app.classList.remove("loading");
  document.body.classList.add("animated");
  animated = true;
  updateBoard();
  optionScreen();
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