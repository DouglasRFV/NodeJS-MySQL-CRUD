const express = require('express');
const router = express.Router();

// Listar produtos
router.get('/list_produtos', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM produtos', function (err, rows) {
            if (!err && rows.length > 0) {
                res.json(rows);
            } else {
                res.json([]);
            }
        });
    });
});

// Buscar produto pelo id
router.get('/get_produto/:id', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        let id = req.params.id;
        connection.query(`SELECT * FROM produtos WHERE id = '${id}' LIMIT 1`, function (err, rows) {
                if (!err && rows.length > 0) {
                    res.json(rows);
                } else {
                    res.json([]);
                }
            });
    });
});

// Cadastrar produtos
router.post('/create_produto', function (req, res, next) {
    try {
        pool.getConnection(function (err, connection) {
            let dados = req.body;
            let nome = dados.nome;
            let quant = dados.quant;
    
            connection.query(
                `INSERT INTO produtos (nome, quant) VALUES ('${nome}', '${quant}')`, 
                function (err, rows) {
    
                    if (rows.affectedRows) {
                        connection.query("SELECT * FROM produtos WHERE id='" + rows.insertId
                            + "' LIMIT 1", function (err, rows) {
                                if (!err && rows.length > 0) {
                                    res.json(rows);
                                } else {
                                    res.json({
                                        "message": "NÃO CADASTRADO"
                                    });
                                }
                            });
                    }
                });
        });
    } catch (error) {
        console.error('Erro', error)
    }
});

// Excluir produto
router.delete('/delete_produto/:id', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        let id = req.params.id;
        connection.query(`DELETE FROM produtos WHERE id = '${id}'`, function (err, rows) {
                if (!err) {
                    res.json({
                        "Excluído": true
                    });
                } else {
                    res.json({
                        "message": "NENHUM PRODUTO EXCLUÍDO"
                    });
                }
            });
    });
});

// Modificar produto
router.put('/update_produto/:id', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        let dados = req.body;
        let id = req.params.id;
        let nome = dados.nome;
        let quant = dados.quant;

        connection.query(
            `UPDATE produtos SET nome = '${nome}', quant = '${quant}' WHERE id = '${id}'`, function (err, rows) {
                if (rows.affectedRows) {
                    connection.query("SELECT * FROM produtos WHERE id='" + id
                        + "' LIMIT 1", function (err, rows) {
                            if (!err && rows.length > 0) {
                                res.json(rows[0]);
                            } else {
                                res.json([]);
                            }
                        });
                }
            });
    });
});

module.exports = router;