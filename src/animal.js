class Animal {
    constructor(position, head_size) {
        this.position = position;
        this.head_size = head_size;
        this.color = {r:0, g:200, b:0};
        this.segments_distance = floor(0.7 * this.head_size);

        this.segment_sizes = [
            0.7, 1.7, 2, 2, 1.7, 1.5, 
            0.7, 0.7, 0.5, 0.5, 0.3, 0.1
        ]

        this.segment_sizes = [0.7, 1.2, 1.3, 1, 1.2, 1.4, 0.7, 0.7, 0.5, 0.5, 0.3, 0.1];
        this.segments = [];
        this.velocity = createVector(2, 0.5);
        // this.velocity = createVector(0, 0);
        this._createSegments()
    }

    draw() {
        // Body
        push();
        fill(this.color.r, this.color.g, this.color.b);
        noStroke();
        
        fill(72, 112, 84);
        beginShape();
        var points = this._getBodyPoints();
        for (var pt of points) {
            vertex(ceil(pt.x), ceil(pt.y));
        }
        endShape();
        
        var pt;
        var foward_direction = (this.velocity.mag() == 0) 
        ? createVector(1, 0) 
        : this.velocity.copy().normalize();
        
        // Head
        fill(106, 160, 123);
        circle(this.position.x, this.position.y, this.head_size);
        pt = this.position.copy()
        pt.add(foward_direction.copy().mult(-this.head_size * 0.3))
        circle(pt.x, pt.y, this.head_size * 1.1);

        // Nose
        pt = this.position.copy()
        pt.add(foward_direction.copy().mult(this.head_size * 0.3))
        circle(pt.x, pt.y, this.head_size * 0.7);

        // Left Eye
        var pt = this.position.copy();
        pt.add(foward_direction.copy()
                              .rotate(-PI/2)
                              .mult(this.head_size * 0.4));
        fill(255);
        circle(pt.x, pt.y, this.head_size * 0.3);
        pt.add(foward_direction.copy().mult(2))
        fill(0);
        circle(pt.x, pt.y, this.head_size * 0.2);
        
        // Right Eye
        var pt = this.position.copy();
        pt.add(foward_direction.copy()
                              .rotate(-PI/2)
                              .mult(-this.head_size * 0.4));
        fill(255);
        circle(pt.x, pt.y, this.head_size * 0.3);
        fill(0);
        pt.add(foward_direction.copy().mult(2))
        circle(pt.x, pt.y, this.head_size * 0.2);

        // this._drawDebugSegments();
        this._drawDebugLegs();
        // this._drawDebugPoints();
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
        
        var last_segment = this.position;

        for (var segment of this.segments) {
            // Moves the segment closer to the next one if they are too far away
            var distance = segment.dist(last_segment);
            if (distance > this.segments_distance) {
                var delta = last_segment.copy().sub(segment);
                delta.setMag(this.segments_distance);
                segment.set(last_segment.copy().sub(delta))
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
            var size = floor(this.segment_sizes[i] * this.head_size);
            circle(segment.x, segment.y, size);
        }
        pop();
    }

    _drawDebugLegs() {
        push();
        // noFill();
        fill(255);
        stroke(255);
        strokeWeight(2);

        var pt;
        var front_left_leg;
        var front_right_leg;
        var back_left_leg;
        var back_right_leg;

        var foward_direction;
        var left_direction;

        // Front waist
        [foward_direction, left_direction] = this._getSegmentVectors(2);
        front_left_leg = this.segments[2].copy()
        front_right_leg = this.segments[2].copy()
        front_left_leg.add(left_direction.copy().mult(this.head_size * 1.2))
        front_right_leg.sub(left_direction.copy().mult(this.head_size * 1.2))
        circle(front_left_leg.x, front_left_leg.y, this.head_size / 2);
        circle(front_right_leg.x, front_right_leg.y, this.head_size / 2);

        // Back waist
        [foward_direction, left_direction] = this._getSegmentVectors(5);
        back_left_leg = this.segments[5].copy()
        back_right_leg = this.segments[5].copy()
        back_left_leg.add(left_direction.copy().mult(this.head_size * 1.2))
        back_right_leg.sub(left_direction.copy().mult(this.head_size * 1.2))
        circle(back_left_leg.x, back_left_leg.y, this.head_size / 2);
        circle(back_right_leg.x, back_right_leg.y, this.head_size / 2);

        pop();
    }
    
    _drawDebugPoints() {
        push();
        fill(255, 0, 0);
        var points = this._getBodyPoints();
        for (var pt of points) {
            circle(pt.x, pt.y, 10);
        }
        pop();
    }

    _getSegmentVectors(segment_index) {
        var last_segment = this.segments[segment_index - 1];
        var segment = this.segments[segment_index];
        if (segment_index == 0) {
            last_segment = this.position
        }

        var foward_direction = last_segment.copy().sub(segment).normalize();
        var left_direction = createVector(foward_direction.y, -foward_direction.x);

        return [foward_direction, left_direction];
    }

    _getBodyPoints() {
        var foward_direction = (this.velocity.mag() == 0) ? createVector(1, 0) 
                            : this.velocity.copy().normalize(); 
        var left_direction = foward_direction.copy().rotate(-PI/2);

        var pt;
        var points = [];
        var left_body_points = [];
        var right_body_points = [];

        var segment = this.position;
        var size = this.head_size;

        // Nose point
        pt = segment.copy().add(foward_direction.copy().mult(this.head_size / 2));
        points.push(pt);

        // Left head point
        pt = segment.copy().add(left_direction.copy().mult(this.head_size / 2));
        left_body_points.push(pt);

        // Right head point
        pt = this.position.copy().sub(left_direction.copy().mult(this.head_size / 2));
        right_body_points.push(pt);

        var last_segment = this.position;
        for (var i in this.segments) {
            segment = this.segments[i];
            size = floor(this.segment_sizes[i] * this.head_size);

            foward_direction = last_segment.copy().sub(segment).normalize();
            left_direction = createVector(foward_direction.y, -foward_direction.x);

            pt = segment.copy().add(left_direction.copy().mult(size / 2));
            left_body_points.push(pt);
            pt = segment.copy().sub(left_direction.copy().mult(size / 2));
            right_body_points.push(pt);

            last_segment = segment;
        }
        points.push(...left_body_points);
        points.push(...right_body_points.slice().reverse());
        return points;
    }
}

function create_animals(n, size=50) {
    var animals = [];
    for (var i=0; i<n; i++) {
        pos = createVector(Math.random() * width, 
                           Math.random() * height);
        pos = createVector(600, 200);
        var animal = new Animal(pos, size);
        animals.push(animal);
    }
    return animals;
}