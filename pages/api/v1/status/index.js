import database from "infra/database.js";

export default async function status(request, response) {
  const dbVersion = await database.query('SHOW server_version;')
  const dbMaxConnections = await database.query('SHOW max_connections;')
  
  const databaseName = process.env.POSTGRES_DB
  const dbOpenedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;", 
    values: [databaseName]
  })
  
  const updatedAt = new Date().toISOString()
  const dbVersionFormatted = dbVersion.rows[0].server_version
  const maxConnectionsFormatted = parseInt(dbMaxConnections.rows[0].max_connections)
  const openedConnectionsFormatted = dbOpenedConnections.rows[0].count

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersionFormatted,
        max_connections: maxConnectionsFormatted,
        opened_connections: openedConnectionsFormatted,
      }
    }
    

  });
}
