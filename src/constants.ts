import os from "os";
import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../.env` });

export const HOST_NAME = process.env.HOST_NAME || os.hostname();
export const ELASTIC_URL = process.env.ELASTIC_URL || "http://localhost:9200";
