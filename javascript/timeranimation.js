let timer = null;
let catTop = 265;
let catLeft = 265;
let catSpeed = 1;

$(function() {

    $("#accel").val("속도:"+catSpeed);

    makeTimer("moveToTop", move("top"));
    makeTimer("moveToBottom", move("bottom"));
    makeTimer("moveToLeft", move("left"));
    makeTimer("moveToRight", move("right"));

    $("#pause").on("click", function() {
        pause();
    });    

    $("body").on("keydown", function(event) {
        if (event.keyCode == 37) move("left")();
        if (event.keyCode == 38) move("top")();
        if (event.keyCode == 39) move("right")();
        if (event.keyCode == 40) move("bottom")();
        if (event.keyCode == 37 && event.keyCode == 38) {
            move("left")();
            move("top")();
        }
        if (event.keyCode == 37 && event.keyCode == 40) {
            move("left")();
            move("bottom")();
        }
        if (event.keyCode == 39 && event.keyCode == 38) {
            move("right")();
            move("top")();
        }
        if (event.keyCode == 39 && event.keyCode == 40) {
            move("right")();
            move("bottom")();
        }                                
    });

    $("#accel").on("click", function() {
        catSpeed++;
        $("#accel").val("속도:"+catSpeed);
    });    

});

const makeTimer = function(id, f) {
    $("#" + id).on("click", function() {
        pause();
        timer = setInterval(f, 5);
    });
}

const pause = function() {
    clearInterval(timer);
};

const move = function() {
    const max = 540;
    const min = 10;
    let catDir = null;
    let displ = 0;
    switch (direction) {
        case "top":
            catDir = catTop;
            displ = min;
            break;
        case "bottom":
            catDir = catTop;
            direction = "top";
            displ = max;
            break;
        case "left":
            catDir = catTop;
            displ = min;
            break;
        case "right":
            catDir = catTop;
            displ = max;
            direction = "left";
    }
    if (direction == "top" || direction == "left") {
        return function() {
            if (catDir >= displ) {
                catDir -= catSpeed;
                $("#cat").css(direction, catDir + "px");
            }
        };
    } else {
        return function() {
            if (catDir <= displ) {
                catDir += catSpeed;
                $("#cat").css(direction, catDir + "px");
            }
        };
    }

}