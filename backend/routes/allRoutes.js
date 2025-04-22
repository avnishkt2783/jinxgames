import express from 'express';
import { createUser, loginUser, logoutUser, getUserProfile } from '../controllers/userController.js';
import { createGame, getAllGames, playGame  } from '../controllers/gameController.js';
import { recordSoloMatch, getUserSoloMatches } from "../controllers/soloMatchController.js";

const routes = express.Router();

routes.post('/register', createUser);
routes.post('/login', loginUser);
routes.post('/logout/:userName', logoutUser);
routes.get('/user/profile', getUserProfile);

routes.post('/games', createGame); // POST /api/games
routes.get('/games', getAllGames); // POST /api/games

routes.post('/games/:id/play', playGame);

routes.post("/solomatches", recordSoloMatch);
routes.get("/solomatches/user", getUserSoloMatches);

export default routes;
