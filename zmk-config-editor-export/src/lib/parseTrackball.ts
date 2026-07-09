import { findMatchingBrace, findTrackballBlockRange } from "./brace";
import type { SwipeConfig, TrackballBlockSlice, TrackballConfig } from "../types/trackball";

function parseIntList(angleContent: string): number[] {
  return angleContent
    .trim()
    .split(/\s+/)
    .map((n) => Number.parseInt(n, 10))
    .filter((n) => !Number.isNaN(n));
}

function parseBindings(bindingsBody: string): [string, string, string, string] {
  const matches = [...bindingsBody.matchAll(/<([^>]+)>/g)].map((m) => m[1].trim());
  if (matches.length !== 4) {
    throw new Error(`Expected 4 swipe bindings, found ${matches.length}`);
  }
  return matches as [string, string, string, string];
}

function parseOptionalMs(body: string, prop: string): number | undefined {
  const match = body.match(new RegExp(`${prop}\\s*=\\s*<(\\d+)>\\s*;`));
  return match ? Number.parseInt(match[1], 10) : undefined;
}

function parseSwipeBlock(name: string, body: string): SwipeConfig {
  const layersMatch = body.match(/layers\s*=\s*<([^>]+)>\s*;/);
  if (!layersMatch) {
    throw new Error(`Swipe "${name}" is missing layers property`);
  }

  const bindingsMatch = body.match(/bindings\s*=\s*([\s\S]*?);/);
  if (!bindingsMatch) {
    throw new Error(`Swipe "${name}" is missing bindings property`);
  }

  return {
    name,
    layers: parseIntList(layersMatch[1]),
    bindings: parseBindings(bindingsMatch[1]),
    tick: parseOptionalMs(body, "tick"),
    waitMs: parseOptionalMs(body, "wait-ms"),
    tapMs: parseOptionalMs(body, "tap-ms"),
  };
}

function parseSwipeBlocks(inner: string): SwipeConfig[] {
  const swipes: SwipeConfig[] = [];
  const re = /\n(\s+)(\w+)\s*\{/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(inner)) !== null) {
    const name = match[2];
    const openBrace = match.index + match[0].length - 1;
    const closeBrace = findMatchingBrace(inner, openBrace);
    const body = inner.slice(openBrace + 1, closeBrace);
    swipes.push(parseSwipeBlock(name, body));
    re.lastIndex = closeBrace + 1;
  }

  return swipes;
}

export function parseTrackballBlock(block: string): TrackballConfig {
  const openBrace = block.indexOf("{");
  const closeBrace = findMatchingBrace(block, openBrace);
  const inner = block.slice(openBrace + 1, closeBrace);

  const automouseMatch = inner.match(/automouse-layer\s*=\s*<(-?\d+)>\s*;/);
  if (!automouseMatch) {
    throw new Error("trackball block is missing automouse-layer");
  }

  const scrollMatch = inner.match(/scroll-layers\s*=\s*<([^>]+)>\s*;/);
  if (!scrollMatch) {
    throw new Error("trackball block is missing scroll-layers");
  }

  return {
    automouseLayer: Number.parseInt(automouseMatch[1], 10),
    scrollLayers: parseIntList(scrollMatch[1]),
    swipes: parseSwipeBlocks(inner),
  };
}

export function sliceKeymap(content: string): TrackballBlockSlice {
  const range = findTrackballBlockRange(content);
  if (!range) {
    throw new Error("No &trackball block found in keymap");
  }

  return {
    before: content.slice(0, range.start),
    block: content.slice(range.start, range.end),
    after: content.slice(range.end),
  };
}

export function parseKeymapTrackball(content: string): {
  slice: TrackballBlockSlice;
  config: TrackballConfig;
} {
  const slice = sliceKeymap(content);
  const config = parseTrackballBlock(slice.block);
  return { slice, config };
}
