FROM nginx:alpine
EXPOSE 80
COPY ./docs/.vitepress/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
