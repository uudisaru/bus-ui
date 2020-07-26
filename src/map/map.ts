import type { MapApi, UpdateZoomSetter } from "./api";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Vector, Group } from "ol/layer";
import VectorSource from "ol/source/Vector";
import LayerGroup from "ol/layer/Group";
import { Map, View } from "ol";
import type Feature from 'ol/Feature';
import type BaseLayer from "ol/layer/Base";
import { fromLonLat } from "ol/proj";

const INFO_GROUP = "info";
const MARKERS = "markers";

export class MapImpl implements MapApi {
  private readonly map: Map;
  private readonly view: View;
  private updateZoom?: UpdateZoomSetter;
  
  constructor(readonly id: string) {
    const positions = new VectorSource({
      features: [],
    });
    const markers = new Vector({
      source: positions,
    });
    markers.set("id", MARKERS);

    const markerLayerGroup = new LayerGroup({
      layers: [markers],
    });
    markerLayerGroup.set("id", INFO_GROUP);

    this.view = new View({
      center: fromLonLat([24.7536, 59.437]),
      zoom: 14
    });

    this.map = new Map({
      target: id,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        markerLayerGroup,
      ],
      view: this.view,
    });
    let currZoom = this.view.getZoom();
    this.map.on('moveend', (): void => {
      var newZoom = this.view.getZoom();
      if (currZoom !== newZoom) {
        this.updateZoom?.(currZoom, newZoom);
        currZoom = newZoom;
      }
    });

  }

  public addFeature(feature: Feature) {
    const layer = this.getInfoLayer(MARKERS);
    if (layer && layer.layer instanceof Vector) {
      const layerVector: Vector = layer.layer;
      layerVector.getSource().addFeature(feature);
    }
  }

  public destroy() {
    this.map.setTarget(null);
  }

  public getZoom() {
    return this.view.getZoom();
  }

  public render() {
    this.map.render();
  }

  public setUpdateZoom(updateZoom?: UpdateZoomSetter) {
    this.updateZoom = updateZoom;
  }

  private getInfoLayer = (layerId: string) => {
    const group = this.getLayerGroup(INFO_GROUP);
    let layer: BaseLayer | undefined;

    if (group) {
      layer = group.getLayers().getArray()
        .find((l) => l.get("id") === layerId);
    }

    return { group, layer };
  }


  private getLayerGroup(id: string) {
    const group = this.map.getLayers().getArray().find((layer) => layer.get("id") === id);

    if (group instanceof Group) {
      return group;
    }

    return undefined;
  }
}