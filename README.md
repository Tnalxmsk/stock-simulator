## Getting Started

git clone https://github.com/Tnalxmsk/stock-simulator

Open the project in your favorite code editor (VSC, WebStorm, etc.).

Install the dependencies:
```bash
npm install
```

add .env file in the root directory and add your environment variables there.
```
NEXT_PUBLIC_API_KEY=6B670IK4TOUISTHL
NEXT_PUBLIC_PREP_API_KEY=jYtywKy4kFQcbeluxVbshhTmkPviynJ1
NEXT_PUBLIC_API_URL=https://www.alphavantage.co

```

run the following command

```bash

run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production URL

You can use the following URL to access the production version of the application:
https://stock-simulator-two.vercel.app/

## .ENV
This project uses environment variables to manage configuration. Create a `.env.local` file in the root directory and add your environment variables there. For example:

```
NEXT_PUBLIC_API_KEY=6B670IK4TOUISTHL
NEXT_PUBLIC_PREP_API_KEY=jYtywKy4kFQcbeluxVbshhTmkPviynJ1
NEXT_PUBLIC_API_URL=https://www.alphavantage.co

```
