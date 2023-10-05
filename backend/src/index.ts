import express from "express";
import http from "http";

export async function main() {
    const app = express();

    app.listen(Number(process.env.PORT || 4173));

    app.use(async (request, response) => {
        const url = new URL(request.url, "http://frontend:4173");

        const prequest = http.request(
            url.href,
            { headers: request.headers },
            (presponse) => {
                response.status(presponse.statusCode || 200);

                for (const [key, value] of Object.entries(presponse.headers)) {
                    response.setHeader(key, String(value));
                }

                presponse.pipe(response);
            }
        );

        request.pipe(prequest);
    });
}
