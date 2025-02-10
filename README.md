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

# Hydrogen Storefront Deployment

## 1. Deployment on Vercel

I deployed our Hydrogen version on the Vercel serverless platform, but the deployment kept failing. Upon troubleshooting, I found that Vercel’s build output doesn’t match Hydrogen’s output (which is `dist`). After further investigation, I discovered that Vercel recently rolled out zero-configuration deployment for Hydrogen legacy version apps. Since our version is not supported, I deployed the legacy version on Vercel to showcase the ability to deploy Hydrogen apps.

**Live URL:** [Hydrogen Legacy on Vercel](https://hydrogen-ol5l.vercel.app/)  
(Note: This is a demo deployment of a Hydrogen legacy version, not the one I edited. I deployed it on Oxygen, and this is a demo of a Hydrogen legacy version supported by Vercel.)

**Repository I used to deploy this Hydrogen legacy version:**  
[GitHub - Hydrogen Legacy](https://github.com/VishalVakil/hydrogen)

---

## 2. Deployment of Hydrogen Storefront on Oxygen

**Storefront URL:** [Hydrogen Storefront on Oxygen](https://hydrogenapp-b2d4aa8a7dcacf141765.o2.myshopify.dev/)  
(Note: Shopify APIs are being used here, so the mock data won’t appear.)

### Theme Implementation:
1. Downloaded the **Broadcast Bold** theme from the Shopify store.
2. Analyzed the structure of the theme and identified the files inside the theme folder.
3. Created three files inside the following directories:
   - `sections/product-template.liquid`
   - `templates/product.liquid`
   - `snippets/product-form.liquid`
4. Moved the folder inside the Hydrogen Storefront local folder to ensure I could track the files.
5. Navigated to the theme directory.
6. Ran `shopify theme dev --store HydrogenApp` (HydrogenApp was the storefront I created and I was logged into the Shopify account).
   
   **Expected Outcome:**  
   The theme should have been applied to the local store. However, due to partner staff account access limitations, I was unable to see the theme on the local machine.

7. **To apply the theme to the online store:**
   - `shopify theme push –unpublished`
   - `shopify theme push`
   - `shopify theme publish`

### Approach:
Based on the requirements, I listed the tasks needed for the product details page. I had previously studied Hydrogen concepts and figured out that new components were needed to implement the **Product Gallery** with carousel/zoom functionality and lazy loading. Here's a breakdown of the approach:

1. Created a **ProductGallery.jsx** component:
   - Implemented a carousel with "Next" and "Previous" buttons.
   - Managed image indices using `useState`.
   - Added error handling to check if images are available.
   - Implemented lazy loading using `loading="lazy"` on the `<img>` tag.
   
2. **Reviews Section:**
   - Created a **Reviews.jsx** component and integrated it into the `product.$handle.jsx` page.
   - Custom mock data was created for reviews, along with the ability to fetch reviews from a real API.

3. **Product Recommendations Section:**
   - Created a component for recommendations.
   - Displayed Shopify recommendations.
   - Created logic for AI-powered recommendations, which would be fetched when the API URL is provided (API key was used for testing).

4. **Sticky Add to Cart Bar:**
   - Implemented a sticky "Add to Cart" bar that becomes visible when the user scrolls down 30px.
   - Dynamically updates the button text and price based on the selected variant.

5. Used **`<CartProvider>`** from `@shopify/hydrogen-react` to manage cart state and updated the necessary components (`root.jsx`, `AddToCartButton.jsx`, and `StickyAddToCart.jsx`).
6. Used **storefront.CacheLong()** to help with caching and performance.
7. Included a simple **JSON-LD** snippet for structured data.

---

## Things Done:
1. Interactive product image gallery with carousel/zoom functionality.
2. Variant selector that dynamically updates the price.
3. "Add to Cart" feature implemented with `<CartProvider>`.
4. Reviews section with mock and API-supported data.
5. AI-powered product recommendations and Shopify recommendations.
6. Deployed Hydrogen legacy version to Vercel (different from the customized storefront).
7. Created theme files – utilized Claude to understand and create the liquid files.
8. Thoroughly explored Hydrogen, Oxygen, and Theme documentation.
9. Deployed the customized storefront on Oxygen.
10. Implemented lazy loading for images.
11. Used **storefront.CacheLong()** in the loader to help with caching and performance.
12. Included a simple **JSON-LD** snippet for structured data.

---

## Difficulties and Trade-offs:
- **Recommendations API:** Initially, the recommendations section didn’t appear because there were no recommendations available. I used Shopify recommendations and also kept AI-powered recommendations when available (requiring API URL).
- **Review Prop Passing:** Faced difficulties in passing the `review` prop to the review section. It was a minor mistake in comparing reviews to arrays, which were `Promises`. Debugged and fixed the issue using `console.log()`.
- **Deployment Issues on Vercel and Fly.io:** After several deployment attempts and connecting GitHub to Vercel, I faced issues with Vercel’s build output not matching Hydrogen’s output (`dist`). I created a `vercel.json` file, configured it, and successfully deployed, but still encountered a 404 error. I overcame this by deploying the Hydrogen legacy version demo-store on Vercel.
- **Theme Linking Issue:** Encountered difficulties linking the theme to the storefront on Oxygen due to partner staff account access limitations. I was unable to link the theme and create a store, so I included the store files in the repository and displayed the customized storefront running locally.

---

## Conclusion:
I gained a thorough understanding of Hydrogen, Oxygen, and Shopify Themes. While I still need to improve my understanding of Liquid files, I feel more comfortable with Hydrogen now. This assessment helped me see how things fit together, and it won't take long for me to become proficient in this platform.


