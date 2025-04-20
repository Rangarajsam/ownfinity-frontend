# Ownfinity Frontend

This is the frontend application for **Ownfinity**, built using [Next.js](https://nextjs.org), [React](https://reactjs.org), and [Redux Toolkit](https://redux-toolkit.js.org). The app provides a seamless e-commerce experience with features like product management, cart, wishlist, and user authentication.

## Features

- User authentication (login, logout, and registration)
- Product listing, search, and management
- Cart and wishlist functionality
- Integration with AWS S3 for image uploads
- Responsive design using Tailwind CSS

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org) (version `^18.18.0` or higher)
- [pnpm](https://pnpm.io) (preferred package manager)

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ownfinity-frontend.git
cd ownfinity-frontend

2. Install Dependencies
pnpm install

3. Set Up Environment Variables
NEXT_PUBLIC_API_URL=<your-api-url>

4. Run the app
npm run dev

```

## Technologies Used
- Framework: Next.js
- State Management: Redux Toolkit
- Styling: Tailwind CSS
- API Requests: Axios
- Image Uploads: AWS S3

## Project Structure
src/
├── app/                # Next.js app directory
│   ├── components/     # Reusable components
│   ├── store/          # Redux store and slices
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   └── pages/          # Page components
├── public/             # Static assets
├── styles/             # Global styles


## License
This project is licensed under the MIT License.