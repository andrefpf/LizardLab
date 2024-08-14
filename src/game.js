class Game {
    static FIRST_INIT = 0;
    static GAME_RUNNING = 1;
    static GAME_FINISHED = 2;

    constructor() {
        this.number_of_animals = 10;
        this.max_seconds = 30;
        this.state = Game.FIRST_INIT;
    }

    startRound() {
        this.animals = createAnimals(this.number_of_animals);;
        this.seconds = this.max_seconds;
        this.points = 0;
        this.state = Game.GAME_RUNNING;

        this._start_of_round = Date.now();
    }

    stopRound() {
        this.state = Game.GAME_FINISHED
    }

    update() {
        if (this.state == Game.FIRST_INIT)
            return

        if (this.state == Game.GAME_FINISHED)
            return

        if (this.seconds <= 0)
            return this.stopRound();

        this.seconds = this.max_seconds - (Date.now() - this._start_of_round) / 1000;
        console.log(this.seconds);
    }
}