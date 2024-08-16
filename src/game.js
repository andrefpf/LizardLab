class Game {
    static FIRST_INIT = 0;
    static GAME_RUNNING = 1;
    static GAME_FINISHED = 2;

    constructor() {
        this.number_of_animals = 8;
        this.clock = new Clock(30);
        this.state = Game.FIRST_INIT;
        this.animals = [];
        this.screens = {};
        this.points = 0;

        this.screens[Game.FIRST_INIT] = new StartGameScreen();
        this.screens[Game.GAME_RUNNING] = new GameRunningScreen();
        this.screens[Game.GAME_FINISHED] = new EndGameScreen();
    }

    startRound() {
        this.animals = createAnimals(this.number_of_animals);;
        animal_a.genetics = this.getAverageGenetics();
        this.points = 0;
        this.clock.start();
        this.state = Game.GAME_RUNNING;
    }
    
    stopRound() {
        animal_b.genetics = this.getAverageGenetics();
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

    getAverageGenetics() {
        let all_genetics = this.animals.map(item => item.genetics);
        return Genetics.merge(all_genetics);
    }
}