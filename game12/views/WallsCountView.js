import Player1 from "../models/Player1.js";
import Player2 from "../models/Player2.js";

export const WallsCountRender = () => {
    document.querySelector('#walls-1').innerHTML = Player1.walls;
    document.querySelector('#walls-2').innerHTML = Player2.walls;
};