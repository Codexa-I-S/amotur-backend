#!/bin/sh

export DB_HOST=$(echo $DATABASE_URL | sed -E 's#.*@([^:/]+):.*#\1#')
export DB_PORT=$(echo $DATABASE_URL | sed -E 's#.*:([0-9]+)/.*#\1#')
export DB_USER=$(echo $DATABASE_URL | sed -E 's#postgres://([^:]+):.*#\1#')

echo "Esperando o banco em $DB_HOST:$DB_PORT..."

until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER
do
  echo "Banco não está pronto ainda. Tentando novamente em 3 segundos..."
  sleep 3
done

echo "Banco está online! Rodando as migrações..."

npx prisma migrate deploy

echo "Iniciando o NestJS..."

node dist/main