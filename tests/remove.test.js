
const libraries = require('../js/libraries.js');



test("Test to remove pawn from the board", () => {

  var chess = new libraries.Chess();
  chess.remove("e2");
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1");
});

test("Test to remove rook from the board", () => {

  var chess = new libraries.Chess();
  chess.remove("a1");
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR w KQkq - 0 1");
});


test("Test to remove knight from the board", () => {

  var chess = new libraries.Chess();
  chess.remove("b1");
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R1BQKBNR w KQkq - 0 1");
});

test("Test to remove bishop from the board", () => {

  var chess = new libraries.Chess();
  chess.remove("c1");
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RN1QKBNR w KQkq - 0 1");
});

test("Test to remove queen from the board", () => {

  var chess = new libraries.Chess();
  chess.remove("d8");
  expect(chess.fen()).toBe("rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});
