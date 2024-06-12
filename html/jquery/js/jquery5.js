$(function() {

    $("#btn1").click(function() {
        $("#div1").hide();
    });

    $("#btn2").click(function() {
        $("#div1").show();
    });

    $("#btn3").click(function() {
        $("#div1").toggle();
    });

    $("#btn4").click(function() {
        $("#div1").fadeIn();
    });

    $("#btn5").click(function() {
        $("#div1").fadeOut();
    });

    $("#btn6").click(function() {
        $("#div1").fadeToggle();
    });

    $("#btn7").click(function() {
        $("#div1").slideDown();
    });

    $("#btn8").click(function() {
        $("#div1").slideUp();
    });

    $("#btn9").click(function() {
        $("#div1").slideToggle();
    });

    $("#btn10").click(function() {
        $("#div1").animate({
            width:"+=150px", 
            height:"-=100px", 
            borderWidth: "5px"
        }, "slow");
    });

    $("#btn11").click(function() {
        $("#div1").fadeOut(1000).fadeIn(500).slideUp(2000).slideDown(1000)
            .animate({width: "+=200px", height:"+=100px"});
    });

    $("#btn12").click(function() {
        $("#div1").fadeOut(2000, function() {
            alert("fadeOut 완료!!!");
        });
    });

    $("#btn13").click(function() {
        $("#div1").fadeOut(5000).fadeIn(2000).slideUp(2000).slideDown(2000);
    });

    $("#btn14").click(function() {
        // 첫번째 true : 모든 이펙트 중지
        // 두번째 true : 현재 이펙트는 끝까지 실행하고 중지
        $("#div1").stop(true, true);
    });

});
