import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from 'ol/proj';
import type { MapApi } from '../map/api';
import { busIcon, makeUpdateZoom } from "../map/styles";

export type Coords = [number, number];

export interface Location {
  coords: Coords;
  id: string;
  line: string;
  type?: string;
}

export class LocationStore {
  private readonly locations: Map<string, Feature>;
  private map?: MapApi;
  private renderTask: number | null = null;
  private updates: number = 0;

  constructor() {
    this.locations = new Map();
  }

  public setMap(api: MapApi) {
    this.map = api;
    this.map.setUpdateZoom(makeUpdateZoom(this.locations));
  }

  public update = (location: Location) => {
    if (this.locations.has(location.id)) {
      this.updateFeature(location);
    } else {
      this.addFeature(location);
    }
  };

  private addFeature = (location: Location) => {
    const coords = this.latLonToWebMercator(location.coords)
    const feature = new Feature({
      geometry: new Point(coords),
    });
    feature.setStyle(busIcon(location.line, this.map.getZoom()));
    feature.setId(location.id);
    this.locations.set(location.id, feature);
    this.map?.addFeature(feature);
  };

  private latLonToWebMercator(coords: Coords) {
    return fromLonLat(coords.reverse());
  }
  private rerender = () => {
    if (this.renderTask) {
      window.clearTimeout(this.renderTask);
      this.renderTask = null;
    }

    this.map?.render();
    this.updates = 0;
  }

  private updateFeature = (location: Location) => {
    const feature = this.locations.get(location.id);

    const point = feature.getGeometry() as Point;
    point.setCoordinates(this.latLonToWebMercator(location.coords));

    this.updateMap();
  };

  private updateMap = () => {
    const now = Date.now();
    this.updates++;

    // Update max 2 per sec or if 100 updates queued
    if (this.updates >= 100) {
      this.rerender();
    } else if (!this.renderTask) {
      this.renderTask = window.setTimeout(this.rerender, 500);
    }
  }
}
