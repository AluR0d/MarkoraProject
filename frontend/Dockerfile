# Dockerfile para el frontend sin nginx

# Usamos la imagen oficial de Node.js
FROM node:18

WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Compilar el frontend de Vite
RUN npm run build

# Exponer el puerto en el que corre la aplicación
EXPOSE 3000

# Ejecutar la aplicación (Vite sirve los archivos)
CMD ["npm", "run", "dev"]