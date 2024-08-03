class Animal {
    constructor(position, head_size) {
        this.position = position;
        this.head_size = head_size;
        this.velocity = createVector(0.5, 2);
        this.color = {r:0, g:200, b:0};
    }

    draw() {
        push();

        fill(this.color.r, this.color.g, this.color.b);
        circle(this.position.x, this.position.y, this.head_size);

        stroke(255, 0, 0);
        line(this.position.x,
             this.position.y, 
             this.position.x + this.velocity.x * 10,
             this.position.y + this.velocity.y * 10);
        
        fill(255, 0, 0);
        circle(this.position.x + this.velocity.x * 10,
               this.position.y + this.velocity.y * 10,
               this.head_size * 0.1);
        
        pop();
    }

    update() {
        this.position.add(this.velocity);
        this.position.x = clamp(this.position.x, 0, width);
        this.position.y = clamp(this.position.y, 0, height);

        if (this.position.x <= 0 || this.position.x >= width) {
            this.velocity.x = -this.velocity.x
        }

        if (this.position.y <= 0 || this.position.y >= height) {
            this.velocity.y = -this.velocity.y
        }
    }
}

function create_animals(n) {
    var animals = [];
    for (var i=0; i<n; i++) {
        pos = createVector(Math.random() * width, 
                           Math.random() * height);
        var animal = new Animal(pos, 50);
        animals.push(animal);
    }
    return animals;
}