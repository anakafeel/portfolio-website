"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { useGame } from "@/components/game/GameProvider";
import { SITE } from "@/lib/site";
import {
  completions,
  interpret,
  type TerminalData,
  type TerminalLine,
} from "@/lib/terminal/commands";

const BANNER = [
  "  ███████╗  █████╗  ██╗ ███╗   ███╗",
  "  ██╔════╝ ██╔══██╗ ██║ ████╗ ████║",
  "  ███████╗ ███████║ ██║ ██╔████╔██║",
  "  ╚════██║ ██╔══██║ ██║ ██║╚██╔╝██║",
  "  ███████║ ██║  ██║ ██║ ██║ ╚═╝ ██║",
  "  ╚══════╝ ╚═╝  ╚═╝ ╚═╝ ╚═╝     ╚═╝",
].join("\n");

type HistoryItem =
  | { type: "welcome" }
  | { type: "cmd"; text: string }
  | { type: "output"; lines: TerminalLine[] };

interface TerminalProps {
  data: TerminalData;
  onClose: () => void;
}

export default function Terminal({ data, onClose }: TerminalProps) {
  const router = useRouter();
  const { state, setTheme } = useGame();

  const [history, setHistory] = useState<HistoryItem[]>([{ type: "welcome" }]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setHistory((h) => [...h, { type: "cmd", text: raw }]);
    if (!cmd) return;
    setCmdHistory((ch) => [...ch, cmd]);
    setHistIdx(-1);

    const { lines, action } = interpret(cmd, data, state);
    if (lines.length > 0) {
      setHistory((h) => [...h, { type: "output", lines }]);
    }

    switch (action?.kind) {
      case "clear":
        setHistory([]);
        break;
      case "exit":
        onClose();
        break;
      case "setTheme":
        setTheme(action.theme);
        break;
      case "navigate":
        setTimeout(() => {
          router.push(action.path);
          onClose();
        }, 250);
        break;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHistory.length) return;
      const idx = histIdx === -1 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(cmdHistory[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const idx = histIdx + 1;
      if (idx >= cmdHistory.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(cmdHistory[idx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = completions(input, data)[0];
      if (match) applyChip(match);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  const suggestions = useMemo(() => completions(input, data), [input, data]);
  const currentWord = input.trim().split(/\s+/).pop() ?? "";

  const applyChip = (text: string) => {
    const parts = input.trimStart().split(/\s+/);
    if (parts.length <= 1) {
      setInput(text + (text.endsWith("/") ? "" : " "));
    } else {
      parts[parts.length - 1] = text;
      setInput(parts.join(" "));
    }
    inputRef.current?.focus();
  };

  return (
    <div
      role="dialog"
      aria-label="Terminal"
      className="pixel-border fixed left-1/2 top-1/2 z-[90] flex h-[min(560px,72vh)] w-[min(880px,94vw)] -translate-x-1/2 -translate-y-1/2 flex-col bg-surface"
    >
      <div className="flex select-none items-center gap-2 border-b-2 border-border bg-background p-2">
        <span
          role="button"
          aria-label="Close terminal"
          tabIndex={0}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Enter" && onClose()}
          className="h-3 w-3 cursor-pointer bg-accent transition-all hover:brightness-125"
        />
        <span className="h-3 w-3 bg-highlight" />
        <span className="h-3 w-3 bg-accent-alt" />
        <div className="flex-1 text-center font-pixel text-[8px] uppercase tracking-[0.15em] text-muted">
          {SITE.handle}@portfolio — term
        </div>
        <button
          type="button"
          onClick={onClose}
          className="border border-border px-1.5 font-pixel text-[10px] text-muted transition-colors hover:border-accent hover:text-accent"
        >
          ×
        </button>
      </div>

      <div
        ref={bodyRef}
        onClick={() => inputRef.current?.focus()}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 font-body text-lg leading-snug"
      >
        {history.map((item, idx) => {
          if (item.type === "welcome") {
            return (
              <div key={idx} className="mb-4">
                <pre className="whitespace-pre text-[9px] leading-none text-accent sm:text-xs">
                  {BANNER}
                </pre>
                <div className="mt-3 text-muted">
                  welcome to the <span className="text-accent">portfolio</span>{" "}
                  shell. type <span className="text-accent">help</span> to get
                  your bearings.
                </div>
              </div>
            );
          }
          if (item.type === "cmd") {
            return (
              <div key={idx} className="mb-1 break-all text-foreground">
                <span className="text-accent">λ </span>
                {item.text}
              </div>
            );
          }
          return (
            <div key={idx} className="mb-2">
              {item.lines.map((line, i) => (
                <div
                  key={i}
                  className={clsx(
                    "whitespace-pre-wrap break-words",
                    line.className,
                  )}
                >
                  {line.text || " "}
                </div>
              ))}
            </div>
          );
        })}

        <div className="flex min-w-0 items-center gap-1">
          <span className="shrink-0 text-accent">{SITE.handle}</span>
          <span className="shrink-0 text-muted">@portfolio ~</span>
          <span className="shrink-0 text-accent"> λ </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal input"
            className="min-w-0 flex-1 border-none bg-transparent text-foreground caret-accent outline-none"
          />
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t-2 border-dashed border-border bg-background p-2 px-4">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => applyChip(s)}
              className={clsx(
                "border px-2 py-0.5 font-pixel text-[8px] transition-colors",
                currentWord && s.startsWith(currentWord)
                  ? "border-accent text-accent hover:bg-accent hover:text-background"
                  : "border-border text-muted hover:bg-muted hover:text-background",
              )}
            >
              {s}
            </button>
          ))}
          <span className="ml-auto font-pixel text-[8px] text-muted opacity-60">
            tab ⇥
          </span>
        </div>
      )}
    </div>
  );
}
