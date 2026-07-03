export interface StoryBeat {
  world: string;
  title: string;
  body: string;
}

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
