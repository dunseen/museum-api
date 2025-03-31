# Stage 1: Build
FROM node:20.16.0-alpine AS build

# Install dependencies
RUN apk add --no-cache bash
WORKDIR /usr/src/app
COPY package*.json package-lock.json ./
RUN npm ci

# Copy source files and build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20.16.0-alpine

# Install runtime dependencies
RUN apk add --no-cache bash

# Copy built files from the build stage
WORKDIR /usr/src/app
COPY --from=build /usr/src/app ./
COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.dev.sh /opt/startup.dev.sh

# Set permissions and remove carriage returns
RUN chmod +x /opt/wait-for-it.sh /opt/startup.dev.sh && \
    sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.dev.sh

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["/opt/startup.dev.sh"]