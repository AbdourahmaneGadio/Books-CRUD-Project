FROM node:alpine

RUN echo "hello there"


# Install OpenSSL (if needed)
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files and database directory
COPY . .

# Generate Prisma client for the database structure
RUN npx prisma generate

# Add initial data
CMD ["npx", "prisma", "db", "seed"]