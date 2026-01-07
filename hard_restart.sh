docker compose down -v
docker system prune -af
docker compose build --no-cache
docker compose up