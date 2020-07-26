import type Feature from "ol/Feature";

export type UpdateZoomSetter = (current: number, prev: number) => void;
export interface MapApi {
  addFeature: (feature: Feature) => void;
  getZoom: () => number;
  setUpdateZoom: (updater?: UpdateZoomSetter) => void;
  render: () => void;
}
