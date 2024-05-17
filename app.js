//modulos
const express = require("express");
const { agregarUsuario, obtenerUsuarios, editarUsuario, eliminarUsuario } = require("./usuarios.js")
const { obtenerTransferencias, nuevaTransferencia } = require("./transferencias.js");
const app = express();
const PORT = 3000;

app.listen(PORT, console.log(`Server ON! en el puerto ${PORT}`));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

//logica para usuarios:

app.post("/usuario", async (req, res) => {
    try {
        const { nombre, balance } = req.body;

        const resultado = await agregarUsuario(nombre, balance);
        res.json(resultado);
    } catch (error) {
        const { code } = error;
        console.log(`No se ha logrado agregar al usuario dado el error: ${code}`);
    }
});

app.get("/usuarios", async (req, res) => {
    try {
        const resultado = await obtenerUsuarios();
        res.json(resultado);
    } catch (error) {
        const { code } = error;
        console.log(`No se ha logrado encontrar a los usuarios dado el error: ${code}`);
    }
});

app.put("/usuario", async (req, res) => {
    try {
        const { id } = req.query;
        const { nombre, balance } = req.body;

        const resultado = await editarUsuario(id, nombre, balance);
        res.status(200).json(resultado);
    } catch (error) {
        const { code } = error;
        console.log(`No se ha logrado editar al usuario dado el error: ${code}`);
    }
});

app.delete("/usuario", async (req, res) => {
    try {
        const { id } = req.query;
        const resultado = await eliminarUsuario(id);
        res.json(resultado);
    } catch (error) {
        const { code } = error;
        console.log(`No se ha logrado eliminar al usuario dado el error: ${code}`, error);
    }
});

//lógica para transferencias:

app.post("/transferencia", async (req, res) => {
    try {
        const { emisor, receptor, monto } = req.body;

        const resultado = await nuevaTransferencia(emisor, receptor, (monto));

        res.json(resultado);

    } catch (error) {
        const { code } = error;
        console.log(`No se ha logrado realizar la transferencia dado el error: ${code}`);
    }
});

app.get("/transferencias", async (req, res) => {
    try {
        const resultado = await obtenerTransferencias();
        
        res.json(resultado);
    } catch (error) {
        const { code } = error;
        console.log(`No se ha logrado visualizar el registro de transferencias dado el error: ${code}`);
    }
});


