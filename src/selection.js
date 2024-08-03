class Selection {
    constructor() {
        this.points = [];
    }

    add_point(pt) {
        this.points.push(pt);
    }

    clear() {
        this.points = [];
    };

    draw() {
        push();
        beginShape();
        fill(255, 0, 0);
        noStroke();
        for (var pt of this.points) {
            curveVertex(pt.x, pt.y);
        }
        endShape();
        pop();
    }
}