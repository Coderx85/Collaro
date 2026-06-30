import logger from "@/lib/logger";

export function register() {
  logger.info({ event: "server_start", runtime: "next" }, "Collaro server initializing");
}
