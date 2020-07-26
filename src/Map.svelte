<script lang="ts">
  import { MapImpl } from "./map/map";
  import "../node_modules/ol/ol.css";
  import type { LocationStore } from "./traffic/store";

  export let backgroundColor = "#111122";
  export let id = "map";
  export let store: LocationStore;

  function setupMap(node, id) {
    let map = new MapImpl(id);
    store.setMap(map);

    return {
      destroy() {
        if (map) {
          store.setMap(null);
          map.destroy();
          map = null;
        }
      },
    };
  }
</script>

<style>
  div {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #e2e2e2;
  }
</style>

<div {id} use:setupMap={id} style={`background-color: ${backgroundColor};`} />
