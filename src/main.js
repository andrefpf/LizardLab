function setup() {
    createCanvas(800, 500);
    
    animals = create_animals(10);

    for (animal of animals) {
        animal.color = {r:0, g:200, b:0};
    }
}

function draw() {
    background(200);

    for (animal of animals) {
        animal.draw();
    }

    for (animal of animals) {
        animal.update();
    }
}
