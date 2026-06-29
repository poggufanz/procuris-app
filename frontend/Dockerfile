FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json* ./
# ponytail: npm install (not ci) so build works whether or not a lockfile is committed
RUN npm install

COPY . .

# Vite inlines VITE_* at build time; point the SPA at the browser-reachable gateway origin.
ARG VITE_API_GATEWAY_URL=http://localhost:8080
ENV VITE_API_GATEWAY_URL=$VITE_API_GATEWAY_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
