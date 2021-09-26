// create Agora client
var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
var localTracks = {
  videoTrack: null,
  audioTrack: null
};
var remoteUsers = {};
// Agora client options
var options = { 
  appid: "608ffe7fce2a47248314b94e7b87b2fd",
  channel: null,
  uid: null,
  token: null
};



$("#share").click(async function (e) {
  e.preventDefault();
  try {
    options.appid = "608ffe7fce2a47248314b94e7b87b2fd"
    options.token = $("#token").val();
    options.channel = $("#channel").val();
    options.uid = Number($("#uid").val());
    await join();
    if(options.token) {
      $("#success-alert-with-token").css("display", "block");
    } else {
      $("#success-alert a").attr("href", `sharescreen.html?appid=${options.appid}&channel=${options.channel}&token=${options.token}`);
      $("#success-alert").css("display", "block");
    }
  } catch (error) {
    console.error(error);
  } finally {
    $("#leave").attr("disabled", false);
  }
})

$("#leave").click(function (e) {
  leave();
})

async function join() {
  // add event listener to play remote tracks when remote user publishs.
  client.on("user-published", handleUserPublished);
  client.on("user-unpublished", handleUserUnpublished);

  // join a channel and create local tracks, we can use Promise.all to run them concurrently
  [ options.uid, localTracks.audioTrack, localTracks.videoTrack ] = await Promise.all([
    // join the channel
    client.join(options.appid, options.channel, options.token || null, options.uid || null),
    // ** create local tracks, using microphone and screen
    AgoraRTC.createMicrophoneAudioTrack(),
    AgoraRTC.createScreenVideoTrack()
  ]);
 
  // play local video track
  localTracks.videoTrack.play("local-player");
  $("#local-player-name").text(`localVideo(${options.uid})`);

  // publish local tracks to channel
  await client.publish(Object.values(localTracks));
  console.log("publish success");
}

async function leave() {
  for (trackName in localTracks) {
    var track = localTracks[trackName];
    if(track) {
      track.stop();
      track.close();
      localTracks[trackName] = undefined;
    }
  }

  // remove remote users and player views
  remoteUsers = {};
  $("#remote-playerlist").html("");

  // leave the channel
  await client.leave();

  $("#local-player-name").text("");
  $("#join").attr("disabled", false);
  $("#leave").attr("disabled", true);
  console.log("client leaves channel success");
}

async function subscribe(user, mediaType) {
  const uid = user.uid;
  // subscribe to a remote user
  await client.subscribe(user, mediaType);
  console.log("subscribe success");
  if (mediaType === 'video') {
    const player = $(`
      <div id="player-wrapper-${uid}">
        <p class="player-name">remoteUser(${uid})</p>
        <div id="player-${uid}" class="player"></div>
      </div>
    `);
    $("#remote-playerlist").append(player);
    user.videoTrack.play(`player-${uid}`);
  }
  if (mediaType === 'audio') {
    user.audioTrack.play();
  }
}

function handleUserPublished(user, mediaType) {
  const id = user.uid;
  remoteUsers[id] = user;
  subscribe(user, mediaType);
}

function handleUserUnpublished(user) {
  const id = user.uid;
  delete remoteUsers[id];
  $(`#player-wrapper-${id}`).remove();
}