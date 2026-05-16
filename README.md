# Sport News

Sport News is a modern sports news platform built with Next.js. It provides the latest updates, articles, and rankings across various sports, including football, basketball, tennis, and more. The platform is designed to be user-friendly and responsive, ensuring a seamless experience on both mobile and desktop devices.

## Features

- **Latest Sports News**: Stay updated with the latest happenings in the sports world.
- **User-Friendly Interface**: Intuitive design for easy navigation.
- **Responsive Design**: Optimized for both mobile and desktop devices.
- **Bookmark Articles**: Save your favorite articles for later.
- **Global Search**: Quickly find news and updates on your favorite sports or teams.
- **Editorial Insights**: Access expert opinions and analyses.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/KamrAnDarmAn/sport-news.git
   ```

2. Navigate to the project directory:

   ```bash
   cd sport-news
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`.

## Folder Structure

The project is organized as follows:

```
app/
  globals.css       # Global styles
  layout.tsx        # Main layout component
  page.tsx          # Landing page
  ...               # Other pages and components
components/
  ui/               # Reusable UI components
  editor/           # Editor components for creating content
  ...               # Other components
lib/
  prisma.ts         # Prisma client setup
  utils.ts          # Utility functions
  ...               # Other libraries
prisma/
  schema.prisma     # Database schema
  migrations/       # Database migrations
public/
  icons/            # Static icons
  images/           # Static images
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, please contact [KamrAnDarmAn](https://github.com/KamrAnDarmAn).
