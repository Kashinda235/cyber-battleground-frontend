# /frontend/Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the port your React app runs on (usually 3000 for CRA or 5173 for Vite)
EXPOSE 3000

# Command to start the development server
CMD ["npm", "run", "dev"]