const notif = (text) => {
  const header = document.querySelector(".notif");

  let notif = document.createElement("div");
  notif.classList.add("notification-alert");
  notif.innerText = text;

  header.appendChild(notif);

  // closing icon
  let close = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"></path></svg>`;
  notif.innerHTML += close;

  // close notif function
  notif.addEventListener("click", () => {
    notif.remove();
  });

  let indexRem = setTimeout(() => {
    let alert = document.querySelector(".notification-alert")
    if (alert){
      alert.remove();
    if (!notif) {
      clearTimeout(indexRem);
    }
    }
  }, 4000);
};


export default notif;
