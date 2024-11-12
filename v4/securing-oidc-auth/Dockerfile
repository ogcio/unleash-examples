FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Expose port
EXPOSE 4242

# Start the application
CMD ["npm", "start"]
