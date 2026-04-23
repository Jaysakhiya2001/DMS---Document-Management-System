FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# We use tsx to run the application directly in dev-like mode or start
# For a real production build, we would run tsc and then node dist/server.js
# But as per user request for easy setup, we stick to tsx for now.
EXPOSE 4000

CMD ["npm", "run", "dev"]
