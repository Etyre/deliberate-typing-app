# Use a Node.js base image
FROM node:20

ARG PORT

# Install ssh-keygen
RUN apt-get update && apt-get install -y openssh-client openssl

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

COPY ./frontend/package*.json ./frontend/

# Install app dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .

# Build the app
RUN npm run build

# Expose the app port
EXPOSE ${PORT}

# Run the app
CMD [ "npm", "start" ]