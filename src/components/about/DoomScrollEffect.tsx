"use client";

import { useEffect, useRef } from "react";

interface Props {
  onCleared: () => void;
  cleared: boolean;
}

export default function DoomScrollEffect({ onCleared, cleared }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const lastCheckbox = root.querySelector<HTMLInputElement>(
      ".doom-inner span:nth-of-type(6) input",
    );
    if (!lastCheckbox) return;

    let fired = false;
    const handleChange = () => {
      if (fired || !lastCheckbox.checked) return;
      fired = true;
      setTimeout(onCleared, 1500);
    };

    lastCheckbox.addEventListener("change", handleChange);
    return () => lastCheckbox.removeEventListener("change", handleChange);
  }, [onCleared]);

  return (
    <div
      className={`doom-scroll${cleared ? " doom-cleared" : ""}`}
      aria-hidden="true"
      ref={rootRef}
    >
      <style>{DOOM_CSS}</style>

      {/* Career wall cards — scroll-driven, keyed to corridor rooms */}
      <div className="doom-card doom-card-1">
        <div className="doom-card-header">
          <img src="/logos/carleton.svg" alt="Carleton University" className="doom-card-logo" />
          <div>
            <p className="doom-card-world">WORLD 1-1</p>
            <h2 className="doom-card-title">SPAWN POINT</h2>
          </div>
        </div>
        <p className="doom-card-body">
          Carleton University · Computer Science. First boot curiosity →
          systems obsession.
        </p>
      </div>

      <div className="doom-card doom-card-2">
        <div className="doom-card-header">
          <img src="/logos/skill-tree.svg" alt="Skill tree" className="doom-card-logo" />
          <div>
            <p className="doom-card-world">WORLD 1-2</p>
            <h2 className="doom-card-title">SKILL TREE</h2>
          </div>
        </div>
        <p className="doom-card-body">
          C / C++ / Go / Rust / Python · TypeScript / React / Next.js
        </p>
      </div>

      <div className="doom-card doom-card-3">
        <div className="doom-card-header">
          <img src="/logos/side-quests.svg" alt="Side quests" className="doom-card-logo" />
          <div>
            <p className="doom-card-world">WORLD 1-3</p>
            <h2 className="doom-card-title">SIDE QUESTS</h2>
          </div>
        </div>
        <p className="doom-card-body">
          CUMSA Hacks Top 5 · Technata 3rd · Shopify CLI OSS · ARC
        </p>
      </div>

      <div className="doom-card doom-card-4">
        <div className="doom-card-header">
          <img src="/logos/synopsys.webp" alt="Synopsys" className="doom-card-logo" />
          <div>
            <p className="doom-card-world">WORLD 1-4</p>
            <h2 className="doom-card-title">CURRENT QUEST</h2>
          </div>
        </div>
        <p className="doom-card-body">
          Synopsys intern · ARC Software Lead. Two active missions.
        </p>
      </div>

      <div className="doom-wrapper">
        <div className="doom-level">
          <div className="doom-inner">
            <div />
            <div />
            <div />
            <div />
            <div />
            <span>
              <input type="checkbox" />
            </span>
            <span>
              <input type="checkbox" />
            </span>
            <span>
              <input type="checkbox" />
            </span>
            <span>
              <input type="checkbox" />
            </span>
            <span>
              <input type="checkbox" />
            </span>
            <span>
              <input type="checkbox" />
            </span>
          </div>
        </div>
      </div>

      <div className="doom-logo">
        <input type="checkbox" />
      </div>
      <div className="doom-weapon" />
      <div className="doom-hud" />
    </div>
  );
}

const DOOM_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
@font-face {
  font-family: "Doom";
  src: url("https://assets.codepen.io/383755/Upheaval.woff2") format("woff2");
}

/* ── Scope root ─────────────────────────────────────────────── */
.doom-scroll {
  image-rendering: pixelated;
  cursor: crosshair;
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background: #000;
}

