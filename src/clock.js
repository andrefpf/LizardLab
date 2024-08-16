class Clock {
    constructor(total_seconds) {
        this.total_seconds = total_seconds;
        this.seconds = 0;
        this.start_time = 0;
    }

    start() {
        this.seconds = this.total_seconds;
        this.start_time = Date.now();
    }

    finished() {
        return this.seconds <= 0;
    }

    draw() {
        let pos = createVector(80, height - 80);
        let d = 80;

        // Legs
        strokeWeight(d / 5);
        line(pos.x, pos.y, pos.x - d * 0.5, pos.y + d * 0.5);
        line(pos.x, pos.y, pos.x + d * 0.5, pos.y + d * 0.5);

        // Structure
        fill(255);
        strokeWeight(1);
        circle(pos.x, pos.y, d);

        // Counter
        if (!this.finished()) {
            fill(255, 67, 101);
            let angle = -PI/2 - 2 * PI * this.seconds / this.total_seconds;
            arc(pos.x, pos.y, d * 0.9, d * 0.9, angle, -PI/2, PIE);
        }
        
        // Center
        fill(0);
        circle(pos.x, pos.y, d / 5);
        
        let tmp;
        // Bells top
        tmp = pos.copy().add(-d * 0.6, -d * 0.6)
        circle(tmp.x, tmp.y, d / 5);

        tmp = pos.copy().add(d * 0.6, -d * 0.6)
        circle(tmp.x, tmp.y, d / 5);

        // Bells
        tmp = pos.copy().add(-d * 0.4, -d * 0.4)
        arc(tmp.x, tmp.y, d * 0.6, d * 0.6, PI*3/4, -PI/4, PIE);

        tmp = pos.copy().add(d * 0.4, -d * 0.4)
        arc(tmp.x, tmp.y, d * 0.6, d * 0.6, -PI*3/4, PI/4, PIE);

    }

    update() {
        this.seconds = this.total_seconds - (Date.now() - this.start_time) / 1000;
    }
}