const axios = require("axios");
const { handler } = require("../utils/derivePayload");
const buildInsertSQL = require("../utils/buildInsertSQL");

const QUESTDB_URL = "http://35.154.253.103:9000/exec";

exports.insertQecho = async (req, res) => {
  try {
    const derived = (await handler(req.body)).body;
    const sql = buildInsertSQL(derived);

    await axios.get(QUESTDB_URL, { params: { query: sql } });

    const fetchSql = `SELECT * FROM telemetry_data3 ORDER BY ts DESC LIMIT 1`;
    const { data: fetchData } = await axios.get(QUESTDB_URL, {
      params: { query: fetchSql },
    });

    if (!fetchData.columns || !fetchData.dataset.length) {
      throw new Error("No data returned from QuestDB after insert");
    }

    const latestRow = Object.fromEntries(
      fetchData.columns.map((col, i) => [col.name, fetchData.dataset[0][i]])
    );

    req.io.emit("socket-echo", latestRow);
    res.status(201).json({
      message: "✅ Data inserted",
      query: sql,
      insertedPayload: derived,
    });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

exports.getQecho = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const sql = `SELECT * FROM telemetry_data3 ORDER BY ts DESC LIMIT ${limit}`;
    const { data } = await axios.get(QUESTDB_URL, { params: { query: sql } });

    const rows = data.dataset.map((row) =>
      Object.fromEntries(data.columns.map((col, i) => [col.name, row[i]]))
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
