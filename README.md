# TrendNine

We use Netlify to host our website and prerender crawler requests for SEO and Meta Information.

## Staging Environments
Push to the `staging` branch for changes to pre-production, and create a pull request to `master` to deploy to production.

## Getting Started
Install the following plugins for your editor. We have config files that will stylize our code to be consistent. We recommend using VSCode for development.

1. Stylelint
2. EditorConfig
3. TSLint

Add a SSH key to your GitHub account: https://help.github.com/articles/connecting-to-github-with-ssh/

Run `git clone git@github.com:trendnine/trendnineweb.git`

Install all dependencies with `npm install`

Run the dev server with `npm run dev`

Navigate to `localhost:3000` to access your app!
