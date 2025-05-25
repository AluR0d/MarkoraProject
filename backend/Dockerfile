# Utiliza una imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente del backend
COPY . .

# Expón el puerto en el que el backend correrá (3000)
EXPOSE 3000

# Define el comando para ejecutar el backend
CMD ["npm", "run", "start"]
