var animals;
var mouse_click = {x:-1, y:-1};
var game_points = 0;
var points_label;
var selection = new Selection();

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("canvas-div")
    points_label = document.getElementById("points");

    animals = createAnimals(7, size=15);
}

function draw() {
    background(28, 40, 38);

    selection.draw();

    for (var animal of animals) {
        animal.update();
    }

    for (var animal of animals) {
        animal.draw();
    }
}

function mouseDragged() {
    var pt = createVector(mouseX, mouseY);
    selection.add_point(pt);
}

function mouseReleased() {
    var picked_animals = [];

    for (var animal of animals) {
        var picked = pointInPoly(animal.position, selection.points);
        if (picked) {
            animal.makeAngry();
            picked_animals.push(animal);
        }
    }
    
    if (picked_animals.length == 1) {
        animal = picked_animals[0];
        addPoints(10);

        // Place new animal outside of the screen and make
        // it enter the canvas
        animal.reset();
        animal.position = createVector(-20, height / 2);
        animal.direction  = createVector(1, 0);
        animal.joints = [];
        animal._createControlPoints();

        let all_genetics = animals.filter(item => item != animal)
                                  .map(item => item.genetics);
        animal.genetics = Genetics.merge(all_genetics);
        console.log(animal.genetics)
    }

    selection.clear();
}

function restartGame() {
    points = -1;
}

function addPoints(delta) {
    game_points += delta;
    points_label.innerHTML = game_points + " pts";
}
