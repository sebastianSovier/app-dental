# Etapa 1: Build Angular
FROM node:slim AS builder

WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm install

RUN npm audit fix || true
COPY . .
RUN ng build --configuration production

# Etapa 2: Nginx para servir
FROM nginx:stable-alpine

# Copiar artefactos de Angular
COPY --from=builder /app/dist/app-dental/browser /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf
#COPY ssl/ /etc/nginx/ssl/
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
