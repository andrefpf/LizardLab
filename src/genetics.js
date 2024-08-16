color_a = [15, 61, 49];
color_b = [250, 175, 97];
size_a = 12;
size_b = 20;
speed_a = 6;
speed_b = 2;


class Genetics {
/*
Genetics contains multiple characteristics represented
by a number ranging from 0 to 1.
*/
    constructor() {
        // p stands for percentage
        this.p_color = Math.random();
        this.p_size = Math.random();
    }

    getColor() {
        return [
            lerp(color_a[0], color_b[0], this.p_color ** 2),
            lerp(color_a[1], color_b[1], this.p_color ** 2),
            lerp(color_a[2], color_b[2], this.p_color ** 2),
        ]
    }

    getSize() {
        return lerp(size_a, size_b, this.p_size * this.p_size * this.p_size);
    }

    getSpeed() {
        return lerp(speed_a, speed_b, this.p_size);
    }

    mutate() {
        if (Math.random() > 0.2) {
            this.p_color += (Math.random() - 0.5) * 0.7;
            this.p_color = clamp(this.p_color, 0, 1);
        }

        if (Math.random() > 0.2) {
            this.p_size += (Math.random() - 0.5) * 0.7;
            this.p_size = clamp(this.p_size, 0, 1);
        }
    }

    static merge(all_genetics) {
        var merged = new Genetics();
        merged.p_color = average(all_genetics.map(item => item.p_color));
        merged.p_size = average(all_genetics.map(item => item.p_size));
        return merged
    }
}