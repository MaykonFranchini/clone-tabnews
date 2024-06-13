import database from "infra/database.js";

export default async function status(request, response) {
  const databaseName = process.env.POSTGRES_DB;
  const dbVersion = await database.query('SELECT version();')
  const dbMaxConnections = await database.query('SHOW max_connections;')
  const dbOpenedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName]
  })
//   const dbtest = await database.query('SELECT sum(numbackends) FROM pg_stat_database;')
// console.log(dbtest);
  
  const updatedAt = new Date().toISOString()
  const dbVersionFormated = dbVersion.rows[0].version.split(' ')[1]
  const maxConnectionsFormated = Number(dbMaxConnections.rows[0].max_connections)

  response.status(200).json({
    updated_at: updatedAt,
    database: {
      version: dbVersionFormated,
      max_connections: maxConnectionsFormated,
      opened_connections: dbOpenedConnections.rowCount,
    }
    
  });
}
