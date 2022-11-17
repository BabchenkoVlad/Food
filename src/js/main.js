window.addEventListener('DOMContentLoaded', () => {

  const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.style.display = 'none';
    });

    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].style.display = 'block';
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener('click', (event) => {
    const target = event.target;
    
    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });


  // Используем классы для карточек

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement('div');
      
      if (this.classes.length === 0) {
          this.element = 'menu__item';
          element.classList.add(this.element);
      } else {
          this.classes.forEach(className => element.classList.add(className));
      }

      element.innerHTML = ` 
          <img src=${this.src} alt=${this.alt}>
          <h3 class="menu__item-subtitle">${this.title}</h3>
          <div class="menu__item-descr">${this.descr}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
              <div class="menu__item-cost">Цена:</div>
              <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
          </div>
      `;
      this.parent.append(element);
    }
  }

  // const div = new MenuCard();
  // div.render();

  new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    9,
    ".menu .container"
  ).render();

  new MenuCard(
    "img/tabs/post.jpg",
    "post",
    'Меню "Постное"',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    14,
    ".menu .container"
  ).render();

  new MenuCard(
    "img/tabs/elite.jpg",
    "elite",
    'Меню “Премиум”',
    'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    21,
    ".menu .container"
  ).render();


  // модальное окно
  const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    // kompaktniu variant
    //  modal.classList.toggle('show');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  }

  modalTrigger.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    // kompaktniu variant
    //  modal.classList.toggle('show');
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribut('data-close') == '') {
    closeModal();
    }
  });

  document.activeElement('keydown', (e) => {
    if (e.code === "Escape" && modal.classList.contains('show')) {
    closeModal();
    }
  });

  // vizov modalki cherez 10 sec
  const modalTimerId = setTimeout(openModal, 10000);

  // modal after scroll down
  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
    openModal();
    window.removeEventListener('scroll', showModalByScroll);
    }
  }

  window.addEventListener('scroll', showModalByScroll);




  // forms
  // otpravka ne JSON zaprosa

  const forms = document.querySelectorAll('form');

  const massage = {
    loading: '../spinner.svg',
    success: 'Spasibo! mi s vami svyagemsya',
    failure: 'chto to poshlo ne tak'
  };

  forms.forEach(item => {
    postData(item);
  });

  function postData(form) {
    form.querySelectorAll('submit', (e) => {
      e.preventDefault();

      const statusMassage = document.createElement('img');
      statusMassage.src = message.loading;
      statusMassage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement('afterend', statusMassage);

      // старый вариант отправки запросов на сервер
      // const request = new XMLHttpRequest();
      // request.open('POST', 'server.php');
      
      

      // XMLHttpRequest + multipart/form-data = NE OTPRAVIT NA SERVER
      // request.setRequestHeader('Content-type', 'multipart/form-data');
      // dlya JSON zaprosa
      // request.setRequestHeader('Content-type', 'application/json');
      const formData = new FormData(form);

      // JSON
      const object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });

      fetch('server.php', {
        method: "POST",
        body: JSON.stringify(object),
        headers: {
          'Content-type': 'aplication/json'
      }
      }).then(data => {
        data.text();
      }).then(data => {
        console.log(data);
        showThanksModal(massage.success);
        statusMassage.remove();
      }).catch(() => {
        showThanksModal(massage.failure);
      }).finally(() => {
        form.reset();
      });

      // request.addEventListener('load', () => {
      //   if (request.status === 200) {
      //     console.log(request.response);
      //     showThanksModal(massage.success);
      //     form.reset();
      //     statusMassage.remove();
      //   } else {
      //     showThanksModal(massage.failure);
      //   }
      // });
    });
  }

  // zamena modalnogo okna
  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('.modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>x</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }






  fetch('db.json')
    .then(data => data.json())
    .then(res => console.log(res));

});