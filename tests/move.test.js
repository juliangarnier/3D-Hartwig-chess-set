const libraries = require('../js/libraries.js');

test("Test moving white's queen pawn one square", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.move({from:"d2",to:"d3"});  //move queen's pawn one square
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/3P4/PPP1PPPP/RNBQKBNR b KQkq - 0 1");
});

test("Test for illegal move", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.move({from:"a1",to:"a3"});  //move rook through a pawn
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});

test("Test moving wrong color", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.move({from:"a7",to:"a6"});  //move black pawn forward
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});

test("Test for capture", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.move({from:"d2",to:"d3"});  //move white queen pawn forward
  chess.move({from:"h7",to:"h6"});  //move black rook pawn forward
  chess.move({from:"c1",to:"h6"});  //capture pawn with bishop
  expect(chess.fen()).toBe("rnbqkbnr/ppppppp1/7B/8/8/3P4/PPP1PPPP/RN1QKBNR b KQkq - 0 2");
});

test("Test for promotion to queen", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.load("4k3/1P6/8/8/8/8/8/4K3 w - - 50 26");
  chess.move({from:"b7",to:"b8",promotion:"q"});  //promote pawn to queen
  expect(chess.fen()).toBe("1Q2k3/8/8/8/8/8/8/4K3 b - - 0 26");
});

test("Test for promotion to rook", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.load("4k3/1P6/8/8/8/8/8/4K3 w - - 50 26");
  chess.move({from:"b7",to:"b8",promotion:"r"});  //promote pawn to rook
  expect(chess.fen()).toBe("1R2k3/8/8/8/8/8/8/4K3 b - - 0 26");
});

test("Test for promotion to bishop", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.load("4k3/1P6/8/8/8/8/8/4K3 w - - 50 26");
  chess.move({from:"b7",to:"b8",promotion:"b"});  //promote pawn to bishop
  expect(chess.fen()).toBe("1B2k3/8/8/8/8/8/8/4K3 b - - 0 26");
});

test("Test for promotion to knight", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.load("4k3/1P6/8/8/8/8/8/4K3 w - - 50 26");
  chess.move({from:"b7",to:"b8",promotion:"n"});  //promote pawn to knight
  expect(chess.fen()).toBe("1N2k3/8/8/8/8/8/8/4K3 b - - 0 26");
});
