const libraries = require('../js/libraries.js');

test("check if valid move increments turn counter", () => {
    var chess = new libraries.Chess();
    chess.move({from:"a2",to:"a3"});
    expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 1 1");
    expect(chess.turn()).toBe("b");
});

test("check if piece capture increments turn counter", () => {
    var chess = new libraries.Chess();
    chess.load("3q3k/pp2b1pp/8/2P5/1P2RBQ1/2P5/P4rPp/7K w - - 5 10");
    chess.move({from:"h1",to:"h2"});
    expect(chess.fen()).toBe("3q3k/pp2b1pp/8/2P5/1P2RBQ1/2P5/P4rPK/8 b - - 6 10");
    expect(chess.turn()).toBe("b");
});

test("check if invalid move increments turn counter", () => {
    var chess = new libraries.Chess();
    chess.load("3q3k/pp2b1pp/8/2P5/1P2RBQ1/2P5/P4rPp/7K w - - 5 10");
    chess.move({from:"h1",to:"h3"});
    expect(chess.fen()).toBe("3q3k/pp2b1pp/8/2P5/1P2RBQ1/2P5/P4rPp/7K w - - 5 10");
    expect(chess.turn()).toBe("w");
});

test("check if multiple moves increments counter", () => {
    var chess = new libraries.Chess();
    chess.load("3q3k/pp2b1pp/8/2P5/1P2RBQ1/2P5/P4rPp/7K w - - 5 10");
    chess.move({from:"h1",to:"h2"});
    chess.move({from:"f2",to:"f1"});
    chess.move({from:"h2",to:"h1"});
    chess.move({from:"f1",to:"f2"});
    expect(chess.fen()).toBe("3q3k/pp2b1pp/8/2P5/1P2RBQ1/2P5/P4rPp/7K w - - 9 12");
    expect(chess.turn()).toBe("w");
});

test("check if multiple moves plus invalid moves increments counter", () => {
    var chess = new libraries.Chess();
    chess.load("3q3k/pp2b1pp/8/2P5/1P2RBQ1/2P5/P4rPp/7K w - - 5 10");
    chess.move({from:"h1",to:"h2"});
    chess.move({from:"f2",to:"f1"});
    chess.move({from:"h2",to:"h1"});
    chess.move({from:"a2",to:"a1"});
    chess.move({from:"f1",to:"f2"});
    chess.move({from:"e6",to:"h6"});
    expect(chess.fen()).toBe("3q3k/pp2b1pp/8/2P5/1P2RBQ1/2P5/P4rPp/7K w - - 9 12");
    expect(chess.turn()).toBe("w");
});