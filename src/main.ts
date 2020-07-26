import App from "./App.svelte";
import { LocationStream } from "./traffic/stream";
import { LocationStore, Location } from "./traffic/store";

const store = new LocationStore();
const stream = new LocationStream(
  "http://localhost:8095/api/locations",
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
