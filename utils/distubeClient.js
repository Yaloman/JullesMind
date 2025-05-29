console.log("🚧 Laster distubeClient.js");


  const { DisTube } = require("distube");
  const { SpotifyPlugin } = require("@distube/spotify");
  //const { SoundCloudPlugin } = require("@distube/soundcloud");
  const { YtDlpPlugin } = require("@distube/yt-dlp");

  console.log("✅ distube avhengigheter importert");

  module.exports = (client) => {
    const distube = new DisTube(client, {
      leaveOnStop: true,
      emitNewSongOnly: true,
      plugins: [
        new SpotifyPlugin(),
        //new SoundCloudPlugin(),
        new YtDlpPlugin()
      ]
    });

    client.distube = distube;
    console.log("✅ DisTube satt opp og koblet til client");
  };
