# ─── Builder Stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .

# Build for production
RUN npm run build

# ─── Development Stage ────────────────────────────────────────────────────
FROM node:20-alpine AS development

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]



# ─── Production Stage ─────────────────────────────────────────────────────
# ─── Production Stage ─────────────────────────────────────────────────────
FROM nginx:alpine AS production

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

# Create necessary directories and set permissions
RUN mkdir -p /var/cache/nginx/client_temp /var/run/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/run/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx && \
    chmod -R 755 /var/run/nginx

USER nginx



EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]