# Utiliza una imagen oficial de Node.js para construir la aplicación
FROM node:18 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente del frontend
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Utiliza una imagen ligera de Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copia los archivos de build a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expón el puerto 80 para servir la app
EXPOSE 80

# Inicia Nginx para servir la app
CMD ["nginx", "-g", "daemon off;"]
