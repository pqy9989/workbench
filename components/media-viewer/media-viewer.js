document.querySelectorAll('.media-viewer__fullscreen').forEach((button) => {
  button.addEventListener('click', async () => {
    const feed = button.closest('.media-viewer__feed');

    if (document.fullscreenElement === feed) {
      await document.exitFullscreen();
      return;
    }

    if (document.fullscreenElement) await document.exitFullscreen();
    await feed.requestFullscreen();
  });
});
