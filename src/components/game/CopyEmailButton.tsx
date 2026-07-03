"use client";

import { useEffect, useRef, useState } from "react";

import { CONTACT } from "@/lib/site";
import { useGame } from "./GameProvider";

const COPIED_FEEDBACK_MS = 2000;

/** Copies the contact email and unlocks SIGNAL SENT. */
export default function CopyEmailButton() {
  const { award } = useGame();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — nothing to do.
      return;
    }
    award("signal_sent");
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  };

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy email address"
      className="border border-border px-1.5 py-0.5 font-pixel text-[10px] text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? "COPIED!" : "COPY"}
    </button>
  );
}
