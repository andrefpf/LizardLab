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
        if (this.finished())
            return

        let angle = -PI/2 - 2 * PI * this.seconds / this.total_seconds;
        arc(50, 50, 80, 80, angle, -PI/2, PIE);
    }

    update() {
        this.seconds = this.total_seconds - (Date.now() - this.start_time) / 1000;
    }
}