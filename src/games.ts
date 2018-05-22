import { Game } from "./game";
import { EQ_GAME_PLUS, EQ_GAME_MINUS } from "./eqGame";
import { GAIN_GAME } from "./gainGame";
import { SATURATION_GAME } from "./saturationGame";
import { GRAPHIC_EQ_GAME } from "./graphicEqGame";

export const GAMES: Game[] = [EQ_GAME_PLUS, EQ_GAME_MINUS, GRAPHIC_EQ_GAME, GAIN_GAME, SATURATION_GAME];