FROM httpd:2.4-alpine
COPY ./docker/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./dist /usr/local/apache2/htdocs/
