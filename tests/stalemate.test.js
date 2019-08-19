
const libraries = require('../js/libraries.js');
// --- STALEMATE ---

//multiple valid stalemate positions are tested

test("Testing stalemate positions", () =>{
    var chess = new libraries.Chess();
    chess.load("5k2/5P2/5K2/8/8/8/8/8 b - - 30 15");
    expect(chess.in_stalemate()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

test("Testing stalemate positions", () =>{
    var chess = new libraries.Chess();
    chess.load("kb5R/8/1K6/8/8/8/8/8 b - - 30 15");
    expect(chess.in_stalemate()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

test("Testing stalemate positions", () =>{
    var chess = new libraries.Chess();
    chess.load("8/8/8/8/8/2k5/1r6/K7 w - - 30 15");
    expect(chess.in_stalemate()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

test("Testing stalemate positions", () =>{
    var chess = new libraries.Chess();
    chess.load("K7/p7/k7/8/5b2/8/8/8 w - - 30 15");
    expect(chess.in_stalemate()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

//multiple invalid stalemate positions are tested

test("Testing stalemate positions", () =>{
    var chess = new libraries.Chess();
    chess.load("K7/p7/k7/8/5b2/8/8/8 b - - 30 15");
    expect(chess.in_stalemate()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    expect(chess.game_over()).toBe(false);
});

test("Testing stalemate positions", () =>{
    var chess = new libraries.Chess();
    chess.load("8/8/8/6K1/8/1Q6/p7/k7 w - - 30 15");
    expect(chess.in_stalemate()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    expect(chess.game_over()).toBe(false);
});

test("Testing stalemate positions", () =>{
    var chess = new libraries.Chess();
    chess.load("8/1kbpq3/pppp4/8/8/4N3/PPPP1P2/KRQ4R w - - 30 15");
    expect(chess.in_stalemate()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    expect(chess.game_over()).toBe(false);
});

//multiple invalid stalemate positions are tested, then a series of movements
//is executed so that the position becomes a stalemate, and is then tested again

test("Testing move into stalemate", () =>{
    var chess = new libraries.Chess();
    chess.load("8/6p1/5p2/5P1K/4k2P/8/8/8 b - - 30 15");
    expect(chess.in_stalemate()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    chess.move({from:"e4",to:"f5"});
    expect(chess.in_stalemate()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

test("Testing move into stalemate", () =>{
    var chess = new libraries.Chess();
    chess.load("1R6/8/8/5k2/5p2/1p5r/4K3/8 b - - 30 15");
    expect(chess.in_stalemate()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    chess.move({from:"b3",to:"b2"});
    chess.move({from:"b8",to:"b2"});
    chess.move({from:"h3",to:"h2"});
    expect(chess.in_stalemate()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    chess.move({from:"e2",to:"f3"});
    chess.move({from:"h2",to:"b2"});
    expect(chess.in_stalemate()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

test("Testing move into stalemate", () =>{
    var chess = new libraries.Chess();
    chess.load("8/8/PR6/5k2/8/5PK1/r7/8 w - - 30 15");
    expect(chess.in_stalemate()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    chess.move({from:"b6",to:"c6"});
    chess.move({from:"f5",to:"g5"});
    expect(chess.in_stalemate()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    chess.move({from:"g3",to:"h3"});
    chess.move({from:"g5",to:"h5"});
    expect(chess.in_stalemate()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    chess.move({from:"f3",to:"f4"});
    chess.move({from:"a2",to:"a6"});
    chess.move({from:"c6",to:"a6"});
    expect(chess.in_stalemate()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});