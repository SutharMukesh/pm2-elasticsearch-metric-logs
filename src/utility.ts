import request from "request-promise";

export interface ElasticConfig {
	elasticUrl: string;
	indexName: string;
	type: string;
	insecure?: boolean;
}

export const sendToElastic = async function (config: ElasticConfig, data: string) {
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
};

export const getTodaysIndex = function (indexName: string) {
	const d = new Date();
	const index = indexName + "-" + d.getFullYear() + "." + ("0" + (d.getMonth() + 1)).substr(-2) + "." + ("0" + d.getDate()).substr(-2);
	return index;
};
