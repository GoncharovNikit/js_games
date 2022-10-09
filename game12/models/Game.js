import Player1 from "./Player1.js";
import Player2 from "./Player2.js";

const Game = {
    current_pl: '1',
    game_type: null,
    setGameType(type) {
        this.game_type = type;
    },
    current() {
        return this.current_pl == '1' ? Player1 : Player2;
    },
    next_step() {
        this.current_pl = this.current_pl == '1' ? '2' : '1';
    },
}
window.Game = Game;
export default Game;