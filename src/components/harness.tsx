"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { isExoMessage } from "@/lib/harness/protocol";
import { buildHarnessSrcdoc } from "@/lib/harness/srcdoc";

const DEFAULT_SANDBOX = "allow-scripts allow-same-origin";

export type HarnessProps = {
  html: string;
  data: unknown;
  sandbox?: string;
  onReady?: () => void;
  onDone?: (detail: unknown) => void;
  className?: string;
  title?: string;
};

export function Harness({
  html,
  data,
  sandbox = DEFAULT_SANDBOX,
  onReady,
  onDone,
  className,
  title = "Variant",
}: HarnessProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const onReadyRef = useRef(onReady);
  const onDoneRef = useRef(onDone);
  onReadyRef.current = onReady;
  onDoneRef.current = onDone;

  // Defer the iframe to the client: an SSR'd iframe fires load before hydration,
  // so onReady (onLoad) would miss it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const srcDoc = useMemo(() => buildHarnessSrcdoc(html, data), [html, data]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (!isExoMessage(event.data)) return;
      onDoneRef.current?.(event.data.detail);
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!mounted) return <div className={className} />;

  return (
    <iframe
      ref={frameRef}
      title={title}
      sandbox={sandbox}
      srcDoc={srcDoc}
      className={className}
      onLoad={() => onReadyRef.current?.()}
    />
  );
}
