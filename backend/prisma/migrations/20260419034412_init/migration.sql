-- CreateEnum
CREATE TYPE "TipoServicio" AS ENUM ('CAFE', 'TIENDA', 'FARMACIA', 'BANIO', 'OTRO');

-- CreateEnum
CREATE TYPE "ColorLinea" AS ENUM ('ROJA', 'AMARILLA', 'VERDE', 'AZUL', 'NARANJA', 'BLANCA', 'CELESTE', 'MORADA', 'CAFE', 'PLATEADA');

-- CreateEnum
CREATE TYPE "EstadoLinea" AS ENUM ('ACTIVA', 'MANTENIMIENTO', 'CERRADA');

-- CreateEnum
CREATE TYPE "EstadoIncidente" AS ENUM ('ABIERTO', 'EN_REVISION', 'RESUELTO');

-- CreateTable
CREATE TABLE "Linea" (
    "id_linea" TEXT NOT NULL,
    "nombre_linea" TEXT NOT NULL,
    "color" "ColorLinea" NOT NULL,
    "cantidad_cabinas" INTEGER NOT NULL,
    "estado" "EstadoLinea" NOT NULL DEFAULT 'ACTIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Linea_pkey" PRIMARY KEY ("id_linea")
);

-- CreateTable
CREATE TABLE "Estacion" (
    "id_estacion" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "geom" geometry NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Estacion_pkey" PRIMARY KEY ("id_estacion")
);

-- CreateTable
CREATE TABLE "LineaEstacion" (
    "id_linea_estacion" TEXT NOT NULL,
    "id_linea" TEXT NOT NULL,
    "id_estacion" TEXT NOT NULL,

    CONSTRAINT "LineaEstacion_pkey" PRIMARY KEY ("id_linea_estacion")
);

-- CreateTable
CREATE TABLE "Poste" (
    "id_poste" TEXT NOT NULL,
    "id_linea" TEXT NOT NULL,
    "geom" geometry NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Poste_pkey" PRIMARY KEY ("id_poste")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id_servicio" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoServicio" NOT NULL,
    "id_estacion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id_servicio")
);

-- CreateTable
CREATE TABLE "Accesibilidad" (
    "id_accesibilidad" TEXT NOT NULL,
    "tiene_ascensor" BOOLEAN NOT NULL DEFAULT false,
    "tiene_rampa" BOOLEAN NOT NULL DEFAULT false,
    "tiene_banio" BOOLEAN NOT NULL DEFAULT false,
    "id_estacion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accesibilidad_pkey" PRIMARY KEY ("id_accesibilidad")
);

-- CreateTable
CREATE TABLE "Imagen" (
    "id_imagen" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "descripcion" TEXT,
    "id_estacion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Imagen_pkey" PRIMARY KEY ("id_imagen")
);

-- CreateTable
CREATE TABLE "Incidente" (
    "id_incidente" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "EstadoIncidente" NOT NULL DEFAULT 'ABIERTO',
    "id_linea" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incidente_pkey" PRIMARY KEY ("id_incidente")
);

-- CreateIndex
CREATE UNIQUE INDEX "Linea_color_key" ON "Linea"("color");

-- CreateIndex
CREATE UNIQUE INDEX "LineaEstacion_id_linea_id_estacion_key" ON "LineaEstacion"("id_linea", "id_estacion");

-- CreateIndex
CREATE UNIQUE INDEX "Accesibilidad_id_estacion_key" ON "Accesibilidad"("id_estacion");

-- AddForeignKey
ALTER TABLE "LineaEstacion" ADD CONSTRAINT "LineaEstacion_id_linea_fkey" FOREIGN KEY ("id_linea") REFERENCES "Linea"("id_linea") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineaEstacion" ADD CONSTRAINT "LineaEstacion_id_estacion_fkey" FOREIGN KEY ("id_estacion") REFERENCES "Estacion"("id_estacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poste" ADD CONSTRAINT "Poste_id_linea_fkey" FOREIGN KEY ("id_linea") REFERENCES "Linea"("id_linea") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_id_estacion_fkey" FOREIGN KEY ("id_estacion") REFERENCES "Estacion"("id_estacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accesibilidad" ADD CONSTRAINT "Accesibilidad_id_estacion_fkey" FOREIGN KEY ("id_estacion") REFERENCES "Estacion"("id_estacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "Imagen_id_estacion_fkey" FOREIGN KEY ("id_estacion") REFERENCES "Estacion"("id_estacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidente" ADD CONSTRAINT "Incidente_id_linea_fkey" FOREIGN KEY ("id_linea") REFERENCES "Linea"("id_linea") ON DELETE RESTRICT ON UPDATE CASCADE;
