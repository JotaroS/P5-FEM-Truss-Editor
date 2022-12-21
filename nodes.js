const nodeRadius = 10;
const textOffset = 5;
class FEMNode {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.p = new p5.Vector(x, y);
        this.fixed = false;
    }
    draw() {
        if (this.fixed) fill(0, 0, 0);
        else fill(255, 0, 0);
        ellipse(this.x, this.y, nodeRadius, nodeRadius);
        strokeWeight(0);
        text(this.id, this.x + textOffset, this.y - textOffset);
    }

    onMouseClicked(x, y) {
        var mouseVec = new p5.Vector(x, y);
        if (mouseVec.dist(this.p) < 10) {
            console.log(this.id + ' was clicked');
            return true;
        }
        return false;
    }
}

class ClickableBox {
    constructor(x, y, w, h, text, mode) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
        this.active = false;
        this.mode = mode;
    }

    draw() {
        strokeWeight(2);
        stroke(255);
        if (!this.active) fill(200);
        else fill(0, 200, 200);
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        strokeWeight(0);
        text(this.text, this.x + 10, this.y + 20);
    }
    onMouseClicked(x, y) {
        if (x >= this.x && x <= this.x + this.w &&
            y >= this.y && y <= this.y + this.h) {
            console.log(this.text + "was clicked");
            return true;
        }
        return false;
    }
}