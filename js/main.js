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
            if(counter%50==0)
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
            if(counter>=300)
            {
                storing = false;
                counter = 0;
                $('#build_map').text("Recording of your eye finished, starting the livestream!");
                append_to_json("arno", coords)
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
            $('#build_map').text("Recording your eye movement...");
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

function round_to_ratio(x, y, original_x, original_y, target_x, target_y)
{
    rounded_x = Math.round(x);
    rounded_y = Math.round(y);

    horizontal_space = Math.round((original_x-target_x)/2);
    starting_x = horizontal_space;
    ending_x = original_x-horizontal_space;


    vertical_space = Math.round((original_y-target_y)/2);
    starting_y = vertical_space;
    ending_y = original_y-vertical_space;


    console.log('Bounds X: ['+starting_x + "," +ending_x + "]")
    console.log("X: " + rounded_x)
    console.log('Bounds Y: ['+starting_y + "," +ending_y + "]")
    console.log("Y: " + rounded_y)


    if(!(starting_x<=rounded_x && rounded_x<=ending_x))
    {
        return null;
    }

    if(!(starting_y<=rounded_y && rounded_y<=ending_y))
    {
        return null;
    }

    ratioed_x = rounded_x - horizontal_space;
    ratioed_y = rounded_y - vertical_space;

    return [ratioed_x, ratioed_y];
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

        
        let request = json_obj.date
        let json_string = JSON.stringify(json_data);
        
        $.post('index.php', {post_jsondata:json_string},function (data) {
                console.log("Storing data");
        });

        $.post('index.php', {new_request:request},function (data) {
            console.log("Storing request");
        });
    })

    eye_data = map_data;

    coords = [];
    
}