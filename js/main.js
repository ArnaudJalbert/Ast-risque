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
JSON_DATA = "data/data.json"

$(window).on('load', function() {
    // hiding the map until the eye track has been calibrated
    $('.map_layout').hide();

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
            if(counter%50==0)
            {
                if(data != null){
                    webgazer.util.bound(data);
                    coords.push(round_to_ratio(data.x, data.y
                                              ,SCREEN_WIDTH, SCREEN_HEIGHT,
                                               MAP_WIDTH, MAP_HEIGHT));
                    console.log(coords);
                }
            }

            // stopping storing after 40 iterations
            if(counter>=100)
            {
                storing = false;
                counter = 0;
                append_to_json("arno", coords)
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
            $('#build_map').text("Recording your eye movement!");
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
    $(".map_layout").show();
}

//-------------------------------------------

//---------DATA FUNCTIONS-----------

function round_to_ratio(x, y, original_x, original_y, target_x, target_y)
{
    let new_x = Math.round((x*target_x)/original_x);
    let new_y = Math.round((y*target_y)/original_y);

    return [new_x,new_y];
}
function append_to_json(username, map_data)
{

    let json_data;
    $.getJSON("data/data.json", function (data) {
             json_data = data;
        }
    ).then(function () 
    {
        let json_obj = 
        {
            "username": username,
            "date": Date.now(),
            "data": map_data
        }
        
        json_data.push(json_obj)

        json_string = JSON.stringify(json_data);
        
        $.post('index.php', {post_jsondata:json_string},function (data) {
                console.log(data);
            });
    })

    coords = [];
    
}