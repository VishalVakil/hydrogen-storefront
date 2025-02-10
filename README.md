# hydrogen-storefront

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with [Remix](https://remix.run/), Shopify’s full stack web framework.

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with Remix](https://remix.run/docs/en/v1)

## What's included

- Remix
- Hydrogen
- Oxygen
- Vite
- Shopify CLI
- ESLint
- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
- Minimal setup of components and routes

## Getting started

**Requirements:**

- Node.js version 18.0.0 or higher

To install dependancies:
```bash
npm install
```

To build for production:
```bash
npm run build
```

To run development on local:
```bash
npm run dev
```

To run on local first install dependancies and then set the SESSION_SECRET environment variable in the .env file.

Create a .env file in the root folder and assign the value to SESSION_SECRET.

To get a SESSION_SECRET value, follow the below steps:

Go to terminal and type:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Assign this value to the variable in .env file.

Now got to http://localhost:3000/ and refresh once.

(Note: Follow https://github.com/VishalVakil/hydrogen to see how to deploy the Hydrogen legacy app to Vercel)
