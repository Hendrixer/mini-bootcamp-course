const Videos = {
  async getOneVideo(id) {
    const videos = await this.getVideos([id]);
    return videos[0];
  },
  async getVideos(ids) {
    const idsParam = ids.map((id) => id.split("/").pop()).join(",");
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=AIzaSyD2dLCttifKxWr9wPZ6j6VHemFQsa8rIec&id=${idsParam}`
    );

    const data = await res.json();
    const channelIds = [...new Set(data.items.map((i) => i.snippet.channelId))];
    const channelsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&key=AIzaSyD2dLCttifKxWr9wPZ6j6VHemFQsa8rIec&id=${channelIds.join(
        ","
      )}`
    );

    const channels = (await channelsRes.json()).items.reduce(
      (o, chan) => ({
        ...o,
        [chan.id]: chan
      }),
      {}
    );

    return data.items.map((item) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      id: item.id,
      channel: item.snippet.channelTitle,
      channelThumbnail:
        channels[item.snippet.channelId].snippet.thumbnails.medium.url,
      embed: `https://youtube.com/embed/${item.id}`,
      likes: +item.statistics.likeCount,
      dislikes: +item.statistics.dislikeCount,
      views: +item.statistics.viewCount,
      thumbnail:
        item.snippet.thumbnails.maxres?.url ??
        item.snippet.thumbnails.medium?.url
    }));
  },

  addVideoToPage(video, where) {
    var div = document.createElement("div");

    div.innerHTML = this.createTemplate(video).trim();
    const videoElement = div.firstChild;

    where.appendChild(videoElement);
  },

  addVideoToPlayer(video, where) {
    var div = document.createElement("div");

    div.innerHTML = this.createPlayerTemplate(video).trim();
    const videoElement = div.firstChild;

    where.appendChild(videoElement);
  },

  createPlayerTemplate(video) {
    return `
    <div>
    <iframe
        width="100%"
        class="embed"
        src="${video.embed}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <div class="player-info">
        <span class="player-title">${video.title}</span>
        <div class="player-stats row middle-xs betweem-xs">
          <div class="col-xs-10">
            <span>${video.views} views • </span>
            <span>Apr 18, 2021</span>
          </div>

          <div class="col-xs-2 thumbs row">
            <div class="col-xs">
              <span class="thumb up"><i class="ri-thumb-up-fill"></i></span>
              <span>${video.likes}</span>
            </div>
            <div class="col-xs">
              <span class="thumb down"><i class="ri-thumb-down-fill"></i></span>
              <span>${video.dislikes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  },

  createTemplate(video) {
    return `<div class="col-xs-12
    col-sm-6
    col-lg-3
    video-container
    ">
    <a class="row video-content" href="/video?id=${video.id}">
      <div class="video">
        <img src="${video.thumbnail}" />
      </div>
      <div class="video-info row">
        <div class="col-xs-2 channel-avatar">
          <img src="${video.channelThumbnail}" alt="" />
        </div>
        <div class="col-xs-10">
          <div class="video-title">
            ${video.title}
          </div>
          <div class="video-stats">
            <div>
              ${video.channel}
            </div>
            <div>
              ${video.views} views - 4 months ago
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
  `;
  }
};
