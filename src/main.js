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
    var pt = {x:mouseX, y:mouseY};
    selection.add_point(pt);
}

function mouseReleased() {
    selection.clear();
}