import { EXO_SOURCE } from "./protocol";

function embedData(data: unknown): string {
  const literal = JSON.stringify(JSON.stringify(data) ?? "null");
  return literal.replace(/</g, "\\u003c");
}

function bootstrapScript(data: unknown): string {
  return `<script>(function () {
  window.exo = {
    data: JSON.parse(${embedData(data)}),
    done: function (detail) {
      parent.postMessage({ source: ${JSON.stringify(EXO_SOURCE)}, type: "exo:done", detail: detail === undefined ? null : detail }, "*");
    },
  };
})();</script>`;
}

export function buildHarnessSrcdoc(variantHtml: string, data: unknown): string {
  const bootstrap = bootstrapScript(data);

  const headMatch = variantHtml.match(/<head[^>]*>/i);
  if (headMatch?.index !== undefined) {
    const at = headMatch.index + headMatch[0].length;
    return variantHtml.slice(0, at) + bootstrap + variantHtml.slice(at);
  }

  const htmlMatch = variantHtml.match(/<html[^>]*>/i);
  if (htmlMatch?.index !== undefined) {
    const at = htmlMatch.index + htmlMatch[0].length;
    return `${variantHtml.slice(0, at)}<head>${bootstrap}</head>${variantHtml.slice(at)}`;
  }

  return bootstrap + variantHtml;
}
