# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```sh
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

To create a production version of your app:

```sh
pnpm build
```

## Building

To create a production version of your app:

```sh
wrangler d1 migrations apply "honey-bear"
```


You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
