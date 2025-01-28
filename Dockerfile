# build environment
FROM node:18 as builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) first for caching purposes
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# production environment
FROM node:18-alpine as production

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files for production
COPY --from=builder /usr/src/app/.next .next
COPY --from=builder /usr/src/app/public public
COPY --from=builder /usr/src/app/package*.json ./

# Install production dependencies
RUN npm install --only=production

# Expose port 80
EXPOSE 80

# Set the environment variable to use port 80
ENV PORT=80

# Start the Next.js application and make it listen on port 80
CMD ["npm", "run", "start", "--", "-p", "80"]
