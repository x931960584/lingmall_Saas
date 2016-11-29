FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY release /usr/share/nginx/html
