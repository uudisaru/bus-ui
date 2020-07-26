<script lang="ts">
  import Map from "./Map.svelte";
  import type { LocationStore } from "./traffic/store";
  import Container from "./Container.svelte";

  export let store: LocationStore;
</script>

<style>
  :global(body),
  :global(#container) {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  :global(*) {
    box-sizing: border-box;
  }
</style>

<Container vertical>
  <div slot="background">
    <Map store={store}/>
  </div>
  <div slot="left">
  </div>

</Container>
