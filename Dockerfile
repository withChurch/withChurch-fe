# 1단계: 빌드
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 실행 (Nginx 활용)
FROM nginx:stable-alpine
# 빌드 결과물 복사 (Vite 기준 dist, CRA 기준 build)
COPY --from=build /app/dist /usr/share/nginx/html
# SPA 라우팅을 위한 Nginx 설정 (필요시 추가)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]