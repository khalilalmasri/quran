const apiUrl = "https://mp3quran.net/api/v3/";
const reciters = "reciters";
const lang = "ar";

async function getReciters() {
  const chooseReciters = document.querySelector("#chooseReciters");
  const response = await fetch(`${apiUrl}${reciters}?language=${lang}`);
  const data = await response.json();
  console.log(data.reciters[0]);
  chooseReciters.innerHTML = `<option value="">اختر أسم القارئ</option>`;
  data.reciters.forEach((reciter) => {
    chooseReciters.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`;
  });
  chooseReciters.addEventListener("change", (e) => {
    getRewaya(e.target.value);
    getSorah(e.target.value);
  });
}
getReciters();
async function getRewaya(reciterId) {
  const chooseRewaya = document.querySelector("#chooseRewaya");
  const response = await fetch(
    `${apiUrl}${reciters}?language=${lang}&reciter=${reciterId}`
  );
  const data = await response.json();
  const myRwaya = data[reciters][0].moshaf;
  chooseRewaya.innerHTML = `<option value="" , data-server="", data-surahlist="">اختر الرواية</option>`;
  myRwaya.forEach(
    (moshaf) =>
      (chooseRewaya.innerHTML += `<option value="${moshaf.id}" , data-server="${moshaf.server}", data-surahlist="${moshaf.surah_list}">${moshaf.name}</option>`)
  );

  chooseRewaya.addEventListener("change", (e) => {
    const selectRewaya = chooseRewaya.options[chooseRewaya.selectedIndex];

    const sorahServer = selectRewaya.dataset.server;
    const sorahList = selectRewaya.dataset.surahlist;

    getSorah(sorahServer, sorahList);
  });
}
async function getSorah(sorahServer, sorahList) {
  const chooseSorah = document.querySelector("#chooseSorah");
  //   console.log(sorahServer);
  //   chooseSorah.innerHTML = "";
  const response = await fetch(`${apiUrl}suwar`);
  const data = await response.json();
  const sorahname = data.suwar;
  sorahList = sorahList?.split(",");
  chooseSorah.innerHTML = `<option value="">اختر السورة</option>`;
  sorahList?.forEach((surah) => {
    const padSurah = surah.padStart(3, "0");
    sorahname.forEach((sorahname) => {
      if (sorahname.id == surah) {
        // console.log(sorahname.name);
        chooseSorah.innerHTML += `<option value="${sorahServer}${padSurah}.mp3">${sorahname.name}</option>`;
      }
    });
  });

  chooseSorah.addEventListener("change", (e) => {
    const selectSorah = chooseSorah.options[chooseSorah.selectedIndex];
    playsurah(selectSorah.value);
    // const audio = new Audio(selectSorah.value);
    // audio.play();
  });
}
function playsurah(url) {
  const audioplayer = document.getElementById("audioplayer");
  audioplayer.src = url;
  audioplayer.play();
}
function playLive(urllll) {
  if (Hls.isSupported()) {
    var video = document.getElementById("video");
    var hls = new Hls();
    hls.loadSource(`${urllll}`);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  } 
}
