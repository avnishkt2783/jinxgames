import Game from '../models/game/game.js';

export const getAllGames = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const offset = parseInt(req.query.offset) || 0;

        const { count, rows } = await Game.findAndCountAll({
          limit,
          offset,
          order: [['gameId', 'ASC']]
      });

      res.json({ games: rows, total: count });
    } catch (err) {
        res.status(500).json({ error88: "Failed to fetch games" });
    }
};

//create the game
export const createGame = async (req, res) => {
    try {
      const { gameName, gameImg, gameDesc, gameRoute } = req.body;
  
      // Check if the game already exists
      const existingGame = await Game.findOne({ where: { gameName } });
      if (existingGame) {
        return res.status(400).json({ error: "Game already exists" });
      }
  
      const newGame = await Game.create({
        gameName,
        gameImg,
        gameDesc,
        gameRoute,
        timesPlayed: 0
      });
  
      res.status(201).json({
        message: "Game added successfully",
        game: newGame
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to add game" });
    }
  };

// --------------------------------------------------------------------------------
// CREATE GAME COMMENTS
// POST 'http://localhost:3000/api/games'
// 
// headers-> 
// 'Content-Type': 'application/json',
// 
// body: JSON ->
// {
//   "gameName": "Flappy Bird",
//   "gameImg": "/flappybirdImage.png",
//   "gameDesc": "Tap to flap and avoid pipes. How far can you go?",
//   "gameRoute": "/flappybird"
// }
    
// --------------------------------------------------------------------------------
// GET GAMES
// GET 'http://localhost:3000/api/games'
// 
// {
//   "games": [
//       {
//           "gameId": 1,
//           "gameName": "Memory Game",
//           "gameImg": "http://localhost:5173/memoryImage.png",
//           "gameDesc": "Test Your Memory by identifying the sequence",
//           "timesPlayed": 3,
//           "gameRoute": "/memory",
//           "createdAt": "2025-04-21T10:41:33.000Z",
//           "updatedAt": "2025-04-22T02:12:14.000Z"
//       },
//       {
//           "gameId": 2,
//           "gameName": "Rock Paper Scissor",
//           "gameImg": "http://localhost:5173/rpsImage.png",
//           "gameDesc": "A Classic hand-game simulation played against computer (randomly).",
//           "timesPlayed": 4,
//           "gameRoute": "/rps",
//           "createdAt": "2025-04-21T10:45:39.000Z",
//           "updatedAt": "2025-04-22T02:19:13.000Z"
//       },
//       {
//           "gameId": 3,
//           "gameName": "Flappy Bird",
//           "gameImg": "/flappybirdImage.png",
//           "gameDesc": "Tap to flap and avoid pipes. How far can you go?",
//           "timesPlayed": 0,
//           "gameRoute": "/flappybird",
//           "createdAt": "2025-04-22T02:50:29.000Z",
//           "updatedAt": "2025-04-22T02:50:29.000Z"
//       },
//       {
//           "gameId": 4,
//           "gameName": "Hangman",
//           "gameImg": "/hangmanImage.png",
//           "gameDesc": "Guess the word before the stickman meets his fate!",
//           "timesPlayed": 0,
//           "gameRoute": "/hangman",
//           "createdAt": "2025-04-22T02:51:16.000Z",
//           "updatedAt": "2025-04-22T02:51:16.000Z"
//       }
//   ],
//   "total": 4
// }
// --------------------------------------------------------------------------------

// Increment times played
export const playGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).send("Game not found");

    game.timesPlayed += 1;
    await game.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
