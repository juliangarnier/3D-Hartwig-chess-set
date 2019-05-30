const libraries = require('../js/libraries.js');

test('undo move from starting state', () => {
	//Undoing a move from the starting state should have no effect
  var chess = new libraries.Chess();
  chess.undo();
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});

test('single undo move', () => {
	//Single undo move, should switch player turns and pieces accordingly
  var chess = new libraries.Chess();
  chess.load("RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbkqbnr b KQkq - 0 1");
  chess.move({from: 'b1', to: 'c3',});
  expect(chess.fen()).toBe("RNBQKBNR/PPPPPPPP/8/8/8/2n5/pppppppp/r1bkqbnr w KQkq - 1 2");
  chess.undo();
  expect(chess.fen()).toBe("RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbkqbnr b KQkq - 0 1");
});

test('multiple undo moves', () => {
	//Doing multple undo moves should be possible and switch player turns accordingly
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
  //console.log(chess.ascii());
});

test('undo move from checkmate state', () => {
	//Should be able to undo move after confirming checkmate state
  var chess = new libraries.Chess();
  chess.load("3K4/2q5/3k4/8/8/8/8/8 b KQkq - 0 1");
	chess.move({from: 'c7', to: 'd7',});
  expect(chess.in_checkmate()).toBe(true);
	chess.undo();
  expect(chess.fen()).toBe("3K4/2q5/3k4/8/8/8/8/8 b KQkq - 0 1");
  expect(chess.in_checkmate()).toBe(false);
});

test('undo move after resetting', () => {
	//Should return to starting state and undoing moves would have no effect
  var chess = new libraries.Chess();
  chess.load("3K4/2q5/3k4/8/8/8/8/8 b KQkq - 0 1");
	chess.move({from: 'c7', to: 'd7',});
	chess.reset();
	chess.undo();
  expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});
