import os from "os";
import pm2 from "pm2";
import request from "request-promise";

interface ElasticConfig {
	elasticUrl: string;
	indexName: string;
	type: string;
	insecure?: boolean;
}

async function sendToElastic(config: ElasticConfig, data: string) {
	try {
		const uri = `${config.elasticUrl}/${config.indexName}/${config.type}/`;
		console.log(uri);
		await request.post({
			uri,
			headers: {
				"Content-Type": "application/json",
			},
			body: data,
			strictSSL: !config.insecure,
		});
	} catch (error) {
		console.error(`Error: postMetric: ${error.message ? error.message : error} with data: ${data}`);
	}
}

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
