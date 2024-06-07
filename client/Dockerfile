# Pull from node alpine docker image,use current alpine version
FROM node:current-alpine

# Set src/app as work directory
WORKDIR src/app

# Copy All project files
COPY . .

# Build
RUN yarn install
RUN yarn build

# Expose & Set ENV port to 3012
EXPOSE 3012
ENV PORT 3012

# Serve the build
CMD ["yarn", "start"]
