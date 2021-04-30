var player = document.getElementById("player");
var hoverPercentage = 0;
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
    collapseSearch();
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
    stop();
    $("#player").attr("src", "/stream/" + uid);
    seekToStart();
    play();
  });
}



player.addEventListener("timeupdate", function () {
  $(".progress-bar").removeClass("progress-bar-buffering");
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





$("body").on("keypress", function (e) {
  if (e.which == 32) {
    if ($("input").is(":focus")) {
      return;
    } else {
      toggleState();
    }
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

$(".progress-bar").mousemove(function (e) {
  var parentOffset = $(".progress-bar").offset();
  var parentWidth = $(".progress-bar").width();
  //or $(this).offset(); if you really just want the current element's offset
  var relX = e.pageX - parentOffset.left;
  hoverPercentage = (relX / parentWidth) * 100;
  if (hoverPercentage > 100) {
    return;
  }
  $(".progress-bar-hover-slider ").width("5px");
  $(".progress-bar-hover-slider ").css("left", hoverPercentage + "%");
  $(".hover-timestamp").html(
    secondsToTime(player.duration * (hoverPercentage / 100))
  );
});

$(".progress-bar").mouseenter(function (e) {
  $(".hover-timestamp").css("visibility", "visible");
});

$(".progress-bar").mouseleave(function (e) {
  $(".progress-bar-hover-slider ").width(0);
  $(".hover-timestamp").css("visibility", "hidden");
});

$(".progress-bar").click(function (e) {
  player.currentTime = (player.duration * hoverPercentage) / 100;
});
