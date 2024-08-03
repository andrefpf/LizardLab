var s1 = function( sketch ) {
    sketch.setup = function() {
      let canvas1 = sketch.createCanvas(100, 150, sketch.WEBGL);
      canvas1.position(0,0);
    }
    sketch.draw = function() {
      //for canvas 1
      sketch.background(100);
      sketch.rotateX(sketch.frameCount * 0.01);
      sketch.rotateZ(sketch.frameCount * 0.01);
      sketch.cone(30, 50);
    }
  };
  
  // create a new instance of p5 and pass in the function for sketch 1
  new p5(s1);
  
  var s2 = function( sketch ) {
  
     sketch.setup = function() {
      let canvas2 = sketch.createCanvas(400, 300, sketch.WEBGL);
      canvas2.position(100,0);
    }
    sketch.draw = function() {
      //for canvas 2
      sketch.background(200);
      sketch.rotateX(sketch.frameCount * 0.01);
      sketch.rotateZ(sketch.frameCount * 0.02);
      sketch.cone(30, 50);
    }
  };
  
  // create the second instance of p5 and pass in the function for sketch 2
  new p5(s2);