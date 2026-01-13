import migrator from "@/models/migrator";
import { createRouter } from "next-connect";
import controller from "src/infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandler);

async function getHandler(request, respose) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return respose.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();
  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}
