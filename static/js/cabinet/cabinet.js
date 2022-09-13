const jsmediatags = window.jsmediatags;
document.querySelector('.insert__block_icon').addEventListener('click', function () {
    document.querySelector("#input").click()
})
let selected_img = document.querySelector(".insert__block_form div"),
    genre_button = document.querySelectorAll('.genre_button'),
    albums = document.getElementById('albums'),
    category_btn = document.querySelectorAll('.category_btn'),
    category = document.querySelector('.category'),
    singer_btn = document.querySelectorAll('.singer_btn'),
    singer_id = document.querySelector('.singer_id'),
    category_id = document.querySelector('.category_id'),
    genre_id = document.querySelector('.genre_id'),
    image_input = document.querySelector("#input_photo"),
    artist = document.querySelector('.artist'),
    list_albums = document.querySelector('.list_albums'),
    selected_title = document.querySelector("#title"),
    selected_artist = document.querySelector("#artist"),
    selected_album = document.querySelector("#album"),
    selected_genre = document.querySelector("#genre"),
    paragraphs = document.querySelectorAll('.insert__block_form p'),
    add_button = document.querySelector('.add_button'),
    input_title = document.querySelector('.title'),
    input_artist = document.querySelector('.artist'),
    input_album = document.querySelector('.album'),
    input_genre = document.querySelector('.genre');
let uploaded_image;
document.querySelector("#input").addEventListener("change", (event) => {

    const file = event.target.files[0];
    console.log(file)
    jsmediatags.read(file, {
        onSuccess: function (tag) {
            let format,
                base64String;
            paragraphs.forEach(p => {
                p.textContent = "";
            })

            // Array buffer to base64
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

            // Output media tags
            if (format && base64String) {
                selected_img.style.background = `url(data:${format};base64,${window.btoa(base64String)})center center/cover`;
                selected_img.style.cursor = "initial";
                changeImgMusic()
            } else {
                selected_img.style.background = 'url(/static/img/song_logo/404.png) center center/cover'
                changeImgMusic()
            }

            input_title.style.display = "initial";
            input_artist.style.display = "initial";
            input_album.style.display = "initial";
            input_genre.style.display = "initial";
            category.style.display = "initial";
            category.classList.add('insert__block_form_active')
            checkValue(category)
            if (tag.tags.title) {
                input_title.value = tag.tags.title;
                checkValue(input_title)
            } else {
                input_title.classList.add('insert__block_form_active')
                input_title.value = ""
                checkValue(input_title)
            }

            checkValue(input_artist)

            input_artist.classList.add('insert__block_form_active')

            checkValue(input_artist)


            input_album.classList.add('insert__block_form_active')

            checkValue(input_album)

            input_genre.classList.add('insert__block_form_active')

            checkValue(input_genre)


            add_button.style.display = "initial"
        },
        onError: function (error) {
            console.log(error);
        }
    });
});

function checkValue(input) {
    input.addEventListener('input', () => {
        if (input.value !== "") {
            input.classList.remove('insert__block_form_active')
        } else {
            input.classList.add('insert__block_form_active')
        }
    })
}

function changeImgMusic() {
    selected_img.style.cursor = "pointer";
    selected_img.addEventListener('click', function () {
        image_input.click()
    })

    image_input.addEventListener('change', function () {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            uploaded_image = reader.result;
            selected_img.style.cursor = "initial";
            selected_img.style.background = `url(${uploaded_image})center center/cover`;
            image_input.filename = uploaded_image

        });
        reader.readAsDataURL(this.files[0]);
    });
    console.log(image_input.filename)
}

// Cabinet

// Select

let category_select,
    genres = document.querySelector('#genres'),
    singers = document.querySelector('#singers'),
    singer_block = document.querySelector('#singer_block'),
    category_block = document.querySelector('#category_block'),
    album_block = document.querySelector('#album_block'),
    genre_block = document.querySelector('#genre_block'),
    insert__category_block = document.querySelector('#category');

