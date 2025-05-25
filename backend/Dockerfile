# Usar la imagen oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Exponer el puerto en el que corre el backend
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]
