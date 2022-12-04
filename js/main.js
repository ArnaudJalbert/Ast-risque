window.saveDataAcrossSessions = true

//GLOBAL VARIABLES
var buttons = {};

// size of screen
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
// size of map
const MAP_WIDTH = 857;
const MAP_HEIGHT = 731;

// to store the coordinates of where the user is looking
var coords = new Array();
var counter = 0;

// to start recording the coordinates of eye track
var storing = false

// json file location
let JSON_DATA = "data/data.json"

// store the the eye tracking data
let eye_data = []

$(window).on('load', function() {
    // hiding the map until the eye track has been calibrated
    $('.map_layout').hide();
    $('#stream').css('top', "-6000px")

    // init the calibrations buttons
    init_calibration_buttons();
    
    // creating canvas of map from the png file
    draw_from_png("assets/mtl_contours_fine_v004.png", "map");

    // init the eye tracking
    init_eye_tracking();

    // init the recording of eye track
    init_storing_eye_track();
})

//---------EYE FUNCTIONS-----------

// setting up the eye track 
function init_eye_tracking(){

    // init the eye tracking
    webgazer.setGazeListener(function(data, elapsedTime) {
        // only stores when needed
        if(storing)
        {
            // increasing the counter
            counter++;

            // only stores at each 50 iterations to reduce sample size
            if(counter%25==0)
            {
                if(data != null){
                    webgazer.util.bound(data);
                    to_store = round_to_ratio(data.x, data.y
                                             ,SCREEN_WIDTH, SCREEN_HEIGHT
                                             ,MAP_WIDTH, MAP_HEIGHT)
                    
                    if(to_store != null)
                    {
                        to_store.push(elapsedTime)
                        coords.push(to_store);
                        console.log(coords);
                    }else
                    {
                        console.log('Registered data out of bound!')    
                    }

                    
                }
            }

            // stopping storing after 40 iterations
            if(counter>=500)
            {
                storing = false;
                counter = 0;
                $('#build_map').text("Recording of your eyes finished, starting the livestream!");
                append_to_db("arno", coords)
                $('#stream').css('top', '0px')
                draw_eye_points('map');
            }
        }

    }).begin();
}

// storing eye track data when the user wants
function init_storing_eye_track()
{
    // checking that we're not already storing
    if(!storing)
    {
        $('#build_map').click(function (e) 
        { 
            counter = 0;
            storing = true;
            $('#build_map').text("Recording your eyes' movement...");
            console.log("Storing");
        });
    }
}


//--------------------------------

//---------CANVAS FUNCTIONS-----------

// function that draws a canvas from a png file
function draw_from_png(path, id) {
    // Get the canvas element and set the dimensions. 
    let canvas = document.getElementById(id);
    canvas.height = MAP_HEIGHT;
    canvas.width = MAP_WIDTH;

   // Get a 2D context.
    var ctx = canvas.getContext('2d');

    // create new image object to use as pattern
    let img = new Image();
    img.src = path;
    img.onload = function(){
        // Create pattern and don't repeat! 
       var ptrn = ctx.createPattern(img,'no-repeat');
       ctx.fillStyle = ptrn;
       ctx.fillRect(0,0,canvas.width,canvas.height);
    }
}

function draw_eye_points(id)
{
    let canvas = document.getElementById(id);
    
    var ctx = canvas.getContext('2d');

    let i = 0;                  //  set your counter to 1

    function draw_loop() {
        setTimeout(function() 
        {
            ctx.beginPath();
            ctx.arc(eye_data[i][0],eye_data[i][1],5,0, 2 * Math.PI, true);
            ctx.stroke()
            ctx.beginPath();
            ctx.moveTo(eye_data[i][0], eye_data[i][1]);
            ctx.lineTo(eye_data[i+1][0], eye_data[i+1][1]);
            ctx.stroke();
            i++;

            if (i < eye_data.length-1)
            {
                draw_loop(); 
            }else
            {
                ctx.fillStyle = "black"
                ctx.fillRect(eye_data[eye_data.length-1][0],eye_data[eye_data.length-1][1], 15,15);
                $('#build_map').text("Click here to start building your map")

            }
        }, 1000)
    }

    draw_loop();

}

function wait(ctx, i)
{
}

//-------------------------------------

//---------CALIBRATION FUNCTIONS-----------

// init listeners buttons to make the calibration of the eye track
function init_calibration_buttons(){

    // retrieving all buttons
    let buttons_elem = document.getElementsByClassName("calibration_buttons");

    // iterating over every button
    for(let i = 0; i<buttons_elem.length; i++)
    {
        // keeping track if how many times the buttons are clicked in object
        buttons[buttons_elem[i].id] = 0;

        // adding the event listener on click
        buttons_elem[i].addEventListener("click", function(data){

            // storing id of button
            let id = data.target.id;
            
            // if buttons has been clicked less than 5 times and increasing by 1
            if(buttons[id] < 5)
            {
                buttons[id]++;
                let opacity = 0.2*buttons[id]+0.2;
                $(this).css('opacity',opacity);
            }
            else
            {   //changing to green to alert user this is done
                $(this).css("background-color","green");

                // checking if all buttons are calibrated
                if(all_calibrated())
                {
                    // hiding all buttons
                    hide_calibration();
                }

            }
        })
    }
}

// checking if buttons are all calibrated
function all_calibrated()
{
    for(id in buttons)
    {
        console.log(buttons)
        if(buttons[id] <5){
            return false;
        }
    }

    return true;
}

// hides calibration buttons and shows map
function hide_calibration()
{
    $(".calibration_layout").hide();
    webgazer.showVideoPreview(false).showPredictionPoints(false);
    $(".map_layout").show();
}

//-------------------------------------------

//---------DATA FUNCTIONS-----------



function format_array(array){

    let formatted = "";

    for(let i = 0; i<array.length ; i++){
        formatted += array[i][0] + ";" + array[i][1] + ";" + array[i][2];
        if(i+1<array.length){
            formatted+="|";
        }
    }

    console.log(formatted);

    return formatted;z
}