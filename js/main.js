$( window ).on('load', function() {
    draw_from_png("assets/mtl_contours_v004.png", "map");
  });


// function that draws a canvas from a png file
function draw_from_png(path, id) {
    // Get the canvas element and set the dimensions. 
    let canvas = document.getElementById(id);
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

   // Get a 2D context.
    var ctx = canvas.getContext('2d');

    // create new image object to use as pattern
    var img = new Image();
    img.src = path;
    img.onload = function(){
        // Create pattern and don't repeat! 
       var ptrn = ctx.createPattern(img,'no-repeat');
       ctx.fillStyle = ptrn;
       ctx.fillRect(0,0,canvas.width,canvas.height);
    }
}