FROM node:16

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

# Exponer el puerto (ajústalo si es necesario)
EXPOSE 4200

CMD ["npm", "run", "dev"]
