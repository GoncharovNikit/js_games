import Player1 from "../models/Player1.js";
import Player2 from "../models/Player2.js";

export const RenderPlayers = () => {
    const players = document.querySelectorAll('.player');
    players.forEach((player) => {
        player.parentNode.removeChild(player);
    })
    
    const pl1 = Player1;
    const pl2 = Player2;

    document.querySelectorAll('.cell')[pl1.y * 9 + pl1.x].innerHTML = '<div class="player player-1"></div>';
    document.querySelectorAll('.cell')[pl2.y * 9 + pl2.x].innerHTML = '<div class="player player-2"></div>';
};
