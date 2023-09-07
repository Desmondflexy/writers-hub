FROM node:gallium-alpine
WORKDIR /usr/src/app
COPY . .
RUN yarn
RUN yarn tsc
ENV PORT=8000
EXPOSE 8000
CMD ["yarn", "start"]
