import os from "os";
import pm2 from "pm2";
import { sendToElastic } from "./utility";

export const postMetric = function () {
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
					host: os.hostname(),
					id: proc.pm_id,
					process: proc.name,
					status: proc.pid ? 1 : 0,
					memory: proc.monit?.memory,
					cpu: proc.monit?.cpu,
				};

				await sendToElastic(
					{
						elasticUrl: "",
						indexName: "pm2-monit",
						type: "_doc",
					},
					JSON.stringify(data)
				);
			}
		} catch (error) {
			console.error(error.message);
		}
	});
};
