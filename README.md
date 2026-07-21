# ZNAC Frontend

[Russian version](README.ru.md)

React frontend for ZNAC, a personal website that combines a portfolio, blog, projects showcase, photo gallery, and administration dashboard.

Live site: https://znac.org

## Related Repositories

- Infrastructure and deployment: https://github.com/AlinaZolotavina/znac-project
- Backend API: https://github.com/AlinaZolotavina/znac-api

## Responsibilities

- Render the public website, blog, projects, and photo gallery.
- Provide authenticated administration screens.
- Communicate with the Express API through a centralized request layer.
- Handle protected routes, forms, modals, search, filters, and upload UI.
- Handle the contact form flow through shared API utilities.
- Run frontend CI and trigger production deployment after successful checks.

## Features

- Blog post listing, search, topic filtering, details, create, edit, and delete flows.
- Project listing, filtering, create, edit, and delete flows.
- Photo gallery with search, hashtags, load more, preview modal, upload, and delete flows.
- Authentication, logout, profile, password recovery, and protected routes.
- Contact form.
- Responsive layout.

## Architecture

```text
React application
  |
  v
Feature modules
  |-- auth
  |-- blog
  |-- gallery
  |-- projects
  |-- profile
  |
  v
Shared layer
  |-- API clients
  |-- request helpers
  |-- validation helpers
  |-- reusable UI patterns
  |-- contact form API flow
  |
  v
Express API through /api
```

Production architecture:

```text
Browser
  |
  v
Nginx container from znac-project
  |-- serves React build
  |-- proxies /api/* to znac-api
```

## Repository Layout

```text
znac/
  .github/workflows/ci.yml
  public/
  src/
    app/
    features/
      auth/
      blog/
      gallery/
      profile/
      projects/
      contact/  # contact tests only; implementation is shared/blog-driven
    shared/
    test/
```

## Environment

Local environment variables are stored in `.env` files.

Important variable:

```text
REACT_APP_API_URL
```

For production Docker builds, `znac-project/nginx/Dockerfile` passes:

```text
REACT_APP_API_URL=/api
```

## Development

Install dependencies:

```bash
npm install
```

Start local development server:

```bash
npm start
```

Build production bundle:

```bash
npm run build
```

## Testing

Run tests:

```bash
npm test
```

Run tests once for CI-style verification:

```bash
npm test -- --watchAll=false
```

## Docker

The frontend does not have its own standalone production Dockerfile.

In production, the React build is created inside `znac-project/nginx/Dockerfile` and then served by Nginx.

Run the full production-like stack from `znac-project`:

```bash
docker compose up -d --build
```

## CI/CD

GitHub Actions workflow:

```text
.github/workflows/ci.yml
```

On push or pull request to `main`, CI runs:

```text
npm ci
npm test -- --watchAll=false
npm run build
```

On successful push to `main`, the workflow triggers production deployment in `znac-project`.

Deployment flow:

```text
Push to znac/main
  |
  v
Frontend CI
  |
  v
Trigger znac-project Deploy
  |
  v
AWS Lightsail docker compose up -d --build
```

Required GitHub secret in this repository:

```text
ZNAC_PROJECT_DEPLOY_TOKEN
```

## Design

- Custom UI/UX design.
- Responsive layouts.
- Reusable modal system.
- Consistent visual identity across public and admin screens.

Design references:

- Photo Gallery: https://www.figma.com/design/9Ope6gJMSxNlTgW2xmiadI/ZNAC-Photo-Gallery?node-id=0-1&t=LaVz5AllRF0P5ARz-1
- Blog and Portfolio: https://www.figma.com/design/nr7iR1eT478g28M8Mrc6BX/BLOG?node-id=0-1&t=F0lEJgBEDi8ssd8K-1

## Future Improvements

- Migration to TypeScript.
- Migration from Create React App to Vite.
- Accessibility improvements.
- Performance optimization.
- Broader component and integration test coverage.
