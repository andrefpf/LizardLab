class Game {
    static FIRST_INIT = 0;
    static GAME_RUNNING = 1;
    static GAME_FINISHED = 2;

    constructor() {
        this.number_of_animals = 10;
        this.clock = new Clock(30);
        this.state = Game.GAME_FINISHED;
        this.animals = [];
        this.screens = {}

        this.screens[Game.FIRST_INIT] = new StartGameScreen();
        this.screens[Game.GAME_RUNNING] = new GameRunningScreen();
        this.screens[Game.GAME_FINISHED] = new EndGameScreen();
    }

    startRound() {
        this.animals = createAnimals(this.number_of_animals);;
        this.points = 0;
        this.state = Game.GAME_RUNNING;
        this.clock.start();
    }

    stopRound() {
        this.state = Game.GAME_FINISHED
    }

    update() {
        if (this.state == Game.FIRST_INIT)
            return

        if (this.state == Game.GAME_FINISHED)
            return

        if (this.clock.finished())
            return this.stopRound();

        this.clock.update();
    }

    getCurrentScreen() {
        return this.screens[this.state];
    }
}