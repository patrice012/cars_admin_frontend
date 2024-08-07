let mobileWidth = 1000;

// open or close sidebar
export const toggleSideBar = () => {
  let mainPage = document.querySelector(".main-container");
  let openSidebarBtn = document.getElementById("openSidebar");
  try {
    mainPage.classList.toggle("toggle-sideBar");
    openSidebarBtn.classList.add("activeBtn");
  } catch (error) {
    // handle error here
    // console.log(error);
  }
};

// close sidebar
export const closeSideBar = () => {
  let closeBtn = document.querySelector(".close-sidebar");
  if (closeBtn) {
    toggleSideBar();
  }
};

// open or  close sidebar btn base on window innerWidth
export const toggleMobileView = () => {
  let mainPage = document.querySelector(".main-container");
  let closeBtn = document.querySelector(".close-sidebar");
  if (Number(document.documentElement.clientWidth) < mobileWidth) {
    if (mainPage) {
      mainPage.classList.add("toggle-sideBar");
    }
    if (closeBtn) {
      closeBtn.classList.add("activeBtn");
    }
  } else {
    try {
      mainPage.classList.remove("toggle-sideBar");
      closeBtn.classList.remove("activeBtn");
    } catch (error) {
      // handle error here
      // console.log(error);
    }
  }
};

// open sidebar programmaticaly
export const toggleMobileViewBtn = () => {
  let toggleBtn = document.getElementById("openSidebar");
  let closeBtn = document.querySelector(".close-sidebar");
  if (Number(document.documentElement.clientWidth) < mobileWidth) {
    if (toggleBtn) {
      toggleBtn.classList.add("activeBtn");
    }
    if (closeBtn) {
      closeBtn.classList.add("activeBtn");
    }
  } else {
    try {
      toggleBtn.classList.remove("activeBtn");
      closeBtn.classList.remove("activeBtn");
    } catch (error) {
      // handle error here
      // console.log(error);
    }
  }
};
