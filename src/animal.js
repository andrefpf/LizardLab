class Animal {
    constructor(position) {
        this.genetics = new Genetics();

        this.position = position;
        this.head_size = this.genetics.getSize();
        this.eye_color = [0, 0, 255]
        // this.color = [111, 213, 108];
        // this.color = [60, 145, 230];
        // this.color = [252, 158, 79];
        this.segments_size = floor(0.6 * this.head_size);
        this.direction = createVector(2 * Math.random() - 1, 2 * Math.random() - 1);
        this.direction.normalize();

        this.angle_step = 0;
        this.front_left_leg = createVector(0, 0);
        this.front_right_leg = createVector(0, 0);
        this.back_left_leg = createVector(0, 0);
        this.back_right_leg = createVector(0, 0);

        this.reset();
        this._createControlPoints();
        // this._updateLegPoints();
    }

    reset() {
        this.angry = false;
        this.color = [111, 213, 108];
        this.eye_color = [0, 0, 255]
        this.speed = this.genetics.getSpeed();
        this.joint_widths = [
            1, 0.7, 1.2, 1.2, 1.2, 1.2, 1.1, 
            0.7, 0.6, 0.5, 0.4, 0.3, 0.3, 0.2
        ];
    }

    makeAngry() {
        this.angry = true;
        this.eye_color = [255, 67, 101];
        this.speed = 8;
        this.joint_widths = this.joint_widths.slice(0, 8);
        this.joints = this.joints.slice(0, 8);
    }

    draw() {
        push();

        noStroke();
        fill(...this.genetics.getColor());
        
        this._drawLegs();
        this._drawJoints();
        this._drawSegments();
        this._drawHead();
        pop();

        // this._drawDebugJoints();
        // this._drawDebugSegments();
        // this._drawDebugLegs();
    }

    update() {
        this.position.add(this.direction.copy().mult(this.speed));
        this.position.x = clamp(this.position.x, 0, width);
        this.position.y = clamp(this.position.y, 0, height);

        if (this.position.x <= 0 || this.position.x >= width) {
            this.direction.x = -this.direction.x
        }

        if (this.position.y <= 0 || this.position.y >= height) {
            this.direction.y = -this.direction.y
        }
        
        var max_steps = 100;
        this.angle_step++;

        if (this.angle_step >= max_steps) {
            this.angle_step = 0;
        }

        if (this.angle_step > (max_steps / 2)) {
            this.direction.rotate(Math.random() * PI / 30);
            // this.direction.rotate(PI/80);
        }
        else {
            this.direction.rotate(-Math.random() * PI / 30);
            // this.direction.rotate(-PI/80);
        }
        
        var last_segment = this.position;

        for (var segment of this.joints) {
            // Moves the segment closer to the next one if they are too far away
            var distance = segment.dist(last_segment);
            if (distance > this.segments_size) {
                var delta = last_segment.copy().sub(segment);
                delta.setMag(this.segments_size);
                segment.set(last_segment.copy().sub(delta))
            }
            // Uses this segment to update the next one
            last_segment = segment;
        }

        this._updateLegPoints()
    }

    _createControlPoints() {
        this.joints = [];
        this.joints.push(this.position);
        for (var i=1; i <= this.joint_widths.length; i++) {
            var segment = createVector(this.position.x, this.position.y);
            segment.sub(this.direction.copy().mult(i * this.segments_size));

            // var segment = createVector(this.position.x - i * this.segments_size, this.position.y);
            this.joints.push(segment);
        }
    }

    _drawJoints() {
        var joint;
        var width;
        for (var i in this.joints) {
            joint = this.joints[i];
            width = this.joint_widths[i];
            circle(joint.x, joint.y, width * this.head_size);
        }
    }

    _drawSegments() {
        var last_joint = this.joints[0];
        var last_width = this.joint_widths[0];

        var current_joint;
        var current_width;
    
        for (var i=0; i < this.joints.length - 1; i++) {
            current_joint = this.joints[i];
            current_width = this.joint_widths[i] * this.head_size;
            var [_, normal] = this._getSegmentVectors(i);

            var a = current_joint.copy().add(normal.copy().mult(current_width / 2));
            var b = last_joint.copy().add(normal.copy().mult(last_width / 2));
            var c = last_joint.copy().sub(normal.copy().mult(last_width / 2));
            var d = current_joint.copy().sub(normal.copy().mult(current_width / 2));
            quad(a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y);
            
            last_joint = current_joint;
            last_width = current_width;
        }
    }

    _drawHead() {
        var [forward, normal] = this._getSegmentVectors(0);

        // Head
        var a = this.position.copy()
        .add(normal.copy().mult(this.head_size * 0.6 / 2))
        .add(forward.copy().mult(this.head_size * 0.5));
        var b = this.position.copy()
        .sub(normal.copy().mult(this.head_size * 0.6 / 2))
        .add(forward.copy().mult(this.head_size * 0.5));
        var c = this.position.copy().sub(normal.copy().mult(this.head_size / 2));
        var d = this.position.copy().add(normal.copy().mult(this.head_size / 2));
        quad(a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y);

        // Nose
        var nose = this.position.copy().add(forward.copy().mult(this.head_size * 0.5));
        circle(nose.x, nose.y, this.head_size * 0.6);

        // Eyes
        var left_eye = this.position.copy()
        .add(normal.copy().mult(this.head_size * 0.25))
        .add(forward.copy().mult(this.head_size * 0.2));
        
        var right_eye = this.position.copy()
        .sub(normal.copy().mult(this.head_size * 0.25))
        .add(forward.copy().mult(this.head_size * 0.2));
        
        push();
        fill(...this.eye_color);
        circle(left_eye.x, left_eye.y, this.head_size * 0.3)
        circle(right_eye.x, right_eye.y, this.head_size * 0.3)

        pop();
    }
    
    _drawLegs() {
        var front_leg_index = 2;
        var back_leg_index = 5;
        
        push();
        stroke(...this.genetics.getColor());
        strokeWeight(this.head_size / 2);
        line(this.joints[front_leg_index].x, this.joints[front_leg_index].y, this.front_left_leg.x, this.front_left_leg.y);
        line(this.joints[front_leg_index].x, this.joints[front_leg_index].y, this.front_right_leg.x, this.front_right_leg.y);
        line(this.joints[back_leg_index].x, this.joints[back_leg_index].y, this.back_left_leg.x, this.back_left_leg.y);
        line(this.joints[back_leg_index].x, this.joints[back_leg_index].y, this.back_right_leg.x, this.back_right_leg.y);
        pop();
    }

    _drawDebugJoints() {
        push();
        fill(255, 0, 0);
        for (var joint of this.joints) {
            circle(joint.x, joint.y, 10);
        }
        pop();
    }
    
    _drawDebugSegments() {
        push();
        fill(255, 0, 0);
        strokeWeight(2);
        stroke(255, 0, 0);
        var last_joint = this.joints[0];
        var current_joint;
        for (var i=1; i < this.joints.length; i++) {
            current_joint = this.joints[i];
            line(last_joint.x, last_joint.y, current_joint.x, current_joint.y);
            last_joint = current_joint;
        }
        pop();
    }

    _drawDebugLegs() {
        push();
        fill(255, 0, 0);
        strokeWeight(2);
        stroke(255, 0, 0);

        circle(this.front_left_leg.x, this.front_left_leg.y, 10);
        circle(this.front_right_leg.x, this.front_right_leg.y, 10);
        circle(this.back_left_leg.x, this.back_left_leg.y, 10);
        circle(this.back_right_leg.x, this.back_right_leg.y, 10);

        var front_leg_index = 2;
        var back_leg_index = 5;
        
        line(this.joints[front_leg_index].x, this.joints[front_leg_index].y, this.front_left_leg.x, this.front_left_leg.y);
        line(this.joints[front_leg_index].x, this.joints[front_leg_index].y, this.front_right_leg.x, this.front_right_leg.y);
        line(this.joints[back_leg_index].x, this.joints[back_leg_index].y, this.back_left_leg.x, this.back_left_leg.y);
        line(this.joints[back_leg_index].x, this.joints[back_leg_index].y, this.back_right_leg.x, this.back_right_leg.y);
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
        
    _updateLegPoints() {
        var forward;
        var normal;

        var front_leg_index = 2;
        var back_leg_index = 5;

        var front_left_leg;
        var front_right_leg;
        var back_left_leg;
        var back_right_leg;
        
        // Front waist
        [forward, normal] = this._getSegmentVectors(front_leg_index);
        front_left_leg = this.joints[front_leg_index].copy();
        front_left_leg.add(normal.copy().mult(this.head_size));
        front_left_leg.add(forward.copy().mult(this.head_size * 1.4));

        front_right_leg = this.joints[front_leg_index].copy();
        front_right_leg.sub(normal.copy().mult(this.head_size));
        front_right_leg.add(forward.copy().mult(this.head_size * 1.4));

        // Back waist
        [forward, normal] = this._getSegmentVectors(back_leg_index);
        back_left_leg = this.joints[back_leg_index].copy();
        back_left_leg.add(normal.copy().mult(this.head_size));
        back_left_leg.add(forward.copy().mult(this.head_size * 1.4));

        back_right_leg = this.joints[back_leg_index].copy();
        back_right_leg.sub(normal.copy().mult(this.head_size));
        back_right_leg.add(forward.copy().mult(this.head_size * 1.4));

        var max_distance = this.head_size * 1.5;
        
        if (this.front_left_leg.dist(front_left_leg) > max_distance) {
            this.front_left_leg = front_left_leg;
        }

        if (this.front_right_leg.dist(front_right_leg) > max_distance) {
            this.front_right_leg = front_right_leg;
        }

        if (this.back_left_leg.dist(back_left_leg) > max_distance) {
            this.back_left_leg = back_left_leg;
        }
        
        if (this.back_right_leg.dist(back_right_leg) > max_distance) {
            this.back_right_leg = back_right_leg;
        }
    }

    _getSegmentVectors(segment_index) {
        var last_segment = this.joints[segment_index - 1];
        var segment = this.joints[segment_index];

        if (segment_index == 0) {
            last_segment = this.joints[segment_index + 1];
        }

        var forward_direction = last_segment.copy().sub(segment).normalize();
        var left_direction = createVector(forward_direction.y, -forward_direction.x);

        if (segment_index == 0) {
            forward_direction.mult(-1);
            left_direction.mult(-1);
        }

        return [forward_direction, left_direction];
    }
}

function createAnimals(n, size=50) {
    var animals = [];
    for (var i=0; i<n; i++) {
        pos = createVector(Math.random() * width, 
                           Math.random() * height);
        // pos = createVector(600, 200);
        var animal = new Animal(pos, size);
        animal.genetics.p_size = 1;
        animals.push(animal);
    }
    animals[0].genetics.p_size = 0;
    return animals;
}