.doom-scroll *,
.doom-scroll *::before,
.doom-scroll *::after {
  cursor: crosshair;
}

/* Victory exit — slides the whole overlay up off-screen */
.doom-scroll.doom-cleared {
  transform: translateY(-100vh);
  transition: transform 1.2s cubic-bezier(0.76, 0, 0.24, 1);
  pointer-events: none;
}

/* Victory overlay — shows when last enemy is killed */
.doom-scroll:has(.doom-inner span:nth-of-type(6) input:checked)::before {
  content: "victory";
  color: #222;
  background: rgba(255, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  font-family: "Doom", sans-serif;
  font-size: 14vmin;
  backdrop-filter: blur(4px);
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.3s ease-in-out 0.5s;
}

/* Scrollbar */
.doom-scroll ::-webkit-scrollbar { width: 6px; height: 0px; }
.doom-scroll ::-webkit-scrollbar-track { background: #000; }
.doom-scroll ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #e9544b, #f9ef51 75%); }

/* ── Logo overlay ───────────────────────────────────────────── */
.doom-scroll .doom-logo {
  position: fixed;
  background: url("https://assets.codepen.io/383755/580b57fcd9996e24bc43c34d.png") 50% 50% / auto 40vh no-repeat, rgba(0, 0, 0, 0.75);
  z-index: 10;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  animation: doom-load 0.5s ease-in-out 1 forwards paused;
  pointer-events: none;
  transition: 0.3s ease-in-out;
}
.doom-scroll .doom-logo:has(input:checked) {
  animation-play-state: running;
  background-position: 50% calc(50% - 100vh);
}
.doom-scroll .doom-logo:has(input:checked)::before,
.doom-scroll .doom-logo:has(input:checked)::after {
  transform: translate(-50%, 100vh);
}
.doom-scroll .doom-logo input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  pointer-events: all;
  z-index: 11;
}
.doom-scroll .doom-logo::before,
.doom-scroll .doom-logo::after {
  content: "scroll";
  font-family: "Doom", sans-serif;
  color: #f9ef51;
  background-image: linear-gradient(to bottom, #e9544b 0%, #f9ef51 50%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 8vh;
  position: absolute;
  left: 50%;
  top: calc(50% + 10vh);
  transform: translate(-50%, 0);
  transition: 0.3s ease-in-out 0.05s;
}
.doom-scroll .doom-logo::before {
  -webkit-text-stroke: 2px #666;
  transition-delay: 0.1s;
}
.doom-scroll .doom-logo::after {
  -webkit-text-fill-color: #fff;
  content: "sorry, your browser does not support scroll timeline";
  font-family: "Press Start 2P", sans-serif;
  text-align: center;
  font-size: 3vh;
  top: calc(50% + 20vh);
  animation: doom-flashing 0.5s ease-in-out infinite alternate;
}
@supports (animation-timeline: scroll()) {
  .doom-scroll .doom-logo::after {
    content: "click anywhere to start";
    font-size: 1vh;
  }
}

/* ── Weapon ─────────────────────────────────────────────────── */
.doom-scroll .doom-weapon {
  background: url("https://i.imgur.com/dpySZUG.png") 0% 20px / auto 1072px no-repeat;
  --scale: 5;
  position: fixed;
  z-index: 9;
  width: 90px;
  height: 154px;
  left: calc(50% + 7.5vh);
  bottom: -500px;
  transition: 0.5s ease-in-out 0.45s;
  transform-origin: bottom;
  transform: scale(var(--scale));
  animation: doom-bounce 1s steps(4, end) infinite alternate;
  pointer-events: none;
}
@media (max-height: 768px) {
  .doom-scroll .doom-weapon { --scale: 4; }
}

/* ── HUD ────────────────────────────────────────────────────── */
.doom-scroll .doom-hud {
  position: fixed;
  z-index: 999;
  background: #333;
  box-shadow: 0 0 0 5px #444;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: clamp(25px, 7.5vh, 100px);
  transform: translateY(200%);
  transition: 0.5s ease-in-out 0.3s;
  pointer-events: none;
}
.doom-scroll .doom-hud::before {
  content: "";
  position: absolute;
  aspect-ratio: 1/1;
  height: clamp(30px, 8vh, 125px);
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  box-shadow: inset 0 0 0 1px #000, 0 0 0 5px #444;
  background: url("https://assets.codepen.io/383755/grin-doomguy.gif") 0% 50% / contain no-repeat, #666;
}

/* ── Activation: logo clicked → show weapon, HUD, enable scroll ── */
.doom-scroll:has(.doom-logo input:checked) {
  @supports (animation-timeline: scroll()) {
    position: relative;
    overflow: auto;
    height: clamp(1200px, 2000vh, 2000vh);
  }
}
.doom-scroll:has(.doom-logo input:checked) .doom-weapon {
  bottom: 50px;
}
.doom-scroll:has(.doom-logo input:checked) .doom-hud {
  transform: translateY(0);
}
.doom-scroll:has(.doom-logo input:checked):active .doom-weapon {
  animation: doom-shoot 0.125s steps(3, end) 1;
}

/* ── Pointer events ─────────────────────────────────────────── */
.doom-scroll * { pointer-events: none; }
.doom-scroll:has(.doom-logo input:checked) .doom-wrapper .doom-level .doom-inner span:first-of-type {
  animation-play-state: running;
}
@supports (animation-timeline: scroll()) {
  .doom-scroll input { pointer-events: all; }
}
.doom-scroll input:checked { pointer-events: none; }

/* ── Wrapper (viewport) ─────────────────────────────────────── */
.doom-scroll .doom-wrapper {
  width: 600px;
  height: 600px;
  box-shadow: 0 0 0 1px;
  position: fixed;
  top: calc(50vh - 300px);
  left: calc(50vw - 300px);
  perspective: 600px;
  z-index: -1;
}

/* ── Level (3D container) ───────────────────────────────────── */
.doom-scroll .doom-level {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform: translateY(0px) translateZ(300px) rotateX(85deg);
  transform-style: preserve-3d;
}
.doom-scroll .doom-level *,
.doom-scroll .doom-level *::before,
.doom-scroll .doom-level *::after {
  transform-style: preserve-3d;
}

/* ── Inner grid (floor + walls) ─────────────────────────────── */
.doom-scroll .doom-inner {
  background: url("https://assets.codepen.io/383755/C99.png");
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  animation: doom-rotate linear;
  animation-timeline: scroll();
  animation-range: entry 0 cover 100%;
  transform-origin: 50% calc(50% + 100px);
}
.doom-scroll .doom-inner::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("https://assets.codepen.io/383755/C64.png");
  top: 0;
  left: 0;
  transform: translateZ(calc(600px / 9));
}

/* ── Wall divs ──────────────────────────────────────────────── */
.doom-scroll .doom-inner > div::before,
.doom-scroll .doom-inner > div::after {
  content: "";
  position: absolute;
}

.doom-scroll .doom-inner > div:nth-of-type(1) {
  grid-area: 9/4/10/6;
  background: url("https://assets.codepen.io/383755/C4.png");
  transform-origin: bottom;
  transform: rotateX(-90deg) rotateY(-90deg);
}
.doom-scroll .doom-inner > div:nth-of-type(1)::before {
  width: 300%;
  height: 100%;
  top: 0;
  right: 50%;
  transform: translateZ(calc(600px / -9));
  background: inherit;
}

.doom-scroll .doom-inner > div:nth-of-type(2) {
  background: url("https://assets.codepen.io/383755/C4.png");
  grid-area: 8/2/9/5;
  transform-origin: bottom;
  transform: rotateX(-90deg);
}
.doom-scroll .doom-inner > div:nth-of-type(2)::before,
.doom-scroll .doom-inner > div:nth-of-type(2)::after {
  height: 100%;
  width: 200%;
  right: 100%;
  top: 0;
  background: url("https://assets.codepen.io/383755/C4.png");
  transform-origin: right;
  transform: rotateY(-90deg);
}
.doom-scroll .doom-inner > div:nth-of-type(2)::after {
  background: url("https://assets.codepen.io/383755/C19.png");
  width: 66%;
  right: 0%;
}

.doom-scroll .doom-inner > div:nth-of-type(3),
.doom-scroll .doom-inner > div:nth-of-type(5) {
  grid-area: 2/2/3/3;
  transform-origin: bottom;
  transform: rotateX(-90deg);
  background: url("https://assets.codepen.io/383755/C19.png");
}
.doom-scroll .doom-inner > div:nth-of-type(3)::before,
.doom-scroll .doom-inner > div:nth-of-type(5)::before {
  width: 200%;
  height: 100%;
  left: -100%;
  transform-origin: right;
  top: 0;
  transform: rotateY(-90deg);
  background: url("https://assets.codepen.io/383755/C4.png");
}

.doom-scroll .doom-inner > div:nth-of-type(4) {
  grid-area: 1/1/2/10;
  transform-origin: bottom;
  transform: rotateX(-90deg);
  background: url("https://assets.codepen.io/383755/C4.png");
}
.doom-scroll .doom-inner > div:nth-of-type(4)::before,
.doom-scroll .doom-inner > div:nth-of-type(4)::after {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: url("https://assets.codepen.io/383755/C4.png");
  transform: rotateY(90deg);
  transform-origin: right;
}
.doom-scroll .doom-inner > div:nth-of-type(4)::after {
  left: auto;
  right: 0;
  width: 44%;
  transform: translateZ(500px);
  background: url("https://assets.codepen.io/383755/C4.png");
}

.doom-scroll .doom-inner > div:nth-of-type(5) {
  grid-area: 4/5/5/6;
}
.doom-scroll .doom-inner > div:nth-of-type(5)::before,
.doom-scroll .doom-inner > div:nth-of-type(5)::after {
  width: 100%;
  height: 100%;
  background: inherit;
  top: 0;
  left: 0;
  transform-origin: left;
  transform: rotateY(90deg);
}
.doom-scroll .doom-inner > div:nth-of-type(5)::after {
  width: 200%;
  transform: translateZ(200px);
  left: 101%;
}

/* ── Enemies (spans) ────────────────────────────────────────── */
.doom-scroll .doom-inner > span {
  image-rendering: pixelated;
  grid-area: 7/5/8/6;
  transform-origin: bottom;
  --y: 0deg;
  --x: -90deg;
  position: relative;
  transform: rotateX(var(--x)) rotateY(var(--y)) scale(0.75) translateZ(-50px);
  animation: doom-approach 2s steps(18, end) 1 forwards var(--delay, 0s);
  animation-play-state: paused;
}

.doom-scroll .doom-inner > span:nth-of-type(2),
.doom-scroll .doom-inner > span:nth-of-type(3) {
  grid-area: 5/3/6/4;
  --y: 90deg;
  --delay: 2s;
}
.doom-scroll .doom-inner > span:nth-of-type(3) {
  grid-area: 6/3/7/4;
  --z: 0px;
  --delay: 0s;
}
.doom-scroll .doom-inner > span:nth-of-type(3)::before {
  background: url(https://assets.codepen.io/383755/demon1.gif) 50% 50% / contain no-repeat;
}

.doom-scroll .doom-inner > span:nth-of-type(4) {
  grid-area: 2/8/3/9;
  --y: -90deg;
  --delay: 2s;
}
.doom-scroll .doom-inner > span:nth-of-type(4)::before {
  background: url(https://assets.codepen.io/383755/caco-cacodemon.gif) 50% 50% / contain no-repeat;
}
.doom-scroll .doom-inner > span:nth-of-type(4)::before,
.doom-scroll .doom-inner > span:nth-of-type(4)::after {
  left: -25%;
}

.doom-scroll .doom-inner > span:nth-of-type(5) {
  grid-area: 5/7/6/8;
  --y: -180deg;
  --delay: 2s;
}
.doom-scroll .doom-inner > span:nth-of-type(5)::before {
  background: url(https://assets.codepen.io/383755/demon1.gif) 50% 100% / contain no-repeat;
}

.doom-scroll .doom-inner > span:nth-of-type(6) {
  grid-area: 8/8/9/9;
  --y: -180deg;
  --delay: 0s;
}
.doom-scroll .doom-inner > span:nth-of-type(6)::before {
  background: url(https://assets.codepen.io/383755/demon4.gif) 50% 100% / contain no-repeat;
  width: 150%;
  left: -25%;
}

/* Enemy checkbox interaction */
.doom-scroll .doom-inner > span:has(input:checked)::after {
  opacity: 1;
  animation-play-state: running;
}
.doom-scroll .doom-inner > span:has(input:checked)::before {
  opacity: 0;
}
.doom-scroll .doom-inner > span:has(input:checked) + span {
  animation-play-state: running;
}

/* Enemy pseudo-element sprites */
.doom-scroll .doom-inner > span::before,
.doom-scroll .doom-inner > span::after {
  content: "";
  position: absolute;
  width: calc(100% - 18px);
  height: 100%;
  bottom: 0;
  left: 0;
  --offset: 3px;
  pointer-events: none;
  background: url(https://assets.codepen.io/383755/demon3.gif) 50% 25% / contain no-repeat;
}
.doom-scroll .doom-inner > span::after {
  --offset: 0px;
  animation: doom-move 0.5s steps(6, end) 1 forwards;
  background: url("https://assets.codepen.io/383755/doom-explosion.png") 2px 50% / auto 50px no-repeat;
  animation-play-state: paused;
  opacity: 0;
}

.doom-scroll .doom-inner > span input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 999;
}

/* ── Career Wall Cards ──────────────────────────────────────── */
.doom-scroll .doom-card {
  position: fixed;
  max-width: min(340px, 80vw);
  background: rgba(10, 10, 18, 0.88);
  border: 2px solid #34346a;
  box-shadow: 4px 4px 0 0 #34346a;
  padding: 14px 18px;
  z-index: 5;
  opacity: 0;
  pointer-events: none;
}

@supports (animation-timeline: scroll()) {
  .doom-scroll:has(.doom-logo input:checked) .doom-card {
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: scroll();
  }
  .doom-scroll:has(.doom-logo input:checked) .doom-card-1 {
    animation-name: doom-card-in;
    animation-range: 20% 38%;
  }
  .doom-scroll:has(.doom-logo input:checked) .doom-card-2 {
    animation-name: doom-card-in;
    animation-range: 38% 55%;
  }
  .doom-scroll:has(.doom-logo input:checked) .doom-card-3 {
    animation-name: doom-card-in;
    animation-range: 55% 75%;
  }
  .doom-scroll:has(.doom-logo input:checked) .doom-card-4 {
    animation-name: doom-card-in-center;
    animation-range: 75% 95%;
  }
}

.doom-scroll .doom-card-1 {
  top: 20%;
  left: 5%;
}
.doom-scroll .doom-card-2 {
  top: 15%;
  right: 5%;
}
.doom-scroll .doom-card-3 {
  top: 20%;
  left: 5%;
}
.doom-scroll .doom-card-4 {
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  max-width: min(480px, 90vw);
}

.doom-scroll .doom-card-world {
  font-family: "Press Start 2P", sans-serif;
  font-size: 0.5rem;
  color: #00e5ff;
  margin: 0 0 6px;
  letter-spacing: 0.08em;
}

.doom-scroll .doom-card-title {
  font-family: "Press Start 2P", sans-serif;
  font-size: 0.6rem;
  color: #ffd400;
  margin: 0 0 10px;
}

.doom-scroll .doom-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.doom-scroll .doom-card-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  image-rendering: pixelated;
  flex-shrink: 0;
  border: 2px solid #34346a;
  background: #0a0a12;
  padding: 4px;
}

.doom-scroll .doom-card-body {
  font-family: "VT323", monospace;
  font-size: 1.1rem;
  color: #e8e8f4;
  margin: 0;
  line-height: 1.4;
}

@keyframes doom-card-in {
  0%, 8%   { opacity: 0; transform: translateY(8px); }
  18%, 82% { opacity: 1; transform: translateY(0); }
  92%, 100% { opacity: 0; transform: translateY(0); }
}

@keyframes doom-card-in-center {
  0%, 8%   { opacity: 0; transform: translateX(-50%) translateY(8px); }
  18%, 82% { opacity: 1; transform: translateX(-50%) translateY(0); }
  92%, 100% { opacity: 0; transform: translateX(-50%) translateY(0); }
}

/* Mobile: hide cards */
@media (max-width: 640px) {
  .doom-scroll .doom-card { display: none; }
}

/* ── Keyframes ──────────────────────────────────────────────── */
@keyframes doom-rotate {
  0%   { transform: translateY(0px); }
  20%  { transform: translateY(150px) rotate(0deg); }
  30%  { transform: translateY(200px) rotate(90deg); transform-origin: 50% calc(50% + 100px); }
  40%  { transform: translateY(300px) rotate(90deg); transform-origin: 50% calc(50% - 0px); }
  50%  { transform: translateX(100px) translateY(300px) rotate(0deg); transform-origin: 50% calc(50% - 0px); }
  60%  { transform: translateX(100px) translateY(400px) rotate(0deg); transform-origin: 50% calc(50% - 150px); }
  65%  { transform: translateY(450px) rotate(-90deg); transform-origin: 50% calc(50% - 200px); }
  75%  { transform: translateY(550px) rotate(-90deg); transform-origin: 50% calc(50% - 200px); }
  80%  { transform: translateY(600px) rotate(-90deg); transform-origin: 50% calc(50% - 200px); }
  85%  { transform: translateX(100px) translateY(650px) rotate(-180deg); transform-origin: 50% calc(50% - 200px); }
  90%  { transform: translateX(100px) translateY(800px) rotate(-180deg); transform-origin: 50% calc(50% - 200px); }
  100% { transform: translateX(200px) translateY(800px) rotate(-180deg); transform-origin: 50% calc(50% - 200px); }
}

@keyframes doom-approach {
  to { transform: rotateX(var(--x)) rotateY(var(--y)) scale(0.75) translateZ(var(--z, 50px)); }
}

@keyframes doom-move {
  to { background-position: calc(100% + var(--offset)) 50%; }
}

@keyframes doom-load {
  0%, 50% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes doom-flashing {
  to { opacity: 0.5; }
}

@keyframes doom-bounce {
  to { transform: scale(var(--scale)) translateY(5px); }
}

@keyframes doom-shoot {
  to { background-position: -255px 20px; }
}

/* ── Responsive ─────────────────────────────────────────────── */
@media (max-width: 640px) {
  .doom-scroll .doom-wrapper {
    width: 300px;
    height: 300px;
    top: calc(50vh - 150px);
    left: calc(50vw - 150px);
    perspective: 400px;
  }
}

/* ── Reduced motion ─────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .doom-scroll .doom-inner { animation: none; }
  .doom-scroll .doom-inner > span { animation: none; }
  .doom-scroll .doom-logo { animation: none; opacity: 0; }
  .doom-scroll .doom-weapon { animation: none; }
  .doom-scroll .doom-card { display: none; }
  .doom-scroll.doom-cleared {
    transform: none;
    transition: opacity 0.1s ease;
    opacity: 0;
  }
}
`;
