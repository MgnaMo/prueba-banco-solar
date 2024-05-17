const { Pool } = require("pg");

const config = {
    database: "bancosolar",
    user: "postgres",
    password: "7589",
    host: "localhost",
    port: 5432,
};

const pool = new Pool(config);

const nuevaTransferencia = async (emisor, receptor, monto) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const restaEmisor = {
            text: "UPDATE usuarios SET balance = balance - $2 WHERE id = $1 RETURNING *;",
            values: [ emisor, monto ],
        }

        const sumaReceptor = {
            text: "UPDATE usuarios SET balance = balance + $2 WHERE id = $1 RETURNING *;",
            values: [ receptor, monto ],
        }

        const registrarTransferencias = {
            text: "INSERT INTO transferencias (emisor, receptor, monto) VALUES ($1, $2, $3);",
            values: [ emisor, receptor, monto ],
        }

        const resultadoResta = await client.query(restaEmisor);

        const resultadoSuma = await client.query(sumaReceptor);

        await client.query(registrarTransferencias);

        await client.query("COMMIT");

        return { emisor: resultadoResta.rows[0], receptor: resultadoSuma.rows[0] };

    } catch (error) {
        await client.query("ROLLBACK");
        const { code } = error;
        
        console.log(`Ocurrió algo inesperado: ${code}`, error);
    } finally {
        client.release();
    }
};

const obtenerTransferencias = async () => {
    const result = await pool.query("SELECT * FROM transferencias");
    return result.rows;
};

module.exports = { nuevaTransferencia, obtenerTransferencias }