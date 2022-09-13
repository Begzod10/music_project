let audios = document.querySelectorAll('.audios'),
    urls = [],
    status = 0,
    music_number = 0,
    mute_volume = true,
    volume_show = document.querySelector('#volume_show'),
    volume_input = document.querySelector('#volume_input'),
    volume_img = document.getElementById('volume_img'),
    previous_volume = volume_input.value,
    only_one = false,
    rotate = false,
    download_link = document.querySelector('.download_link a'),
    menu_song_name = document.querySelector('.promo__singer_song'),
    menu_play = document.querySelector('#menu_play'),
    menu_song_added = document.querySelector('.promo__singer_add'),
    menu_img = document.querySelector('.promo__singer_logo'),
    menu_audio = document.querySelector('.promo__singer_audio'),
    arrow = document.querySelector('#arrow'),
    duration_container = document.querySelector('.footer__block__music_block'),
    inside_container = document.querySelector('.footer__block__music_container'),
    singer_names = document.querySelectorAll('.promo__music_info span a'),
    active_singer = document.querySelector('.active_singer'),
    active_name = document.querySelector('.active_name'),
    active_text = document.querySelector('.footer__block__music_title'),
    music_durations = document.querySelectorAll('.promo__music_duration'),
    active_ms_duration = document.querySelector('#end_duration'),
    music_names = document.querySelectorAll('.music_names'),
    music_block = document.querySelectorAll('.promo__music_item'),
    active_audio = document.querySelector('.active_audio'),
    play_all = document.querySelectorAll('.play_all i'),
    play = document.querySelector('#play'),
    left = document.querySelector('#left'),
    right = document.querySelector('#right'),
    music_img = document.querySelectorAll('.promo__music_img img');
audios.forEach(aud => {
    urls.push(aud.src)
})
menu_song_name.innerHTML = music_names[0].dataset.text;
menu_song_added.innerHTML = music_names[0].dataset.date;
menu_audio.src = audios[0].src;
download_link.href = `/download_mp3/${music_names[0].dataset.id}`
music_block.forEach((item, index) => {
    item.addEventListener('click', () => {
        menu_song_name.innerHTML = music_names[index].dataset.text;
        menu_song_added.innerHTML = music_names[index].dataset.date;
        menu_audio.src = audios[index].src;
        download_link.href = `/download_mp3/${music_names[index].dataset.id}`
        let file = audios[index].src;
        menu_audio.src = file;
        jsmediatags.read(file, {
            onSuccess: function (tag) {
                let format,
                    base64String;
                if (tag.tags.picture) {
                    let data = tag.tags.picture.data;
                    format = tag.tags.picture.format;
                    base64String = "";
                    for (let i = 0; i < data.length; i++) {
                        base64String += String.fromCharCode(data[i]);
                    }
                } else {
                    format = ""
                }
                if (format && base64String) {
                    menu_img.src = `data:${format};base64,${window.btoa(base64String)}`;
                } else {
                    selected_img.src = '/static/img/song_logo/404.png'

                }
            },
            onError: function (error) {
                console.log(error);
            }
        });
    })
})
menu_play.addEventListener('click', () => {
    let get_index = urls.indexOf(menu_audio.src)
    music_number = get_index;
    checkMusicStatus()
})
arrow.addEventListener('click', () => {
    status++
    if (status === 0) {
        arrow.src = "/static/icons/share-solid.svg"
        only_one = false
        rotate = false
    } else if (status === 1) {
        arrow.src = "/static/icons/arrow-rotate-right-solid.svg"
        only_one = false
        rotate = true
    } else if (status === 2) {
        arrow.src = "/static/icons/arrows-rotate-solid.svg"
        only_one = true
        rotate = false
    } else {
        only_one = false
        rotate = false
        arrow.src = "/static/icons/share-solid.svg";
        status = 0
    }
    arrow.classList.add('footer__icon_active')

})
audios.forEach((aud, index) => {

    let file = aud.src
    jsmediatags.read(file, {
        onSuccess: function (tag) {
            let format,
                base64String;
            if (tag.tags.picture) {
                let data = tag.tags.picture.data;
                format = tag.tags.picture.format;
                base64String = "";
                for (let i = 0; i < data.length; i++) {
                    base64String += String.fromCharCode(data[i]);
                }
            } else {
                format = ""
            }
            if (format && base64String) {
                music_img[index].src = `data:${format};base64,${window.btoa(base64String)}`;
            } else {
                selected_img.src = '/static/img/song_logo/404.png'

            }
            console.log(tag.tags.picture)
            // Output media tags


        },
        onError: function (error) {
            console.log(error);
        }
    });
})
play_all.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        music_number = index
        checkMusicStatus()

    })
})

