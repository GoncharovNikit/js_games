import Game from "./models/Game.js";
import {
    InitBorderEvents,
    InitField,
    RenderField,
} from "./controllers/FieldController.js";
import { RenderPlayers } from "./views/RenderPlayersView.js"
import { InitBtnStartEvents } from "./controllers/GameController.js";

InitField();

export const init_game = (game_type) => {
    Game.setGameType(game_type);
    RenderField();
    RenderPlayers();
    InitBorderEvents();
};

InitBtnStartEvents(init_game);