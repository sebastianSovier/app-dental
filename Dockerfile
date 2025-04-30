# Etapa 1: Build Angular
FROM node:20-alpine as builder

WORKDIR /app

RUN npm install -g @angular/cli --force

COPY package*.json ./
RUN npm install --force

COPY . .
RUN ng build --configuration production

# Etapa 2: Nginx para servir
FROM nginx:stable-alpine

# Copiar artefactos de Angular
COPY --from=builder /app/dist/app-dental/browser /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl/ /etc/nginx/ssl/
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
