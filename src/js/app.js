const openButton = document.querySelector("#open-button");
const closeButton = document.querySelector("#close-button");
const fade = document.querySelector("#fade");
const modal = document.querySelector("#modal");
const controls = document.querySelectorAll(".control");
const form = document.querySelector("form");
let totalSeconds = 0;
let timer = null;

const toggleModal = () => {
  [modal, fade].forEach((element) => element.classList.toggle("hidden"));
};

const verifyInputLimits = (type, value) => {
  if (type === "config-days") return value >= 0 && value <= 24;
  return value >= 0 && value <= 60;
};

const handleControl = ({ target }) => {
  const control = target;
  const input = control.parentNode.parentNode.querySelector("input");
  let currentValue = +input.value;

  const step = +document.querySelector("#step-control").value;
  console.log(step);
  let value = control.id === "plus" ? currentValue + step : currentValue - step;

  const isValidValue = verifyInputLimits(input.id, value);
  if (!isValidValue) return;

  if (value < 10) value = "0" + value;
  input.value = value;
};

const resetCountdown = () => {
  const time = getTimeFromForm(form);
  localStorage.setItem("countdownTime", JSON.stringify(time));
  location.reload();
};

const showResetButton = () => {
  const resetButton = document.querySelector("#reset-button");
  resetButton.classList.remove("hidden");
  resetButton.addEventListener("click", resetCountdown);
};

const lauchRocket = () => {
  const rocket = document.querySelector("#rocket");
  const smoke = document.querySelector("#smoke");

  smoke.classList.remove("hidden");
  smoke.style.animation = " smoke 0.2s infinite";

  setTimeout(() => {
    rocket.style.transform = "translateY(-500rem)";
    smoke.classList.add("hidden");
    showResetButton();
  }, 3000);
};

const formatTimeValue = (value) => (value < 10 ? "0" + value : value);

const insertIntoConfigTime = (time) => {
  for (const [unit, value] of Object.entries(time)) {
    const input = document.querySelector(`#config-${unit}`);
    input.value = formatTimeValue(value);
  }
};

const insertIntoCountdownTime = (time) => {
  for (const [unit, value] of Object.entries(time)) {
    const element = document.querySelector(`#countdown-${unit}`);
    element.textContent = formatTimeValue(value);
  }
};

const updateCountDown = (totalSeconds) => {
  const days = Math.floor(totalSeconds / 60 / 60 / 24);
  const hours = Math.floor(totalSeconds / 60 / 60) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;

  const time = { days, hours, minutes, seconds };
  insertIntoCountdownTime(time);
  localStorage.setItem("countdownTime", JSON.stringify(time));
};

const verifyCountDown = (totalSeconds) => {
  if (totalSeconds === 0) {
    clearInterval(timer);
    lauchRocket();
    return;
  }
};

const setCountdown = ({ days, hours, minutes, seconds }) => {
  totalSeconds = seconds + minutes * 60 + hours * 60 * 60 + days * 60 * 60 * 24;

  clearInterval(timer);
  timer = setInterval(() => {
    updateCountDown(totalSeconds);
    verifyCountDown(totalSeconds);
    totalSeconds--;
}, 1000);
};

const getTimeFromForm = (form) => {
  const days = +form.querySelector("input#config-days").value;
  const hours = +form.querySelector("input#config-hours").value;
  const minutes = +form.querySelector("input#config-minutes").value;
  const seconds = +form.querySelector("input#config-seconds").value;

  return { days, hours, minutes, seconds };
};

const handleForm = (event) => {
  event.preventDefault();
  const time = getTimeFromForm(event.target);
  setCountdown(time);

  toggleModal();
};

[openButton, closeButton, fade].forEach((element) =>
  element.addEventListener("click", toggleModal)
);

controls.forEach((control) => control.addEventListener("click", handleControl));

form.addEventListener("submit", handleForm);

window.onload = () => {
  const time = JSON.parse(localStorage.getItem("countdownTime")) ?? {
    days: 8,
    hours: 12,
    minutes: 44,
    seconds: 28,
  };
  setCountdown(time);
  insertIntoConfigTime(time);
};