function statusPaused(index) {
    play_all[index].className = "fas fa-pause-circle"
    play.className = "fas fa-pause-circle"
    music_block[index].classList.add('promo__music_item_active')
    active_text.classList.add('footer__block__music_title_active');
}

function removeAllActives() {
    play_all.forEach((icon, index) => {
        icon.className = "fas fa-play-circle"
        play.className = "fas fa-play-circle"
        music_block[index].classList.remove('promo__music_item_active')
    })
}

function statusPLay(index) {
    play.className = "fas fa-play-circle";
    play_all[index].className = "fas fa-play-circle";
    active_text.classList.remove('footer__block__music_title_active');
    music_block[index].classList.remove('promo__music_item_active');
}

function checkMusicStatus() {
    if (active_audio.src !== urls[music_number]) {
        active_audio.src = urls[music_number];
        active_singer.innerHTML = singer_names[music_number].innerHTML;
        active_name.innerHTML = music_names[music_number].dataset.text;
        active_ms_duration.innerText = music_durations[music_number].innerText;
        menu_song_name.innerHTML = music_names[music_number].dataset.text;
        menu_song_added.innerHTML = music_names[music_number].dataset.date;
        menu_audio.src = audios[music_number].src;
        download_link.href = `/download_mp3/${music_names[music_number].dataset.id}`
        removeAllActives()
    }
    if (active_audio.paused) {
        active_audio.play()
        statusPaused(music_number)
    } else {
        statusPLay(music_number)
        active_audio.pause()
    }
}

play.addEventListener('click', () => {
    checkMusicStatus()
})
right.addEventListener('click', () => {
    music_number++
    if (music_number > urls.length - 1) {
        music_number = 0
    }
    checkMusicStatus()
})
left.addEventListener('click', () => {
    music_number--
    if (music_number < 0) {
        music_number = urls.length - 1
    }
    checkMusicStatus()
})

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    console.log(clickX)
    const duration = active_audio.duration;
    active_audio.currentTime = (clickX / width) * duration;
}

function updateProgress(e) {
    const {duration, currentTime} = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    inside_container.style.width = `${progressPercent}%`;
    songDur()
    if (active_audio.ended) {
        if (music_number === urls.length - 1 && rotate === false) {
            active_audio.currentTime = 0;
            active_audio.pause()
            statusPLay(music_number)
            music_number = 0
        } else {
            if (!only_one) {
                music_number++
            }
            if (music_number > urls.length - 1) {
                music_number = 0
            }
            checkMusicStatus()
        }
    }
}


function songDur() {
    setInterval(function () {
        let timeRemaining = active_audio.duration - active_audio.currentTime;
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = Math.floor(timeRemaining % 60);

        let secondsWithLeadingZero = seconds < 10 ? '0' + seconds : seconds;

        $('#end_duration').text(0 + "" + minutes + ':' + secondsWithLeadingZero);
    }, 500);
}

volume_img.addEventListener('click', mute)

function statusMute() {
    volume_img.src = "/static/icons/mute-2-512.png"
    volume_input.value = 0;
    volume_show.innerHTML = 0;
    mute_volume = false;
}

function statusUnMute() {
    volume_img.src = "/static/icons/volume-up-4-512.png"
    console.log(previous_volume)
    if (previous_volume) {
        volume_input.value = previous_volume
        volume_show.innerHTML = previous_volume
    }

    mute_volume = true;
}

function mute() {
    if (mute_volume) {

        statusMute()
    } else {
        statusUnMute()


    }

}

volume_input.addEventListener('change', changeVolume)

function changeVolume() {
    previous_volume = volume_input.value
    active_audio.volume = volume_input.value / 100;
    if (volume_input.value === 0) {
        statusMute()
    } else {
        statusUnMute()
    }
}

active_audio.addEventListener('timeupdate', updateProgress)
duration_container.addEventListener('click', setProgress)