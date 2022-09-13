window.addEventListener('DOMContentLoaded', () => {
    // Loader

    let body = document.querySelector('.body'),
        loader = document.querySelector('.loader');

    window.addEventListener('load', function () {

        loader.classList.add('loader_end')
        let interval = setInterval(remove, 300)

        function remove() {
            if (loader) {
                body.removeChild(loader)
                clearInterval(interval)
            }
        }

    })
//    Menu
    let menuItem = document.querySelectorAll('.promo__menu_item'),
        icon = document.querySelectorAll('.promo__menu_block i'),
        links = document.querySelectorAll('.promo__menu_links');

    menuItem.forEach((item, index) => {
        item.addEventListener('click', () => {
            links[index].classList.toggle('promo__menu_links_active')
            if (links[index].classList.contains('promo__menu_links_active')) {
                icon[index].className = "fas fa-angle-down"
            } else {
                icon[index].className = "fas fa-angle-right"
            }
        })
    })

//    Slider singer-page
    let left = document.querySelector('.left'),
        right = document.querySelector('.right'),
        slides = document.querySelectorAll('.promo__singer_list_link'),
        promo__singer_others = document.querySelector('.promo__singer_list'),
        index = 0;
    if (right) {
        right.addEventListener('click', () => {
            index++
            if (index > slides.length - 1) {
                index = 0
                slides.forEach(item => {
                    item.style.cssText = "transition: 0s;transform: translateX(0)"
                })

            }
            slides.forEach(item => {
                item.style.cssText = `transform: translateX(${-((item.clientWidth + 1) * index)}px)`
            })
        })
    }
    if (left) {
        left.addEventListener('click', () => {
            index--
            if (index < 0) {
                index = slides.length - 1
                slides.forEach(item => {
                    item.style.cssText = "transition: 0s;transform: translateX(0)"
                })
            }
            slides.forEach(item => {
                item.style.cssText = `transform: translateX(${-((item.clientWidth + 1) * index)}px)`
            })


        })
    }


//    Overflow login & register


    let overflow = document.querySelector('.overflow'),
        overflow_login = document.querySelector('.overflow_login'),
        promo = document.querySelector('.promo'),
        login_button = document.querySelector('.login'),
        link_register = document.querySelector('#register'),
        link_login = document.querySelector('#login'),
        overflow_register = document.querySelector('.overflow_register');

    let promo2 = document.createElement('section');
    login_button.addEventListener('click', () => {
        overflow.classList.add('overflow_active');
        promo2.classList.add("body_active")
        body.appendChild(promo2)
        overflow_login.classList.add('overflow_login_active');
        promo.classList.add('promo_active');
    })
    overflow.addEventListener('click', (event) => {
        if (overflow === event.target) {
            overflow.classList.remove('overflow_active');
            body.removeChild(promo2)
            overflow_login.classList.remove('overflow_login_active');
            promo.classList.remove('promo_active');
            overflow_register.classList.remove('overflow_register_active')
        }
    })


    link_register.addEventListener('click', (event) => {
        event.preventDefault()
        overflow.classList.add('overflow_active');
        overflow_login.classList.remove('overflow_login_active');
        promo.classList.add('promo_active');
        promo2.classList.add("body_active")
        body.appendChild(promo2)
        overflow_register.classList.add('overflow_register_active')
    })
    link_login.addEventListener('click', (event) => {
        event.preventDefault()
        overflow.classList.add('overflow_active');
        overflow_login.classList.add('overflow_login_active');
        promo.classList.add('promo_active');
        body.appendChild(promo2)
        overflow_register.classList.remove('overflow_register_active')
    })


    // window.addEventListener('scroll',(event)=>{
    //     console.log(document.querySelector('body').clientHeight)
    //     console.log(window.scrollY)
    // })
    // removeActClasses(overflow, "overflow_active")


})