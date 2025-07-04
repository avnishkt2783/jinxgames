import SoloMatch from '../models/solomatch/soloMatch.js';
import Game from '../models/game/game.js';
import dotenv from 'dotenv'
dotenv.config()

export const recordSoloMatch = async (req, res) => {
  const { gameId, startTime, endTime, score, outcome, metadata } = req.body;
  const userId = req.user.id; 

  try {
    const match = await SoloMatch.create({
      userId,
      gameId,
      startTime,
      endTime,
      score,
      outcome,
      metadata,
    });

    res.status(201).json(match);
  } catch (err) {
    console.error("Error recording match:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const getUserSoloMatches = async (req, res) => {
  const userId = req.user.id;

  try {
    const matches = await SoloMatch.findAll({
      where: { userId },
      include: [Game],
      order: [['startTime', 'DESC']] 
    });

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Failed to fetch solo matches." });
  }
};

export const getHighScoreForGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    const topMatch = await SoloMatch.findOne({
      where: { gameId },
      order: [['score', 'DESC']],
    });

    res.status(200).json({
      highScore: topMatch?.score || 0,
      userId: topMatch?.userId || null,
    });
  } catch (error) {
    console.error("Error fetching high score:", error);
    res.status(500).json({ error: "Failed to fetch high score." });
  }
};
