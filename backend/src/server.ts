import "dotenv/config";
import { app } from "./app";
import { testDbConnection } from "./config/db";
import { initializeDatabase } from "./config/initDb";
import { ensureMinioBucket } from "./config/minio";

const port = Number(process.env.PORT ?? 4000);

testDbConnection()
  .then(async () => {
    await initializeDatabase();
    await ensureMinioBucket();
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  })
  .catch((error: unknown) => {
    console.error("Unable to start server due to DB error", error);
    process.exit(1);
  });
