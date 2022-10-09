import { MakeAMove } from "../controllers/PlayersController.js";

const events = new Map;

export const AvailableMovesView = (coordinates) => {
    ClearAvailableView();
    
    const cells = Array.from(document.querySelectorAll(".cell"));
    coordinates.forEach(({ x, y }) => {
        if (x >= 0 && y >= 0) {
            const cell = cells[y * 9 + x];
            cell.classList.add("possible");

            const handler = () => {
                MakeAMove(x, y)
            };
            
            cell.addEventListener("click", handler);
            events.set(cell, handler);
        }
    });
};

export const ClearAvailableView = () => {
    events.forEach((handler, cell) => { 
        cell.classList.remove("possible");
        cell.removeEventListener("click", handler);
    });
    events.clear();
};

