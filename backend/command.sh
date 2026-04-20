#!/bin/sh

colorRojo='\033[0;31m'
colorVerde='\033[0;32m'
colorAzul='\033[0;34m'
sinColor='\033[0m'

# Función para mostrar barra de carga con puntos animados
mostrar_carga() {
    # shellcheck disable=SC3043
    # shellcheck disable=SC2086
    local mensaje=$1
    # shellcheck disable=SC3037
    echo -ne "${colorAzul}| Cargando $mensaje"
    # shellcheck disable=SC2034
    # shellcheck disable=SC3009
    for i in {1..3}; do
        # shellcheck disable=SC3037
        echo -ne "."
        sleep 0.5
    done
    # shellcheck disable=SC3037
    echo -e "${sinColor}"
}

# shellcheck disable=SC3037
echo -e "${colorAzul}| Esperando a la base de datos..."
mostrar_carga ""
sleep 2

# shellcheck disable=SC3037
echo -e "${colorAzul}| Iniciando migraciones"
mostrar_carga "migraciones"
npx prisma migrate deploy 2>/dev/null 1>/dev/null

# shellcheck disable=SC2181
if [ $? -eq 0 ]; then
  # shellcheck disable=SC3037
  echo -e "${colorVerde} ✓ Migraciones exitosas"
else
  # shellcheck disable=SC3037
  echo -e "${colorRojo} ✗ Migraciones fallidas"
fi

# shellcheck disable=SC3037
echo -e "${colorAzul}| Iniciando Prisma Client"
mostrar_carga "Prisma Client"
npx prisma generate 2>/dev/null 1>/dev/null

# shellcheck disable=SC2181
if [ $? -eq 0 ]; then
  # shellcheck disable=SC3037
  echo -e "${colorVerde} ✓ Prisma Client exitoso"
else
  # shellcheck disable=SC3037
  echo -e "${colorRojo} ✗ Prisma Client fallido"
fi

# shellcheck disable=SC3037
echo -e "${colorAzul}| Iniciando servidor"
mostrar_carga "servidor"
npm run start:prod

# shellcheck disable=SC2181
if [ $? -eq 0 ]; then
  # shellcheck disable=SC3037
  echo -e "${colorVerde} ✓ Servidor iniciado"
else
  # shellcheck disable=SC3037
  echo -e "${colorRojo} ✗ Servidor fallido"
fi