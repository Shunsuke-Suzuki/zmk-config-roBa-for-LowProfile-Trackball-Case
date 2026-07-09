import type { SwipeConfig, TrackballConfig } from "../types/trackball";

function formatBinding(binding: string): string {
  return `            <${binding}>`;
}

function serializeSwipe(swipe: SwipeConfig): string {
  const lines = [
    `    ${swipe.name} {`,
    `        layers = <${swipe.layers.join(" ")}>;`,
    "        bindings =",
    `${formatBinding(swipe.bindings[0])},`,
    `${formatBinding(swipe.bindings[1])},`,
    `${formatBinding(swipe.bindings[2])},`,
    `${formatBinding(swipe.bindings[3])};`,
  ];

  if (swipe.tick !== undefined) lines.push(`        tick = <${swipe.tick}>;`);
  if (swipe.waitMs !== undefined) lines.push(`        wait-ms = <${swipe.waitMs}>;`);
  if (swipe.tapMs !== undefined) lines.push(`        tap-ms = <${swipe.tapMs}>;`);

  lines.push("    };");
  return lines.join("\n");
}

export function serializeTrackballBlock(config: TrackballConfig): string {
  const scrollLayers = config.scrollLayers.join(" ");
  const swipeBlocks = config.swipes.map(serializeSwipe).join("\n\n");

  return [
    "&trackball {",
    `    automouse-layer = <${config.automouseLayer}>;`,
    `    scroll-layers = <${scrollLayers}>;`,
    "",
    swipeBlocks,
    "};",
  ].join("\n");
}

import { findTrackballBlockRange } from "./brace";

export function applyTrackballConfig(content: string, config: TrackballConfig): string {
  const range = findTrackballBlockRange(content);
  if (!range) {
    throw new Error("No &trackball block found in keymap");
  }

  return content.slice(0, range.start) + serializeTrackballBlock(config) + content.slice(range.end);
}
