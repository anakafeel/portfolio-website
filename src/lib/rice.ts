export interface RiceShot {
  src: string;
  label: string;
  detail: string;
}

export const DOTFILES_URL = "https://github.com/anakafeel/dotfiles";

export const RICE_SHOTS: RiceShot[] = [
  {
    src: "/rice/niri-overview.webp",
    label: "NIRI OVERVIEW",
    detail: "Scrollable-tiling workspace overview on Wayland",
  },
  {
    src: "/rice/alacritty-tmux.webp",
    label: "ALACRITTY + TMUX",
    detail: "Terminal multiplexing with a matched palette",
  },
  {
    src: "/rice/neovim-matugen.webp",
    label: "NEOVIM + MATUGEN",
    detail: "AstroNvim themed from the wallpaper via matugen",
  },
  {
    src: "/rice/waybar-dynamic.webp",
    label: "WAYBAR DYNAMIC",
    detail: "Status bar re-colors itself with every wallpaper",
  },
  {
    src: "/rice/spicetify-theme.webp",
    label: "SPICETIFY",
    detail: "Spotify pulled into the same color scheme",
  },
  {
    src: "/rice/sidebar-rules.webp",
    label: "SIDEBAR RULES",
    detail: "Niri window rules for a persistent side column",
  },
];

export const RICE_SPECS: ReadonlyArray<readonly [string, string]> = [
  ["os", "Fedora 42"],
  ["wm", "Niri (scrollable tiling)"],
  ["shell", "fish"],
  ["terminal", "Alacritty"],
  ["editor", "AstroNvim"],
  ["cpu", "AMD Ryzen 7 7840HS"],
  ["ram", "32 GB DDR5"],
  ["kbd", "HHKB Pro Hybrid"],
];