let promo2 = document.createElement('section');


category_block.addEventListener('click', () => {
    checkGenre()
    list_albums.innerHTML = ""
    category_select = "category"
    insert__category_block.classList.add('insert__category_block_active');
    genres.classList.remove('insert__category_block_active');
    singers.classList.remove('insert__category_block_active');
    category_block.classList.add('insert__category_select_btn_active');
    singer_block.classList.remove('insert__category_select_btn_active')
    genre_block.classList.remove('insert__category_select_btn_active')
})
singer_block.addEventListener('click', () => {
    checkGenre()
    list_albums.innerHTML = ""
    category_select = "singer"
    insert__category_block.classList.remove('insert__category_block_active');
    genres.classList.remove('insert__category_block_active');
    singers.classList.add('insert__category_block_active');
    category_block.classList.remove('insert__category_select_btn_active');
    singer_block.classList.add('insert__category_select_btn_active')
    genre_block.classList.remove('insert__category_select_btn_active')
})
genre_block.addEventListener('click', () => {
    checkGenre()
    list_albums.innerHTML = ""
    category_select = "genre"
    insert__category_block.classList.remove('insert__category_block_active');
    genres.classList.add('insert__category_block_active');
    singers.classList.remove('insert__category_block_active');
    category_block.classList.remove('insert__category_select_btn_active');
    singer_block.classList.remove('insert__category_select_btn_active')
    genre_block.classList.add('insert__category_select_btn_active')
})

// Category

let new_category = document.querySelectorAll('.new_category'),
    body = document.querySelector('.body'),
    promo = document.querySelector('.promo'),
    overlay_category_input = document.querySelector('.overlay_category input'),
    overlay_category = document.querySelector('.overlay_category'),
    category_list = document.querySelectorAll('.list_categories'),
    overlay_singer = document.querySelector('.overlay_singer'),
    new_singer = document.querySelector('.new_singer'),
    input_category = document.querySelector('.overlay_category input'),
    overlay = document.querySelector('.overlay'),
    index_category = 0,
    singer_id_chosen = 0,
    addCategory = document.querySelector('.overlay_category button');

new_singer.addEventListener('click', () => {
    overlay.classList.add('overlay_active');
    promo.classList.add('promo_active');
    promo2.classList.add("body_active")
    body.appendChild(promo2)
    overlay_singer.classList.add('overlay_singer_active')
})
new_category.forEach((button, index) => {
    button.addEventListener('click', () => {
        index_category = index
        console.log(index_category, index)
        overlay.classList.add('overlay_active');
        promo.classList.add('promo_active');
        promo2.classList.add("body_active")
        body.appendChild(promo2)
        overlay_category.classList.add('overlay_category_active')
        if (index === 1) {
            overlay_category_input.placeholder = "Enter new genre"
        } else {
            overlay_category_input.placeholder = "Enter new category"
        }
    })
})


function removeActClasses(click_item, class_item) {
    click_item.addEventListener('click', (event) => {
        if (click_item === event.target) {
            click_item.classList.remove(`${class_item}`);
            overlay_category.classList.remove('overlay_category_active')
            promo.classList.remove('promo_active');
            console.log(promo2.parentNode)
            body.removeChild(promo2)
            overlay_singer.classList.remove('overlay_singer_active')
        }
    })
}

function removeAct2(click_item, class_item) {

    click_item.classList.remove(`${class_item}`);
    overlay_category.classList.remove('overlay_category_active')
    promo.classList.remove('promo_active');
    console.log(promo2.parentNode)
    body.removeChild(promo2)

}


