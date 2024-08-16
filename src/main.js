var selection;
var game;
var animal_a; 
var animal_b; 

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("canvas-div")

    animal_a = new Animal(createVector(width * 0.3, height/2), createVector(0, -1));
    animal_a.freeze = true
    animal_a._updateLegPoints()

    animal_b = new Animal(createVector(width * 0.7, height/2), createVector(0, -1));
    animal_b.freeze = true
    animal_b._updateLegPoints()
    
    selection = new Selection();
    game = new Game();
}

function draw() {
    let screen = game.getCurrentScreen();

    game.update();
    screen.update();
    screen.draw();
}

function mouseDragged() {
    var pt = createVector(mouseX, mouseY);
    selection.add_point(pt);
}

function mouseReleased() {
    if (game.state == Game.FIRST_INIT) {
        selection.clear();
        return game.startRound();
    }

    if (game.state == Game.GAME_FINISHED) {
        selection.clear();
        return game.startRound();
    }


    var picked_animals = [];

    for (var animal of game.animals) {
        var picked = pointInPoly(animal.position, selection.points);
        if (picked) {
            animal.makeAngry();
            picked_animals.push(animal);
        }
    }
    
    if (picked_animals.length == 1) {
        animal = picked_animals[0];
        game.points++;

        // Place new animal outside of the screen and make
        // it enter the canvas
        animal.reset();
        animal.position = createVector(-20, height / 2);
        animal.direction  = createVector(1, 0);
        animal.joints = [];
        animal._createControlPoints();

        animal.genetics = new Genetics();
    }

    selection.clear();
}
