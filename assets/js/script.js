document.addEventListener("DOMContentLoaded", function () {
  const filterButton = document.getElementById("filter-btn");
  const filterDropdown = document.getElementById("filter-dropdown");
  const dropDownitem = document.querySelectorAll(".dropdown__item");
  const sliderCarousel = document.querySelector(".slider__carousel");
  const floatingButton = document.querySelector(".floating__button");
  const modalComponent = document.getElementById("modal");
  const modalClose = document.querySelector(".modal__button");
  const gridContainer = document.querySelector(".grid__content");

  let isDragging = false,
    startX,
    startScrollLeft;

  const getData = async () => {
    try {
      const res = await fetch("tripleS_DB.json");
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  window.onscroll = () => {
    if (
      document.body.scrollTop > 1000 ||
      document.documentElement.scrollTop > 1000
    ) {
      floatingButton.style.visibility = "visible";
    } else {
      floatingButton.style.visibility = "hidden";
    }
  };

  const handleDrag = (e) => {
    isDragging = true;
    sliderCarousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = sliderCarousel.scrollLeft;
  };

  const handleStopDrag = () => {
    isDragging = false;
    sliderCarousel.classList.remove("dragging");
  };

  const ishandleDragging = (e) => {
    if (!isDragging) return;
    const newScrollLeft = startScrollLeft - (e.pageX - startX);
    if (
      newScrollLeft <= 0 ||
      newScrollLeft >= sliderCarousel.scrollWidth - sliderCarousel.offsetWidth
    ) {
      isDragging = false;
      return;
    }

    sliderCarousel.scrollLeft = newScrollLeft;
  };

  const showFilterOption = () => {
    if (!filterDropdown.classList.contains("hide")) {
      filterDropdown.classList.add("hide");
    } else {
      filterDropdown.classList.remove("hide");
    }
  };

  const cardComponent = (data) => {
    return `
        <div class="grid__item">
        <!-- Card Component -->
          <div class="card" data-id="${data.id}">
            <img
              src="${data.profile_img}"
              alt="${data.stage_name}"
              class="card__img"
            />
            <div class="card__body">
              <img src="assets/img/Logo.png" alt="Logo" />
              <h4 class="card__header text-secondary">${data.id}</h4>
              <h5 class="card__subtitle text-secondary">${data.stage_name}</h5>
            </div>
          </div>
        <!-- End Card Component -->
        </div>
      `;
  };

  const modalContent = (data) => {
    return `
      <div class="modal__content content-left">
        <img src="${data.profile_img}" alt="${data.stage_name}" class="content__image" />
      </div>
      <div class="modal__content content-right">
        <div class="content__info">
          <h6 class="content__header">NUMBER</h6>
          <span class="content__text">${data.id}</span>
        </div>
        <div class="content__info">
          <h6 class="content__header">STAGE NAME</h6>
          <span class="content__text">${data.stage_name}</span>
        </div>
        <div class="content__info">
          <h6 class="content__header">NAME</h6>
          <span class="content__text">${data.name} </span>
          <span class="content__text">(${data.english_name})</span>
        </div>
        <div class="content__info">
          <h6 class="content__header">BIRTHDAY</h6>
          <span class="content__text">${data.birthday}</span>
        </div>
        <div class="content__info">
          <h6 class="content__header">SIGNATURE</h6>
          <img
            src="${data.signature}
          "
            alt="signature"
            class="content__signature"
          />
        </div>
      </div>
    `;
  };

  const showMemberInfo = (id, data) => {
    const getMemberById = data.filter((member) => member.id === id);
    if (getMemberById) {
      const modalBody = document.getElementById("modal-body");
      modalBody.innerHTML = modalContent(getMemberById[0]);
      modalComponent.classList.remove("hide");
      document.body.classList.add("disabled__scroll");
    } else {
      console.error(`Member with ID ${id} not found`);
    }
  };

  const displayCard = async () => {
    const dataMember = await getData();
    showCardComponent(dataMember);
    openModal(dataMember);
  };

  dropDownitem.forEach((item) => {
    item.addEventListener("click", (e) => {
      filterDropdown.querySelector(".active").classList.remove("active");
      e.target.classList.add("active");

      gridContainer.innerHTML = "";
      const filterData = item.getAttribute("data-filter");
      if (filterData === "All") {
        displayCard();
      } else {
        filterMember(filterData);
      }
    });
  });

  const filterMember = async (filter) => {
    const dataMember = await getData();
    const data = dataMember.filter((member) => member.unit.includes(filter));
    showCardComponent(data);
    openModal(data);
  };

  const openModal = (dataset) => {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => {
        const memberId = card.getAttribute("data-id");
        showMemberInfo(memberId, dataset);
      });
    });
  };

  const showCardComponent = (dataset) => {
    dataset.forEach((member) => {
      gridContainer.innerHTML += cardComponent(member);
    });
  };

  const closeModal = () => {
    modalComponent.classList.add("hide");
    document.body.classList.remove("disabled__scroll");
  };

  modalClose.addEventListener("click", closeModal);
  filterButton.addEventListener("click", showFilterOption);
  sliderCarousel.addEventListener("mousedown", handleDrag);
  sliderCarousel.addEventListener("mousemove", ishandleDragging);
  document.addEventListener("mouseup", handleStopDrag);
  floatingButton.addEventListener("click", scrollToTop);

  displayCard();
});
