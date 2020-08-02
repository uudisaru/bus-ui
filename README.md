# Frontend for Bus app

Displays current bus locations of Tallinn, Estonia. Built with Svelte and Typescript.
The service is a part of Docker demo - see [bus-app](https://github.com/uudisaru/bus-app) for complete application.

# Build commands

- Install dependencies

    ```bash
    $ npm install
    ```

- Launch the dev mode

    ```bash
    $ npm run dev
    ```

- Build

    ```bash
    $ npm run build
    ```

- Build Docker image with static app in Nginx

    ```bash
    $ ./build.sh
    ```


### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
API_URL=... npm run build
surge public bus-ui.surge.sh

# Tear down
surge teardown bus-ui.surge.sh
```
