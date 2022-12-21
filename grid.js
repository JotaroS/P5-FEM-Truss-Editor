class Grid {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.isActive = true;
        this.color = 200;
    }

    draw() {
        if (this.isActive == false) return;
        strokeWeight(1);
        stroke(200);
        for (var i = 0; i < width; i += this.gridSize) {
            line(i, 0, i, height);
        }
        for (var i = 0; i < height; i += this.gridSize) {
            line(0, i, width, i);
        }
    }
}