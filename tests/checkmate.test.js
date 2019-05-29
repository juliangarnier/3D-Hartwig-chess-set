const libraries = require('../js/libraries.js');

test("Test for checkmate after board initialization", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  expect(chess.in_checkmate()).toBe(false);
});

test("Test for scholar's mate", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.move({from:"e2",to:"e3"});
  chess.move({from:"h7",to:"h5"});
  chess.move({from:"f1",to:"c4"});
  chess.move({from:"a7",to:"a5"});
  chess.move({from:"d1",to:"h5"});
  chess.move({from:"a8",to:"a6"});
  chess.move({from:"h5",to:"f7"});
  expect(chess.in_checkmate()).toBe(true);
});

test("Test for smothered mate", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.load("k4R2/ppppp3/8/2b5/2P1P3/3P4/3K4/8 b - - 51 26");
  expect(chess.in_checkmate()).toBe(true);
});

test("Test for normal checkmate", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.load("2k5/p4b2/1p1r2N1/5B2/P6p/3K1q2/1PP5/R7 w - - 50 26");
  expect(chess.in_checkmate()).toBe(true);
});

test("Test for checkmate when in check", () => {
  var chess = new libraries.Chess();  //initalize the chess object
  chess.load("2k5/p7/1p1r2N1/5B2/P6p/3K1q2/1PP5/R7 w - - 50 26");
  expect(chess.in_checkmate()).toBe(false);
});
