Для выполнения лабораторной 1 необходимо откатиться к версии "Лабораторная 1"
Для выполнения лабораторной 2 необходимо создать следующую структуру директорий:
dockerLab/
    dockerLab-backend/
    dockerLab-frontend/
    docker-compose.yml
    nginx/
        nginx.conf


Содержимое docker-compose.yml
version: "3.8"

services:
  db:
    image: postgres:15
    container_name: postgres_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 5567
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - my_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5

  backend:
    build: ./dockerLab-backend
    container_name: backend
    restart: always
    depends_on:
      db:
        condition: service_healthy 
    environment:
      DB_HOST: db
      DB_USER: postgres
      DB_PASSWORD: 5567
      DB_NAME: postgres
    ports:
      - "3000:3000"
    networks:
      - my_network

  frontend:
    build: ./dockerLab-frontend
    container_name: frontend
    restart: always
    depends_on:
      - backend
    ports:
      - "5173:5173"
    networks:
      - my_network

  nginx:
    image: nginx:latest
    container_name: nginx_proxy
    restart: always
    depends_on:
      - frontend
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - my_network

networks:
  my_network:

volumes:
  postgres_data:


содержимое nginx.conf
events { }

http {
    server {
        listen 80;

        location / {
            proxy_pass http://frontend:5173;
        }

        location /api/ {
            rewrite ^/api(/.*)$ $1 break;
            proxy_pass http://backend:3000;
        }
    }
}
