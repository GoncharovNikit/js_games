import Field from "../models/Field.js";
import Init from "../models/Init.js";

const Player2 = {
    x: parseInt(Field.size / 2),
    y: 0,
    walls: Init.INIT_WALLS,

    setX(x) {
        if (x >= 0 && x < Field.size)
            this.x = x;
    },
    setY(y) {
        if (y >= 0 && y < Field.size)
            this.y = y;
    },
    setWalls(walls) {
        if (walls >= 0 && walls <= Init.INIT_WALLS)
            this.walls = walls;
    },
}
window.player2 = Player2;
export default Player2;