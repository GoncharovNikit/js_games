import Player1 from "../models/Player1.js";
import Player2 from "../models/Player2.js";
import Victory from "../views/VictoryView.js";
import Field from "../models/Field.js";
import Game from "../models/Game.js";
import Init from "../models/Init.js";
import { DisplayAvailableMoves, MakeAMove } from "./PlayersController.js";

export const checkVictory = () => {
    if (Player1.y == 0) {
        Victory("Player 1");
    } else if (Player2.y == Field.size - 1) {
        Victory("Player 2");
    }
};

export const randomStep = () => {
    const player = Game.current();
    const is_step = !!Math.round(Math.random());

    if (is_step || Game.current().walls == 0) {
        const moves = DisplayAvailableMoves(player, {
            x: player.x,
            y: player.y,
        });
        const coords = moves[Math.floor(Math.random() * moves.length)];
        MakeAMove(coords.x, coords.y);
    } else {
        while (Game.current() == player) {
            const borders = Array.from(document.querySelectorAll(".border"));
            const border = borders[Math.floor(Math.random() * borders.length)];

            const mouseoverEvent = new Event("mouseover");
            border.dispatchEvent(mouseoverEvent);
            border.click();
        }
    }
};

export const ResetConfigs = () => {
    Player1.walls = Player2.walls = Init.INIT_WALLS;
    Player1.x = Player2.x = parseInt(Field.size / 2);
    Player1.y = Field.size - 1;
    Player2.y = 0;
    Game.current_pl = "1";
    Game.game_type = null;
};

export const InitBtnStartEvents = (init_game) => {
    document.querySelector("#game_pl_comp").addEventListener("click", (e) => {
        init_game(Init.PLAYER_COMPUTER);
    });
    
    document.querySelector("#game_pl_pl").addEventListener("click", (e) => {
        init_game(Init.PLAYER_PLAYER);
    });
};