#LTS support version of node (at 11.3.2018)
FROM node:carbon

#create the working directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production


# Bundle app source
COPY . .

#open port
EXPOSE 8080

#start server
CMD [ "npm", "start" ]
