import { Game } from "./game";
import { EQ_GAME_PLUS, EQ_GAME_MINUS } from "./eqGame";
import { GAIN_GAME } from "./gainGame";
import { SATURATION_GAME } from "./saturationGame";
import { EQ2_GAME } from "./eq2Game";

export const GAMES: Game[] = [EQ2_GAME, EQ_GAME_PLUS, EQ_GAME_MINUS, GAIN_GAME, SATURATION_GAME];