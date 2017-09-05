var canMove = true;
var stepDown = false;
var size = 50;
var array = [];
var isDown = false;
var genCount = 0;
var filling = true;
var playing = false; 
$(document).ready(function() {
    // var isDown = false
    // $(document).mousedown(function() {
    //     isDown = true;      // When mouse goes down, set isDown to true
    //   })
    //   .mouseup(function() {
    //     isDown = false;    // When mouse goes up, set isDown to false
    //   });
    
    $("#main").css("width", (size * 15) + "px")

    reset()
    
    draw(array);

    $('td').on("mouseover", function() {
        if(isDown) {
            var cell = $(this);
            var row = cell.data('row');
            var col = cell.data('col');
            setVal(row,col,filling);
        }
    });
    
    $('td').on("mousedown", function() {
        isDown = true;
        filling = !$(this).hasClass("toggled")
        setVal($(this).data("row"),$(this).data("col"),filling);
    });

    $('td').on("mouseup", function() {
        isDown = false;
    });
    $('button').on("mouseup", function() {
        isDown = false;
    });

    $(document).on('keydown', function(e) {
        if(e.keyCode == 83){
            nextGen();
        }
        if(e.keyCode == 80){
            playing = !playing;
            play();
        }
    })

    $(".button").on("mousedown", function(e) {
        if(this.id == 'play-pause') {
            playing = !playing;
            play();
        } else if(this.id == 'step') {
            stepDown = true;
            holdStep()
        } else if (this.id == 'clear') {
            reset()
        } else if (this.id == 'rand') {
            reset(true)
        }
    });

    $('#step').on('mouseup mouseleave', function() {
        stepDown = false;
    });
});

// setTimeout(function() { canMove = true; }, 250);
function holdStep() {
    if(stepDown) {

    nextGen(true)
    timeoutID = setTimeout(holdStep, 250);
}
}

function init() {
    for (var i = 0; i < size; i++) {
        array[i] = []
        for (var j = 0; j < size; j++) {
                array[i][j] = false
        }
    }
}

function reset(random) {
    genCount = 0;
    $("#gen-count").html("Generation: " + genCount)
    for (var i = 0; i < size; i++) {
        array[i] = []
        for (var j = 0; j < size; j++) {
            if(random) {
                setVal(i,j, Math.random() < 0.5)
            } else {
                setVal(i,j, false)
            }
        }
    }
}

function play() {
    
    if(playing) {
        $("#play-pause-icon").html("❚❚")
        $("#play-pause-icon").addClass("paused")
        setTimeout(function() { 
            canMove = true;
            nextGen(); 
            play();
        }, 250);
    } else {
        $("#play-pause-icon").html("►")
        $("#play-pause-icon").addClass("playing")
    }

}


function draw(array) {
    $("#board").empty();
    for (var i = 0; i < size; i++) {
        $("#board").append("<tr data-row='" + i + "'></tr>");
        for (var j = 0; j < size; j++) {
            $("#board").append("<td data-row='" + i + "' id='cell-" + i + '-' + j + "' data-col='" + j + "'></td>");
            if(array[i][j]) {
                $('cell' + i + '-' + j).addClass("toggled")
            }
        }
    }
}

function toggle(row, col) {
    var toggled = !array[row][col]; 
    setVal(row, col, toggled)
}

function setVal(row,col, toggled) {
    array[row][col] = toggled;
    if(toggled) {
        $("#cell-" + row + '-' + col).addClass("toggled");
    } else {
        $("#cell-" + row + '-' + col).removeClass('toggled');
    }
}

function numNeighbours(row, col) {
    var num = 0
    for (var i = Math.max(0, row - 1); i <=  Math.min(size - 1, row + 1); i++) {
        for (var j = Math.max(0, col - 1); j <=  Math.min(size - 1, col + 1); j++) {
            if(array[i][j]) {
                num++;
            }
        }   
    }
    if(array[row][col]) {
        num -= 1;
    }
    return num 
}

function nextGen(force) {
    if (!canMove && !force) return false;
    canMove = false;
    setTimeout(function() { canMove = true; }, 250);
    var changes = [];
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if(array[i][j] == false && numNeighbours(i,j) == 3) {
                changes.push([i,j])
            } else if (array[i][j] == true) {
                if(numNeighbours(i,j) < 2 || numNeighbours(i,j) > 3) {
                    changes.push([i,j])
                }
            }
        }
    }
    $.each(changes, function (index, pair) {
        toggle(pair[0], pair[1]);
    });
    genCount++;
    $("#gen-count").html("Generation: " + genCount)
}