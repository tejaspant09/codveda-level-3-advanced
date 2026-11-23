import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const time = document.querySelector("#time");
const status = document.querySelector("#timer-status");
const toggle = document.querySelector("#toggle");
const label = document.querySelector("#timer-label");
const replay = document.querySelector("#replay");
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
let mode = "focus";
let remaining = 1500;
let deadline = 0;
let interval;
let context;
let introduction;

function duration() {
  return mode === "focus" ? 1500 : 300;
}

function render() {
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  time.textContent = `${minutes}:${seconds}`;
}

function pause() {
  clearInterval(interval);
  interval = undefined;
  toggle.textContent = "Start session";
}

function tick() {
  remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  render();
  if (!remaining) {
    pause();
    status.textContent = "Interval complete.";
  }
}

function reset() {
  pause();
  remaining = duration();
  status.textContent = "Ready when you are.";
  render();
}

toggle.addEventListener("click", () => {
  if (interval) {
    tick();
    pause();
    if (remaining) status.textContent = "Paused.";
    return;
  }
  if (!remaining) remaining = duration();
  deadline = Date.now() + remaining * 1000;
  toggle.textContent = "Pause";
  status.textContent = "Session running.";
  interval = setInterval(tick, 250);
});

document.querySelector("#reset").addEventListener("click", reset);
document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    mode = button.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    label.textContent = mode === "focus" ? "Focus session" : "Break session";
    reset();
  });
});

gsap.registerPlugin(ScrollTrigger);
function setupMotion() {
  context?.revert();
  introduction = undefined;
  if (motion.matches) return;
  context = gsap.context(() => {
    introduction = gsap.timeline();
    introduction.from(".intro > *", {
      y: 12,
      duration: 0.4,
      stagger: 0.07,
      clearProps: "all",
    });
    gsap.from(".reveal article", {
      y: 16,
      duration: 0.45,
      stagger: 0.08,
      clearProps: "all",
      scrollTrigger: { trigger: ".reveal", start: "top 85%", once: true },
    });
  });
}
replay.addEventListener("click", () => {
  if (!motion.matches) introduction?.restart();
});
motion.addEventListener("change", setupMotion);
setupMotion();
window.addEventListener("pagehide", () => {
  context?.revert();
  motion.removeEventListener("change", setupMotion);
});
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  motion.addEventListener("change", setupMotion);
  setupMotion();
  if (interval) tick();
});
