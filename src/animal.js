class Animal {
    constructor(position, direction) {
        this.genetics = new Genetics();

        this.position = position;
        this.direction = direction;
        this.direction.normalize();
        
        this.angle_step = 0;
        this.front_left_leg = createVector(0, 0);
        this.front_right_leg = createVector(0, 0);
        this.back_left_leg = createVector(0, 0);
        this.back_right_leg = createVector(0, 0);

        this.head_size = this.genetics.getSize();
        this.segments_size = floor(0.6 * this.head_size);

        this.freeze = false;

        this.reset();
        this._createControlPoints();
        this._updateLegPoints();
    }
    
    reset() {
        this.angry = 0;
        this.joint_widths = [
            1, 0.7, 1.2, 1.2, 1.2, 1.2, 1.1, 
            0.7, 0.6, 0.5, 0.4, 0.3, 0.3, 0.2
        ];
        this.head_size = this.genetics.getSize();
        this.segments_size = floor(0.6 * this.head_size);
        this._createControlPoints();
        this._updateLegPoints();
    }

    setGenetics(genetics) {
        this.genetics = genetics;
        this.reset();
    }

    makeAngry() {
        this.angry = 300;
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
        if (this.freeze)
            return

        let speed = this.genetics.getSpeed();
        if (this.angry)
            speed = 8;

        this.position.add(this.direction.copy().mult(speed));
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

        if (this.angry > 0) {
            this.angry--;
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
            if (this.angry && i >= 8) {
                break
            }
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

            if (this.angry && i >= 8) {
                break
            }
            
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
        if (this.angry) {
            fill(255, 67, 101);
        }
        else {
            fill(255, 255, 255);
        }

        circle(left_eye.x, left_eye.y, this.head_size * 0.4)
        circle(right_eye.x, right_eye.y, this.head_size * 0.4)

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

        if (this.freeze) {
            this.front_left_leg = front_left_leg.add(0, this.head_size);
            this.front_right_leg = front_right_leg.add(0, this.head_size);
            this.back_left_leg = back_left_leg.add(0, this.head_size);
            this.back_right_leg = back_right_leg.add(0, this.head_size);
            return;
        }

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

function createAnimals(n) {
    var animals = [];
    for (var i=0; i<n; i++) {
        let pos = createVector(Math.random() * width, 
                           Math.random() * height);
        let dir = createVector(2 * Math.random() - 1, 2 * Math.random() - 1);
        var animal = new Animal(pos, dir);
        animals.push(animal);
    }
    return animals;
}