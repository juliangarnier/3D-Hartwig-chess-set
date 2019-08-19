const libraries = require('../js/libraries.js');

// --- INSUFFICIENT MATERIAL ---

test("Testing draw by kings only",() => {
    var chess = new libraries.Chess();
    chess.load("8/8/5k2/8/8/2K5/8/8 b - - 30 15");
    expect(chess.insufficient_material()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

test("Testing draw by kings and one bishop", () => {
    var chess = new libraries.Chess();
    chess.load("8/4b3/5k2/8/8/2K5/8/8 b - - 30 15");
    expect(chess.insufficient_material()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

test("Testing draw by kings and one bishop on each side", () => {
    var chess = new libraries.Chess();
    chess.load("8/4b3/5k2/8/8/2K5/8/1B6 b - - 30 15");
    expect(chess.insufficient_material()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

test("Testing draw by kings and multiple same colored bishops on each side", () => {
    var chess = new libraries.Chess();
    chess.load("3b4/4b3/5k2/8/8/2K5/2B5/1B6 b - - 30 15");
    expect(chess.insufficient_material()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

test("Testing draw by kings and one horse", () => {
    var chess = new libraries.Chess();
    chess.load("8/4n3/5k2/8/8/2K5/8/8 b - - 30 15");
    expect(chess.insufficient_material()).toBe(true);
    expect(chess.in_draw()).toBe(true);
    expect(chess.game_over()).toBe(true);
});

test("Testing draw by single rook (should be false)", () => {
    var chess = new libraries.Chess();
    chess.load("8/4r3/5k2/8/8/2K5/8/8 b - - 30 15");
    expect(chess.insufficient_material()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    expect(chess.game_over()).toBe(false);
});

test("Testing draw by pawns (should be false)", () => {
    var chess = new libraries.Chess();
    chess.load("8/4p3/5k2/8/8/2K5/6P1/8 b - - 30 15");
    expect(chess.insufficient_material()).toBe(false);
    expect(chess.in_draw()).toBe(false);
    expect(chess.game_over()).toBe(false);
});
