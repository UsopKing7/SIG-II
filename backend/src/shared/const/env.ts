const { PORT } = process.env

export const env = {
  PORT: Number(PORT) || 3333
}
