class StartGameScreen {
    draw() {
        push();
        background(28, 40, 38);

        fill(255);
        textStyle(BOLD);
        textAlign(CENTER);
        textSize(width / 10);
    
        text("Started", width / 2, height / 4);
        pop();    
    }

    update() {

    }
}

class GameRunningScreen {
    draw() {
        push();
        background(10, 41, 33);

        selection.draw();
        
        for (var animal of game.animals) {
            animal.draw();
        }
        
        game.clock.draw();

        fill(255);
        textStyle(BOLD);
        textAlign(RIGHT);
        textSize(width / 12);    
        text(game.points + " pts", width - 30, height - 40);

        pop();
    }
    
    update() {
        for (var animal of game.animals) {
            animal.update();
        }
    }
}

class EndGameScreen {
    draw() {
        push();
        background(28, 40, 38);

        fill(255);
        textStyle(BOLD);
        textAlign(CENTER);
        textSize(width / 10);
        text("Finished", width / 2, height / 4);

        if (typeof animal_a !== "undefined")
            animal_a.draw();

        if (typeof animal_b !== "undefined")
            animal_b.draw();

        pop();
    }

    update() {

    }
}
