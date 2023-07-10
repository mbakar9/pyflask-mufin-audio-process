
var $visualizers = $('.visualizer>div');
var songLength = 219;
var percentage = 0
var $time = $('.time');
var $player = $('.player');

var audio = new Audio('http://localhost:5000/static/test.mp3');

var playRunner = null;

function go() {
    audio.play();
    playRunner = setInterval(function() {
        $visualizers.each(function() {
        $(this).css('height', Math.random() * 90 + 10 + '%');
        });
    }, 250);
};

$('.play-button').on('click', function() {
    $player.toggleClass('paused').toggleClass('playing');
    if (playRunner) {
        audio.pause();
        clearInterval(playRunner);
        playRunner = null;
        $time.text(calculateTime(songLength, 100));
    } else {
        percentage = 0;
        go();
    }
});

function calculateTime(songLength, percentage) {
    var currentLength = songLength / 100 * percentage;
    var minutes = Math.floor(currentLength / 60);
    var seconds = Math.floor(currentLength - (minutes * 60));
    if (seconds <= 9) {
        return (minutes + ':0' + seconds);
    } else {
        return (minutes + ':' + seconds);
    }
}

clearInterval(playRunner);