## Replicate sandbox

Currently configured to use Riffusion and Stable Diffusion.

## Getting started with Next.js and Replicate

This is a [Next.js](https://nextjs.org/) template project that's preconfigured to work with Replicate's API.

You can use this as a quick jumping-off point to build a web app using Replicate's API, or you can recreate this codebase from scratch by following the guide at [replicate.com/docs/get-started/nextjs](https://replicate.com/docs/get-started/nextjs)

## Noteworthy files

- [pages/index.js](pages/index.js) - The React frontend that renders the home page in the browser
- [pages/api/riffusion/index.js](pages/api/riffusion/index.js) - The backend API endpoint that calls Replicate's API to create a prediction
- [pages/api/riffusion/[id].js](pages/api/riffusion/[id].js) - The backend API endpoint that calls Replicate's API to get a specific prediction result, used once a predition is successful

## Usage

Install dependencies:

```console
npm install
```

Add your [Replicate API token](https://replicate.com/account#token) to `.env.local`:

```
REPLICATE_API_TOKEN=<your-token-here>
```

Run the development server:

```console
npm run dev
```