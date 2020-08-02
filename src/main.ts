import App from "./App.svelte";
import { LocationStream } from "./traffic/stream";
import { LocationStore, Location } from "./traffic/store";
import { API_BUS_LOCATIONS } from "./settings";

const store = new LocationStore();
export const stream = new LocationStream(
  API_BUS_LOCATIONS,
  (ev: MessageEvent) => {
    const location: Location = JSON.parse(ev.data);
    store.update(location);
  },
  () => { },
);

const app = new App({
  target: document.body,
  props: {
    store,
  },
});

export default app;
