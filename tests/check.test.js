const libraries = require('../js/libraries.js');

test('in check', () => {
  var chess = new libraries.Chess();
  chess.load("rnbkqb1r/ppp1ppp1/5n1p/8/2B5/8/PPPQ1PPP/RNBK2NR b KQkq - 0 1");
  expect(chess.in_check()).toBe(true);
//  console.log(chess.ascii());
});

test('discovered check', () => {
  var chess = new libraries.Chess();
  chess.load("4k3/8/8/8/8/8/4K3/4Q3 w KQkq - 0 1");
  expect(chess.in_check()).toBe(false);
  chess.move({from: 'e2', to: 'd2',});
  expect(chess.in_check()).toBe(true);
//  console.log(chess.ascii());
});

test('double check', () => {
  var chess = new libraries.Chess();
  chess.load("RNBK1B1R/PP3PPP/2P5/4Q1b1/4N3/8/ppp2ppp/2kr1bnr w KQkq - 0 1");
  expect(chess.in_check()).toBe(true);
  chess.move({from: 'd8', to: 'c7',});
  expect(chess.in_check()).toBe(false);
//  console.log(chess.ascii());
});

test('cross check', () => {
  var chess = new libraries.Chess();
  chess.load("R3Q2R/PP2KPPP/N1P5/8/2p3Q1/2p4n/p1q1kppp/r3r3 b KQkq - 0 1");
  expect(chess.in_check()).toBe(true);
  chess.move({from: 'e2', to: 'd2',});
  expect(chess.in_check()).toBe(true);
//  console.log(chess.ascii());
});

