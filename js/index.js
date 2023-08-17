const wrapper = document.querySelector(".wrapper"),
musicImg =wrapper.querySelector(".img-area img"),
musicName =wrapper.querySelector(".song-details .name"),
musicArtist =wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;


window.addEventListener("load",() =>
{
    loadMusic(musicIndex);
    playingSong();

})
// Load music function
function loadMusic(indexNumb){
   musicName.innerText = allMusic[indexNumb-1].name;
   musicArtist.innerText = allMusic[indexNumb-1].artist;
   musicImg.src  = `images/${allMusic[indexNumb-1].img}.jpg`;
   mainAudio.src = `songs/${allMusic[indexNumb-1].src}.mp3`;
}

// play music function
function playMusic(){
     wrapper.classList.add("paused");
     playPauseBtn.querySelector("i").innerText="paused";
     mainAudio.play();
}
// pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText="play_arrow";
    mainAudio.pause();
}
// click Next function
function nextMusic(){
    musicIndex++;
    // LAP LAI nếu musicindex > length cua allmusic thi no se chay lai bai dau tien (=1_)
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}
// click Next function
function prevMusic(){
    musicIndex--;
    // lap lai khi chay ngươc lai khi musicindex < 1 thi no se = arraylength CHAY LAi bai cuoi
    musicIndex < 1 ?  musicIndex = allMusic.length  : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//play or pause music button event
playPauseBtn.addEventListener("click",()=>
{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingSong();
});
// Next button
nextBtn.addEventListener("click",()=>
{
       nextMusic();
});
// Prev button
prevBtn.addEventListener("click",()=>
{
       prevMusic();
});
// Update progess bar  wwith current time for music
mainAudio.addEventListener("timeupdate",(e)=>
{
    const currentTime = e.target.currentTime ; // getting current time of song
    const duration = e.target.duration ; // getting duration time of song
    let progressWidth = (currentTime/duration)*100;
    progressBar.style.width=`${progressWidth}%`;

// chinh time chay
    let musicCurrentTime =wrapper.querySelector(".current"),
    musicDuration =wrapper.querySelector(".duration");
    mainAudio.addEventListener("loadeddata",()=>
    {
         
          // update total duration for song
          let audioDuration = mainAudio.duration;
          let totalMin = Math.floor(audioDuration/60);
          let totalSec = Math.floor(audioDuration%60);
          if(totalSec<10){
            totalSec =`0${totalSec}`;
          }
          musicDuration.innerText = `${totalMin}: ${totalSec}`;      
    });
     // update play  current for song
         
     let currentMin = Math.floor(currentTime/ 60);
     let currentSec = Math.floor(currentTime %60);
     if(currentSec < 10){
       currentSec =`0${currentSec}`;
     }
     musicCurrentTime.innerText = `${currentMin}: ${currentSec}`;
});

// Update current time when click on the progess bar
progressArea.addEventListener("click",(e)=>
{
let progressWidthval = progressArea.clientWidth; // getting width of progessbar
let clickedOffSetX = e.offsetX ; // getting offset x value
let songDuration = mainAudio.duration;//getting song total duration
mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
playMusic(); 
playingSong();

});


// change loop,shuffle, repeat
 const repeatBtn =wrapper.querySelector("#repeat-plist");
 repeatBtn.addEventListener("click",()=>
 {
    // first we got change icon  when click 
    let  getText = repeatBtn.innerText;
    switch(getText)
{
    case "repeat":
    repeatBtn.innerText="repeat_one";
    repeatBtn.setAttribute("title", "Song looped");
    break;
    case "repeat_one":
    repeatBtn.innerText="shuffle";
    repeatBtn.setAttribute("title", "Playback shuffled");
    break;
    case "shuffle":
    repeatBtn.innerText="repeat";
    repeatBtn.setAttribute("title", "Playlist looped");
    break;
} 
})

// play song when change loop shuffle , repeat 
mainAudio.addEventListener("ended", ()=>{
    // we'll do according to the icon means if user has set icon to
    // loop song then we'll repeat the current song and will do accordingly
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch(getText){
      case "repeat":
        nextMusic(); //calling nextMusic function
        break;
      case "repeat_one":
        mainAudio.currentTime = 0; //setting audio current time to 0
        loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
        playMusic(); //calling playMusic function
        break;
      case "shuffle":
        let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
        do{
          randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
        musicIndex = randIndex; //passing randomIndex to musicIndex
        loadMusic(musicIndex);
        playMusic();
        playingSong();
        break;
    }
  });

  
  // Open and close icon listsong
  moreMusicBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
  });
  closemoreMusic.addEventListener("click", ()=>{
    moreMusicBtn.click();
  });

//
  const ulTag = wrapper.querySelector("ul");
  // let create li tags according to array length for list
  for (let i = 0; i < allMusic.length; i++) {
    //let's pass the song name, artist from the array
    let liTag = `<li li-index="${i + 1}">
                  <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                  </div>
                  <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                  <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag
    let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", ()=>{
      let duration = liAudioTag.duration;
      let totalMin = Math.floor(duration / 60);
      let totalSec = Math.floor(duration % 60);
      if(totalSec < 10){ //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
      };
      liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
      liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
    });
  }
  //play particular song from the list onclick of li tag
  function playingSong(){
    const allLiTag = ulTag.querySelectorAll("li");
    
    for (let j = 0; j < allLiTag.length; j++) {
      let audioTag = allLiTag[j].querySelector(".audio-duration");
      
      if(allLiTag[j].classList.contains("playing")){
        allLiTag[j].classList.remove("playing");
        let adDuration = audioTag.getAttribute("t-duration");
        audioTag.innerText = adDuration;
      }
      //if the li tag index is equal to the musicIndex then add playing class in it
      if(allLiTag[j].getAttribute("li-index") == musicIndex){
        allLiTag[j].classList.add("playing");
        audioTag.innerText = "Playing";
      }
      allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
  }
  //particular li clicked function
  function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadMusic(musicIndex);
    playMusic();
    playingSong();
  }