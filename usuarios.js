const { Pool } = require("pg");

const config = {
    database: "bancosolar",
    user: "postgres",
    password: "7589",
    host: "localhost",
    port: 5432,
};

const pool = new Pool(config);

const agregarUsuario = async (nombre, balance) => {
    const consulta = {
        text: "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2);",
        values: [ nombre, balance ]
    };

    const resultado = await pool.query(consulta);
    return resultado.rows[0];
};

const obtenerUsuarios = async () => {
    const resultado = await pool.query("SELECT * FROM usuarios");
    return resultado.rows;
};

const editarUsuario = async (id, nombre, balance) => {
    const editar = {
        text: `UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = ${id} RETURNING *;`,
        values: [ nombre, balance ]
    }

    const resultado = await pool.query(editar);
    return resultado.rows;
};

const eliminarUsuario = async (id) => {
    const eliminar = {
        text: `DELETE FROM usuarios WHERE id = '${id}'`
    }

    const resultado = pool.query(eliminar);
    return resultado
};

module.exports = { agregarUsuario, obtenerUsuarios, editarUsuario, eliminarUsuario }