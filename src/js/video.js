const player = document.querySelector(".player");
const init = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const video = await Videos.getOneVideo(id);

  Videos.addVideoToPlayer(video, player);
};

init();
