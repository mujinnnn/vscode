let frameCount = 0;

$(function() {
    imageAnimate();
});

const imageAnimate = function() {
    const timer = setInterval(function() {
        $("#청년").attr("src", `images/1/${frameCount++ % 4 + 1}.JPG`);
        $("#여학생").attr("src", `images/2/${frameCount++ % 4 + 1}.JPG`);
        $("#아가씨").attr("src", `images/3/${frameCount++ % 4 + 1}.JPG`);
        $("#꼬맹이").attr("src", `images/4/${frameCount++ % 4 + 1}.JPG`);
        $("#아저씨").attr("src", `images/5/${frameCount++ % 4 + 1}.JPG`);
    }, 300);
};

$(document).ready(function() {
    let animationIng = false;
    let intervalIds = [];
    let numPersons = $('.person').length;
    let personsFinished = 0;
    let results = [];

    $('#startBtn').click(function() {
        if (!animationIng) {
            animationIng = true;
            resetRace();
            $('.person').each(function() {
                movePerson($(this));
            });
        }
    });

    function movePerson(personElement) {
        const boxWidth = $('#box').width() - personElement.width();
        let curPosition = 0;
        let curSpeed = Math.floor(Math.random() * 5) + 1;
        let startTime = new Date().getTime();

        let intervalId = setInterval(function() {
            curPosition += curSpeed;
            personElement.css('left', curPosition);

            if (curPosition >= boxWidth) {
                clearInterval(intervalId);
                personsFinished++;
                let endTime = new Date().getTime();
                let elapsedTime = (endTime - startTime) / 1000;
                results.push({ id: personElement.attr('id'), time: elapsedTime.toFixed(2) });
                showResult(personElement.attr('id'), elapsedTime.toFixed(2));

                if (personsFinished === numPersons) {
                    animationIng = false;
                }
            } else {
                curSpeed = Math.floor(Math.random() * 10) + 5;
            }
        }, 50);

        intervalIds.push(intervalId);
    }

    function resetRace() {
        clearIntervalAll();
        $('#result').empty();
        personsFinished = 0;
        results = [];
    }

    function clearIntervalAll() {
        intervalIds.forEach(function(intervalId) {
            clearInterval(intervalId);
        });
        intervalIds = [];
    }

    function showResult(personId, elapsedTime) {
        const resultDiv = $('#result');
        resultDiv.append(`<p>${personId}이(가) ${elapsedTime}초 만에 결승선을 통과했습니다!</p>`);
    }
});