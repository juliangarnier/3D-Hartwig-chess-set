const libraries = require('../js/libraries.js');

test("Testing reset on a normal board", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.load("rnbqkbnr/pppppppp/8/8/8/3P4/PPP1PPPP/RNBQKBNR b KQkq - 0 1");
  chess.reset();
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});


test("Test reset from checkmate", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.load("k4R2/ppppp3/8/2b5/2P1P3/3P4/3K4/8 b - - 51 26");  //load a checkmate board state
  chess.reset();
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});

test("Test reset from blank board", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.load("8/8/8/8/8/8/8/8 w KQkq - 0 1"); //load blank board
  chess.reset();
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});

test("Test reset from bord with excess pawns", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.load("rnbqkbnr/pppppppp/pppppppp/8/8/PPPPPPPP/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  chess.reset();
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});

test("Test reset from bord with excess kings", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.load("rnbkkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBKKBNR w KQkq - 0 1");
  chess.reset();
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});

test("Test reset from starting position", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.reset();
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});
