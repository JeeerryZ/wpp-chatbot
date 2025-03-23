import "reflect-metadata";
import app from './app.js';

const PORT = process.env.PORT || 25565;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});