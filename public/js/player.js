var player = document.getElementById("player");

function play() {
  player.play();
  $("#play-btn").attr("src", "/img/pause.svg");
}

function pause() {
  player.pause();
  $("#play-btn").attr("src", "/img/play.svg");
}

var isPlaying = false;

function toggleState() {
  if (!isPlaying) {
    play();
    isPlaying = true;
  } else {
    pause();
    isPlaying = false;
  }
}

function seekToStart() {
  player.currentTime = 0;
}

function changeSong(uid) {
  console.log("/get-details/" + uid);
  $.get("/get-details/" + uid, function (data) {
    console.log(data);
    $(".player-song-title").html(data.title);
    $(".player-song-artist").html(data.artist);
    collapseSearch();
    stop();
    $("#player").attr("src", "/stream/" + uid);
    seekToStart();
    play();
  });
}

player.addEventListener("timeupdate", function () {
  var currentTime = player.currentTime;
  $(".current-time").html(secondsToTime(currentTime));
  var duration = player.duration;
  $(".duration").html(secondsToTime(duration));
  if (currentTime >= duration) {
    isPlaying = false;
    pause();
    seekToStart();
  }
  $(".progress-bar-slider")
    .stop(true, true)
    .animate(
      { width: ((currentTime + 0.25) / duration) * 100 + "%" },
      250,
      "linear"
    );
});

function secondsToTime(secs) {
  secs = parseInt(secs);
  var mins = parseInt(secs / 60);
  secs = secs % 60;
  return (
    mins.toString().padStart(2, "0") + ":" + secs.toString().padStart(2, "0")
  );
}
