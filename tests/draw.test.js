const libraries = require('../js/libraries.js');


test("Test for stalemate situations", () => {
  var chess = new libraries.Chess();
  chess.load("8/1k6/8/4r3/8/2q5/8/3K4 w - - 51 26");
  expect(chess.in_draw()).toBe(true);

});

test("Test for threefold repetition of a position ", () => {

  var chess = new libraries.Chess();
  chess.move({from:"b1",to:"c3"});
  chess.move({from:"b8",to:"c6"});
  chess.move({from:"c3",to:"b1"});
  chess.move({from:"c6",to:"b8"});
  chess.move({from:"b1",to:"c3"});
  chess.move({from:"b8",to:"c6"});
  chess.move({from:"c3",to:"b1"});
  chess.move({from:"c6",to:"b8"});
  chess.move({from:"b1",to:"c3"});
  chess.move({from:"b8",to:"c6"});
  chess.move({from:"c3",to:"b1"});
  chess.move({from:"c6",to:"b8"});

  expect(chess.in_draw()).toBe(true);

});

test("Test for no checkmate possibilities ", () => {

  var chess = new libraries.Chess();
  chess.load("8/3k4/8/8/8/8/3K4/8 w - - 51 26");
  expect(chess.in_draw()).toBe(true);

});

test("Test at start position" ,() => {
  var chess = new libraries.Chess();
  expect(chess.in_draw()).toBe(false);

});


test("Test for half moves" ,() => {
  var chess = new libraries.Chess();
  chess.load("2k5/p4b2/1p1r2N1/5B2/P6p/3K1q2/1PP5/R7 w - - 100 26");
  expect(chess.in_draw()).toBe(true);

});
