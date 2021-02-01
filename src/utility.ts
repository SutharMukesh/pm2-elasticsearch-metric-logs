import request from "request-promise";

interface ElasticConfig {
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

