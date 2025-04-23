import express from 'express';
import { createUser, loginUser, logoutUser, getUserProfile } from '../controllers/userController.js';
import { createGame, getAllGames, playGame  } from '../controllers/gameController.js';
import { recordSoloMatch, getUserSoloMatches, getHighScoreForGame } from "../controllers/soloMatchController.js";

const routes = express.Router();

routes.post('/register', createUser);
routes.post('/login', loginUser);
routes.post('/logout/:userName', logoutUser);
routes.get('/user/profile', getUserProfile);

routes.post('/games', createGame); 
routes.get('/games', getAllGames); 

routes.post('/games/:id/play', playGame);

routes.post("/solomatches", recordSoloMatch);
routes.get("/solomatches/user", getUserSoloMatches);
routes.get("/solomatches/highscore/:gameId", getHighScoreForGame);

export default routes;
