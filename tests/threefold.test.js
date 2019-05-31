const libraries = require('../js/libraries.js');

// --- THREEFOLD REPETITION --

//the same two pieces on black and white's sides are moved back and forth three times
//should result in a draw

test("Testing draw by same moves and position",() => {
    var chess = new libraries.Chess();
    chess.load("8/pp3p1k/2p2q1p/3r1P2/5R2/7P/P1P1QP2/7K b - - 60 30");
    expect(chess.in_threefold_repetition()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    chess.move({from:"f6",to:"e5"});
    chess.move({from:"e2",to:"h5"});
    chess.move({from:"e5",to:"f6"});
    chess.move({from:"h5",to:"e2"});
    chess.move({from:"f6",to:"e5"});
    chess.move({from:"e2",to:"h5"});
    chess.move({from:"e5",to:"f6"});
    chess.move({from:"h5",to:"e2"});
    chess.move({from:"f6",to:"e5"});
    chess.move({from:"e2",to:"h5"});
    chess.move({from:"e5",to:"f6"});
    chess.move({from:"h5",to:"e2"});
    expect(chess.in_threefold_repetition()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

//different pieces on each side are moved back and forth one time each, totaling to 3 repeated movements
//should result in a draw

test("Testing draw by same position only",() => {
    var chess = new libraries.Chess();
    chess.load("8/pp3p1k/2p2q1p/3r1P2/5R2/7P/P1P1QP2/7K b - - 60 30");
    expect(chess.in_threefold_repetition()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    chess.move({from:"f6",to:"e5"});
    chess.move({from:"e2",to:"h5"});
    chess.move({from:"e5",to:"f6"});
    chess.move({from:"h5",to:"e2"});
    chess.move({from:"d5",to:"e5"});
    chess.move({from:"e2",to:"d3"});
    chess.move({from:"e5",to:"d5"});
    chess.move({from:"d3",to:"e2"});
    chess.move({from:"f6",to:"e7"});
    chess.move({from:"e2",to:"d2"});
    chess.move({from:"e7",to:"f6"});
    chess.move({from:"d2",to:"e2"});
    expect(chess.in_threefold_repetition()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

//different pieces on each side are moved back and forth, totaling to 4 repeated movements
//should result in a draw

test("Testing draw by same position but more than 3 moves for threefold repetition",() => {
    var chess = new libraries.Chess();
    chess.load("8/pp3p1k/2p2q1p/3r1P2/5R2/7P/P1P1QP2/7K b - - 60 30");
    expect(chess.in_threefold_repetition()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    chess.move({from:"f6",to:"e5"});
    chess.move({from:"e2",to:"h5"});
    chess.move({from:"d5",to:"d4"});
    chess.move({from:"h1",to:"h2"});
    chess.move({from:"d4",to:"d5"});
    chess.move({from:"h2",to:"h1"});
    chess.move({from:"e5",to:"f6"});
    chess.move({from:"h5",to:"e2"});
    chess.move({from:"d5",to:"e5"});
    chess.move({from:"e2",to:"d3"});
    chess.move({from:"e5",to:"d5"});
    chess.move({from:"d3",to:"e2"});
    chess.move({from:"f6",to:"e7"});
    chess.move({from:"e2",to:"d2"});
    chess.move({from:"e7",to:"f6"});
    chess.move({from:"d2",to:"e2"});
    expect(chess.in_threefold_repetition()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

//the same two pieces on each side are moved back and forth two times
//should not result in a draw

test("Testing draw by only twofold repetition",() => {
    var chess = new libraries.Chess();
    chess.load("5k2/p4p2/1p2q3/5RQp/6k1/4P3/PP6/6K1 w - - 30 15");
    expect(chess.in_threefold_repetition()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    chess.move({from:"f5",to:"f3"});
    chess.move({from:"e6",to:"e5"});
    chess.move({from:"f3",to:"f5"});
    chess.move({from:"e5",to:"e6"});
    chess.move({from:"f5",to:"f3"});
    chess.move({from:"e6",to:"e5"});
    chess.move({from:"f3",to:"f5"});
    chess.move({from:"e5",to:"e6"});
    expect(chess.in_threefold_repetition()).toBe(false);
    expect(chess.in_draw()).toBe(false);
});

//completely random movements
//should not result in a draw

test("Testing draw by random movement", () => {
    var chess = new libraries.Chess();
    chess.load("8/pp4P1/8/8/1kp2N2/1n2R1P1/3r4/1K6 w - - 30 15");
    expect(chess.in_threefold_repetition()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    chess.move({from:"f4",to:"e6"});
    chess.move({from:"d2",to:"d8"});
    chess.move({from:"g3",to:"g4"});
    chess.move({from:"b3",to:"c5"});
    chess.move({from:"b1",to:"a2"});
    chess.move({from:"b4",to:"a4"});
    chess.move({from:"e6",to:"g5"});
    chess.move({from:"c4",to:"c3"});
    expect(chess.in_threefold_repetition()).toBe(false);
    expect(chess.in_draw()).toBe(false);
});