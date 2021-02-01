import os from "os";
import pm2 from "pm2";
import { sendToElastic, ElasticConfig, getTodaysIndex } from "./utility";
import * as constants from "./constants";

export const postMetric = function () {
	const elasticConfig: ElasticConfig = {
		elasticUrl: constants.ELASTIC_URL,
		indexName: getTodaysIndex("pm2-monit"),
		type: "_doc",
	};

	pm2.list(async function (err, list) {
		try {
			if (err) {
				console.error(err);
			}
			for (let i = 0; i < list.length; i++) {
				const proc = list[i];
				const d = new Date();
				const data = {
					"@timestamp": d.toISOString(),
					host: constants.HOST_NAME,
					id: proc.pm_id,
					process: proc.name,
					status: proc.pid ? 1 : 0,
					memory: proc.monit?.memory,
					cpu: proc.monit?.cpu,
				};

				await sendToElastic(elasticConfig, JSON.stringify(data));
			}
		} catch (error) {
			console.error(error.message);
		}
	});
};

export const postLog = async function (source: string, msg: any) {
	const d = new Date();
	const elasticConfig: ElasticConfig = {
		elasticUrl: constants.ELASTIC_URL,
		indexName: getTodaysIndex("pm2"),
		type: "_doc",
	};

	const data = {
		"@timestamp": d.toISOString(),
		host: constants.HOST_NAME,
		source,
		id: msg.process.pm_id,
		process: msg.process.name,
		message: msg.data,
		event: {
			ingested: d.toISOString(),
			timezone: "+05:30",
			kind: "event",
			module: msg.process.name,
			dataset: `${msg.process.name}.${source}`,
		},
	};

	await sendToElastic(elasticConfig, JSON.stringify(data));
};
