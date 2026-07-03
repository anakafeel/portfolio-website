export interface StoryBeat {
  world: string;
  title: string;
  body: string;
}

export type Rarity = "legendary" | "epic" | "rare";

export interface LoadoutItem {
  slot: string;
  item: string;
  rarity: Rarity;
  flavor: string;
}

export const LOADOUT: LoadoutItem[] = [
  {
    slot: "KEYBOARD",
    item: "HHKB Professional Hybrid",
    rarity: "legendary",
    flavor: "Topre switches. +10 WPM, permanently bound to home row.",
  },
  {
    slot: "MACHINE",
    item: "Ryzen 7 7840HS · 32 GB DDR5",
    rarity: "epic",
    flavor: "Daily driver. Compiles anything you feed it.",
  },
  {
    slot: "OS",
    item: "Fedora 42 + Niri",
    rarity: "legendary",
    flavor: "Scrollable-tiling Wayland. Fully riced — see the secret level.",
  },
  {
    slot: "EDITOR",
    item: "AstroNvim",
    rarity: "epic",
    flavor: "Modal editing unlocked. Exit strategy still unknown.",
  },
  {
    slot: "TERMINAL",
    item: "Alacritty + fish",
    rarity: "rare",
    flavor: "GPU-accelerated incantations with autocompletion.",
  },
  {
    slot: "MULTIPLEXER",
    item: "tmux",
    rarity: "rare",
    flavor: "Six sessions deep. None of them will be closed.",
  },
];

export const STORY_BEATS: StoryBeat[] = [
  {
    world: "WORLD 1-1",
    title: "SPAWN POINT",
    body: "Computer Systems Engineering at Carleton University, Ottawa. First boot was pure curiosity about how machines actually work — started on Arch, settled on Fedora, never looked back at defaults.",
  },
  {
    world: "WORLD 1-2",
    title: "SKILL TREE",
    body: "Points invested in React, Next.js, TypeScript, and systems thinking. The build philosophy: interfaces should feel like native systems — predictable, spatial, keyboard-first.",
  },
  {
    world: "WORLD 1-3",
    title: "SIDE QUESTS",
    body: "Hackathons (3rd prize at TechnataHacks 2024), tuning a Linux desktop until every pixel earns its place, and reading Bret Victor essays between compile times.",
  },
  {
    world: "WORLD 1-4",
    title: "CURRENT QUEST",
    body: "Junior Software Engineer focused on React, Next.js, and AI-driven infrastructure management — shipping web experiences that feel like games instead of documents.",
  },
];
