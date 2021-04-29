var player = document.getElementById("player");
changeSong("d9q37ariyojueyswe4qx"), 500;

function play() {
  player.play();
  if (player.paused) {
    return;
  }
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
  $.get("/get-details/" + uid, function (data) {
    $(".player-song-title").html(data.song.title);
    $(".player-song-artist").html(data.song.artist);
    $(".main-container").css(
      "background-image",
      "url(/data/" + data.song.uid + "/cover.png)"
    );
    if (data.accent != null) {
      $(".progress-bar-slider").css(
        "background-color",
        "rgb(" +
          data.accent[0] +
          "," +
          data.accent[1] +
          "," +
          data.accent[2] +
          ")"
      );
    } else {
      $(".progress-bar-slider").css("background-color", "#e22849");
    }
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

$(document).on("keypress", function (e) {
  if (e.which == 32) {
    toggleState();
  }
});

function secondsToTime(secs) {
  secs = parseInt(secs);
  var mins = parseInt(secs / 60);
  secs = secs % 60;
  return (
    mins.toString().padStart(2, "0") + ":" + secs.toString().padStart(2, "0")
  );
}

function preloadImage(url) {
  var img = new Image();
  img.src = url;
}
