class Animal {
    constructor(position, head_size) {
        this.position = position;
        this.head_size = head_size;
        this.color = {r:0, g:200, b:0};
        this.segments_distance = 0.7 * this.head_size;
        this.segment_sizes = [
            1.5, 0.7, 1.3, 1.5, 1.7, 1.5, 1, // Body
            0.7, 0.5, 0.5, 0.5, 0.5, 0.2,    // Tail
        ];

        this.segments = [];
        this.velocity = createVector(2, 0.5);
        this._createSegments()
    }

    draw() {
        push();

        var front_direction = (this.velocity.mag() == 0) ? createVector(1, 0) 
                            : this.velocity.copy().normalize(); 
        var left_direction = createVector(front_direction.y, -front_direction.x);

        var pt;
        
        fill(0, 255, 0);
        noStroke();
        
        beginShape();

        // Nose point
        pt = this.position.copy().add(front_direction.copy().mult(this.head_size / 2));
        vertex(pt.x, pt.y);

        // Left head point
        pt = this.position.copy().add(left_direction.copy().mult(this.head_size / 2));
        vertex(pt.x, pt.y);

        // Left body points
        for (var i in this.segments) {
            var segment = this.segments[i];
            var size = this.segment_sizes[i] * this.head_size;
            pt = segment.copy().add(left_direction.copy().mult(size / 2));
            vertex(pt.x, pt.y);
        }

        // Right body points
        for (var i in this.segments) {
            var j = this.segments.length - i - 1;
            var segment = this.segments[j];
            var size = this.segment_sizes[j] * this.head_size;
            pt = segment.copy().sub(left_direction.copy().mult(size / 2));
            vertex(pt.x, pt.y);
        }        

        // Right head point
        pt = this.position.copy().sub(left_direction.copy().mult(this.head_size / 2));
        vertex(pt.x, pt.y);

        endShape();
        pop();

        this._drawDebugSegments();
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
        
        var last_segment = this.position;

        for (var segment of this.segments) {
            // Moves the segment closer to the next
            // one if thay are too far away
            var distance = segment.dist(last_segment);
            if (distance > this.segments_distance) {
                var amount = abs(this.segments_distance - distance) / this.segments_distance;
                segment = segment.lerp(last_segment, amount);
            }
            // Uses this segment to update the next one
            last_segment = segment;
        }
    }

    _createSegments() {
        for (var i=1; i <= this.segment_sizes.length; i++) {
            var segment = createVector(this.position.x - i * this.segments_distance, this.position.y);
            this.segments.push(segment);
        }
    }

    _drawDebugSegments() {
        push();
        noFill();
        stroke(255);
        strokeWeight(2);
        circle(this.position.x, this.position.y, this.head_size);
        // Segments
        for (var i in this.segments) {
            var segment = this.segments[i];
            var size = this.segment_sizes[i] * this.head_size;
            circle(segment.x, segment.y, size);
        }
        pop();
    }
}

function create_animals(n) {
    var animals = [];
    for (var i=0; i<n; i++) {
        pos = createVector(Math.random() * width, 
                           Math.random() * height);
        var animal = new Animal(pos, 30);
        animals.push(animal);
    }
    return animals;
}