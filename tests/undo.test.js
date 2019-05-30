const libraries = require('../js/libraries.js');

test('undo moves', () => {
  var chess = new libraries.Chess();
  chess.load("RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbkqbnr b KQkq - 0 1");
  chess.move({from: 'b1', to: 'c3',});
  chess.move({from: 'g8', to: 'f6',});
  chess.move({from: 'c3', to: 'd5',});
  expect(chess.fen()).toBe("RNBQKB1R/PPPPPPPP/5N2/3n4/8/8/pppppppp/r1bkqbnr w KQkq - 3 3");
  chess.undo();
  chess.undo();
  chess.undo();
  expect(chess.fen()).toBe("RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbkqbnr b KQkq - 0 1");
//  console.log(chess.ascii());
});

