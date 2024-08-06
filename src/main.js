var animals;
var mouse_click = {x:-1, y:-1};
selection = new Selection();

function setup() {
    createCanvas(800, 500);

    animals = create_animals(10, size=15);
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
            animal.color = [252, 158, 79];
            picked_animals.push(animal);
        }

        if (picked_animals.length >= 2) {
            break
        }
    }

    selection.clear();
}