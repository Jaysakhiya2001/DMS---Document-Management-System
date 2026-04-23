FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# For development/quick setup as requested, we can just use npm run dev
# but I'll provide a standard Next.js dev dockerfile.
EXPOSE 3000

CMD ["npm", "run", "dev"]
