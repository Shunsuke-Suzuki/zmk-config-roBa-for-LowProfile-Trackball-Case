import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseKeymapTrackball } from "../src/lib/parseTrackball";
import { applyTrackballConfig } from "../src/lib/serializeTrackball";

const fixturePath = join(dirname(fileURLToPath(import.meta.url)), "../fixtures/roBa.keymap");
const fixture = readFileSync(fixturePath, "utf-8");

describe("roBa.keymap trackball round-trip", () => {
  it("parses automouse and scroll layers", () => {
    const { config } = parseKeymapTrackball(fixture);
    expect(config.automouseLayer).toBe(4);
    expect(config.scrollLayers).toEqual([5]);
  });

  it("parses swipe blocks", () => {
    const { config } = parseKeymapTrackball(fixture);
    expect(config.swipes).toHaveLength(2);

    const desktop = config.swipes.find((s) => s.name === "desktop_swipe");
    expect(desktop?.layers).toEqual([2]);
    expect(desktop?.bindings[0]).toBe("&kp LC(LEFT_ARROW)");
    expect(desktop?.tick).toBe(80);
    expect(desktop?.waitMs).toBe(150);

    const notification = config.swipes.find((s) => s.name === "notification_center_swipe");
    expect(notification?.bindings[0]).toBe("&kp LC(LA(LG(N)))");
    expect(notification?.bindings[1]).toBe("&none");
  });

  it("round-trips without changing the keymap", () => {
    const { config } = parseKeymapTrackball(fixture);
    const output = applyTrackballConfig(fixture, config);
    expect(output).toBe(fixture);
  });
});
