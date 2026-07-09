export interface SwipeConfig {
  name: string;
  layers: number[];
  /** Four bindings: right, left, up, down (PMW3610 driver order). */
  bindings: [string, string, string, string];
  tick?: number;
  waitMs?: number;
  tapMs?: number;
}

export interface TrackballConfig {
  automouseLayer: number;
  scrollLayers: number[];
  swipes: SwipeConfig[];
}

export interface TrackballBlockSlice {
  before: string;
  block: string;
  after: string;
}
