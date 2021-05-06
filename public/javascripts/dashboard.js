getLibraryDetails();


function getLibraryDetails() {
  $.get("/admin/info", function (data) {
    $(".disk-space").html(data.size + " MB");
    $(".song-count").html(data.songs.length);
  });
}

