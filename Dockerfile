# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the Docker image to /app
WORKDIR /app

# Copy package.json and package-lock.json into the Docker image
COPY package*.json ./

# Install the application's dependencies in the Docker image
RUN npm install

# Copy the rest of the application into the Docker image
COPY . .

# Download https://truststore.pki.rds.amazonaws.com/us-east-1/us-east-1-bundle.pem to sequelize folder
RUN wget https://truststore.pki.rds.amazonaws.com/us-east-1/us-east-1-bundle.pem -O /app/sequelize/us-east-1-bundle.pem

# Expose port 80 in the Docker image
EXPOSE 80

# Start the application
CMD [ "node", "index.mjs" ]