if ("mediaSession" in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "Windfall",
    artist: "TheFatRat",
    album: "The Ultimate Collection (Remastered)",
    artwork: [
      { src: "/img/cover.jpg", sizes: "96x96", type: "image/png" },
      { src: "/img/cover.jpg", sizes: "128x128", type: "image/png" },
      { src: "/img/cover.jpg", sizes: "192x192", type: "image/png" },
      { src: "/img/cover.jpg", sizes: "256x256", type: "image/png" },
      { src: "/img/cover.jpg", sizes: "384x384", type: "image/png" },
      { src: "/img/cover.jpg", sizes: "512x512", type: "image/png" },
    ],
  });

  navigator.mediaSession.setActionHandler("play", play);
  navigator.mediaSession.setActionHandler("pause", pause);
  navigator.mediaSession.setActionHandler("stop", pause);
  navigator.mediaSession.setActionHandler("previoustrack", seekToStart);
  navigator.mediaSession.setActionHandler("nexttrack", changeSong);
}