removeActClasses(overlay, "overlay_active")
categoryGenreSingerForm()
singer_btn.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        btn.classList.add('insert__category_select_btn_active');
        list_albums.innerHTML = "";
        singer_id_chosen = btn.dataset.id;
        albums.style.display = "flex"
        console.log(btn.dataset.id)
        fetch('/get_albums', {
            method: "POST",
            body: JSON.stringify({
                "singer_id": btn.dataset.id
            }),
            headers: {
                "Content-type": "application/json"
            }
        })
            .then(function (response) {
                return response.json()
            })
            .then(function (jsonResponse) {
                console.log(jsonResponse['names'])
                for (let i = 0; i < jsonResponse['names'].length; i++) {
                    list_albums.innerHTML += `<button data-id="${jsonResponse['id']}" class="album_btn">${jsonResponse['names'][i]}</button>`
                }
                list_albums.innerHTML += `<button class="new_album"><i class="fas fa-plus"></i></button>`

                let new_album = document.querySelector('.new_album');
                new_album.addEventListener('click', () => {
                    overlay.classList.add('overlay_active');
                    promo.classList.add('promo_active');
                    promo2.classList.add("body_active")
                    body.appendChild(promo2)
                    category_select = "album"
                    overlay_category.classList.add('overlay_category_active')
                    overlay_category_input.placeholder = "Enter new album"
                })
                document.querySelectorAll('.album_btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        input_album.value = btn.innerHTML;
                        input_album.classList.remove('insert__block_form_active')
                    })
                })

            })
    })
})

function categoryGenreSingerForm() {
    addCategory.addEventListener('click', (event) => {
        event.preventDefault()

        if (input_category.value) {
            removeAct2(overlay, "overlay_active")
            fetch('/add_info/', {
                method: 'POST',
                body: JSON.stringify({
                    'category': input_category.value,
                    'type': category_select,
                    "singer_id_chosen": singer_id_chosen
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    let insert__flash = document.createElement('div'),
                        container = document.querySelector('.insert_2');

                    insert__flash.className = "insert__flash";
                    insert__flash.innerHTML = `
                        <div class="insert__flash_box">
                                <div class="insert__flash_info">Category has been successfully added</div>
                                <span>&cross;</span>
                            </div>
                        <div class="insert__flash_block">
                            <div class="insert__flash_line"></div>
                        </div>
                    `
                    container.appendChild(insert__flash)
                    let internal = setInterval(extra, 3000)

                    if (document.querySelector('.insert__flash_box span')) {
                        document.querySelector('.insert__flash_box span').addEventListener('click', () => {
                            container.removeChild(insert__flash)
                        })
                    }

                    function extra() {
                        container.removeChild(insert__flash)
                        clearInterval(internal)
                    }

                    return response.json();
                })
                .then(function (jsonResponse) {
                    let button_category = document.createElement('button');
                    button_category.innerHTML = jsonResponse['category'];
                    button_category.dataset.id = jsonResponse['id']
                    if (category_select === "genre") {
                        button_category.className = "genre_button"
                    } else {
                        button_category.className = "category_btn"
                    }
                    category_list[index_category].insertBefore(button_category, new_category[index_category]);

                    input_category.value = "";
                    category_btn = document.querySelectorAll('.category_btn');
                    genre_button = document.querySelectorAll('.genre_button');
                    sendDataInput(genre_button, input_genre, genre_id)
                    sendDataInput(category_btn, category, category_id)
                    sendDataInput(singer_btn, artist, singer_id)
                })
        } else {
            alert('fill input')
        }
    })
}

function sendDataInput(button, input, input_id) {
    button.forEach(btn => {
        btn.addEventListener('click', () => {
            input.value = btn.innerHTML;
            input.classList.remove('insert__block_form_active')
            input_id.value = btn.dataset.id;
        })
    })
}

sendDataInput(genre_button, input_genre, genre_id)
sendDataInput(category_btn, category, category_id)
sendDataInput(singer_btn, artist, singer_id)

function checkGenre() {
    genre_button.forEach(btn => {
        if (input_genre.value === btn.innerHTML) {
            btn.classList.add('insert__category_select_btn_active')
        }
    })
}


