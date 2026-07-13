# ZNAC

ZNAC is a personal website that combines a portfolio, blog, projects showcase, photo gallery, and administration dashboard.

The frontend was designed and developed independently, including UI/UX design, application architecture, implementation, deployment coordination, automated testing, and ongoing maintenance.

This project is actively maintained and continuously improved.

## Demo

Live version: https://znac.org

## Screenshots

<p>
  <img src="./docs/screenshots/screenshot-blog.png" width="48%" valign="top">
  <img src="./docs/screenshots/screenshot-gallery.png" width="48%" valign="top">
</p>

<p>
  <img src="./docs/screenshots/screenshot-posts-page.png" width="48%" valign="top">
  <img src="./docs/screenshots/screenshot-new-post.png" width="48%" valign="top">
</p>

## Features

Content Management

- Create, edit, and delete blog posts
- Manage projects
- Upload and organize photos
- Manage hashtags

Authentication

- JWT authentication
- Protected routes
- Password recovery
- Email update
- Profile management

Content Discovery

- Search posts and photos
- Category filtering
- Hashtag-based navigation

## Design highlights:

- Custom UI/UX design
- Responsive layouts
- Mobile-first approach
- Reusable components and modal system
- Consistent visual identity across all sections

Click here to see [Photo Gallery Design](https://www.figma.com/design/9Ope6gJMSxNlTgW2xmiadI/ZNAC-Photo-Gallery?node-id=0-1&t=LaVz5AllRF0P5ARz-1).

And here is [Blog & Portfolio Design](https://www.figma.com/design/nr7iR1eT478g28M8Mrc6BX/BLOG?node-id=0-1&t=F0lEJgBEDi8ssd8K-1).

## Architecture

The application is organized into reusable UI components and feature-based sections.

Main areas:

- Authentication
- Blog (posts)
- Projects
- Photo Gallery
- Portfolio
- Profile Management
- Administration Dashboard

The application communicates with a custom REST API through a centralized request layer and uses protected routes for authenticated areas.

## Technologies

- React 18
- React Router 6
- JavaScript (ES6+)
- HTML5
- CSS3
- REST API
- Jest
- React Testing Library

## Related Repository

Backend API: [ZNAC API](https://github.com/AlinaZolotavina/znac-api)

## Installation & Running the Application

1. Clone the repository:

```bash
git clone https://github.com/AlinaZolotavina/znac.git
cd znac
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file based on .env.example.

4. Start development server:

```bash
npm start
```

5. Create production build:

```bash
npm run build
```

6. Run tests:

```bash
npm test
```

## Deployment

Hosted on AWS Lightsail.

## Future Improvements

- Migration to TypeScript
- Migration to Vite
- Performance optimization
- Accessibility improvements
- Additional frontend test coverage
