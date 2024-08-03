var mouse_click = {x:-1, y:-1};
selection = new Selection();

function setup() {
    createCanvas(800, 500);
    
    animals = create_animals(10);

    for (animal of animals) {
        animal.color = {r:0, g:200, b:0};
    }
}

function draw() {
    background(200);

    selection.draw();

    for (var animal of animals) {
        animal.draw();
    }

    for (var animal of animals) {
        animal.update();
    }
}

function mouseDragged() {
    var pt = {x:mouseX, y:mouseY};
    selection.add_point(pt);
}

function mouseReleased() {
    selection.clear();
}