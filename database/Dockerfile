FROM node:alpine

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

RUN npx prisma generate

# Generate Prisma client for the database structure
CMD ["sh","-c","npx prisma migrate deploy && npx prisma db seed"]
