3D Hartwig chess set 
====================

3D chess game done in HTML/CSS/JS.
Works only in webkit.

See it in action : http://codepen.io/juliangarnier/full/BsIih

Tests

* To run tests: "npm run test"
* To run tests with coverage (requires Jest CLI): "jest --coverage"


Libraries

* Photon : http://photon.attasi.com
* Chess.js : https://github.com/jhlywa/chess.js

**FOR GRADERS**
**FEN STRING DESCRIPTION**
=====================

The fen string is a string delimited by spaces which represents a game state. The fen string is broken into 6 segments:
* Segment 1 is the position of the pieces
* Segment 2 represents which player is currently taking their turn
* Segment 3 represents the whether castling is allowed for each player
* Segment 4 represents the current 'en passant' squares
* Segment 5 is the current number of 'half moves'
* Segment 6 is which move number the game is currently on

Segment 1 is structured line by line, with each line separated by a /
The squares are traversed from 1 to 8 in each line, and the lines are traversed from H to A.
The pieces are represented by a single letter each:
p for pawns
r for rooks
n for knights
b for bishops
q for queens
k for kings
The lowercase letters are black's pieces and the uppercase are white's.
Blank squares are stored as numbers which represent how many blank squares occur sequentially.

Segment 2 is a single character which corresponds to which player's turn it is: w for white or b for black.

Segment 3 is anywhere from 1 to 4 characters long and represents whether either play may castle now or in the future.
This is represented by a letter for each valid castling possibility, either k for king-side or q for queen-side with the uppercase being white's and the lowercase being black's.
The existence of this letter in the fen string indicates that castling is possible, if it is not possible, the letter will be omitted.

Segment 4 stores all of the squares where a pawn may be captured 'en passant', a concept which is best explained by diagrams and so will be omitted here.
If no pawns may be captured in this manner, this section will be a single '-' character.

Segment 5 is a number which counts how many 'half moves' have occurred this game.
A half move is a single move from one player.
This number begins at 0.

Segment 6 is a number representing the turn number the game is on. This number begins at 1.

**EXAMPLE**

Consider the fen string:

3q3k/pp2b1pp/8/2P5/1P2RBQ1/2P5/P4rPp/7K w - - 10 5

The fen string can be broken down into the 6 segments with a space as the delimiter.

Segment 1: 3q3k/pp2b1pp/8/2P5/1P2RBQ1/2P5/P4rPp/7K
Segment 2: w
Segment 3: -
Segment 4: - 
Segment 5: 5
Segment 6: 10

The information in each segment is interpreted as:

Segment 1: The first row has 3 empty spaces, a black queen, three more empty spaces and a black knight
           The second row has 2 black pawns, 2 empty spaces, 1 black bishop, 1 empty space, and 2 more black pawns
           The third row has no pieces
           ....
           The eighth row has 7 empty spaces and the white king.
           A visual representation of the board can be seen below:
           
       +------------------------+
     8 | .  .  .  q  .  .  .  k |
     7 | p  p  .  .  b  .  p  p |
     6 | .  .  .  .  .  .  .  . |
     5 | .  .  P  .  .  .  .  . |
     4 | .  P  .  .  R  B  Q  . |
     3 | .  .  P  .  .  .  .  . |
     2 | P  .  .  .  .  r  P  p |
     1 | .  .  .  .  .  .  .  K |
       +------------------------+
         a  b  c  d  e  f  g  h

Segment 2: it is white's turn
Segment 3: no castling is possible
Segment 4: no en passant captures are possible
Segment 5: 10 half turns have passed (meaning black and white have moved 5 times each)
Segment 6: it is turn 5

