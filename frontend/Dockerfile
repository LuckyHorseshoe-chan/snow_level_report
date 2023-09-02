# pull official base image
FROM node:latest as build

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

# add app
COPY . .

RUN npm install
CMD ["npm", "start"]