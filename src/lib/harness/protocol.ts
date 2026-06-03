export const EXO_SOURCE = "exo";

export type ExoDoneMessage = {
  source: typeof EXO_SOURCE;
  type: "exo:done";
  detail: unknown;
};

export type ExoMessage = ExoDoneMessage;

export function isExoMessage(value: unknown): value is ExoMessage {
  if (typeof value !== "object" || value === null) return false;
  const message = value as Record<string, unknown>;
  return message.source === EXO_SOURCE && message.type === "exo:done";
}
