import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import { parseBuffer } from "music-metadata";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const corsWhitelist = process.env.CORS_WHITELIST?.split("\n");

const corsOptions = {
    origin: corsWhitelist,
    optionsSuccessStatus: 200,
};

app.use(
    fileUpload({
        createParentPath: true,
    })
);
app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
    console.log(corsWhitelist);
    res.send("Express + TypeScript Server");
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post("/metadata", async (req: Request, res: Response) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "No file uploaded",
            });
        }
        else {
            const track: fileUpload.UploadedFile = req.files.track as fileUpload.UploadedFile;
            const fileInfo = {
                mimetype: track.mimetype,
                size: track.size,
            };

            const metadata = await parseBuffer(track.data, fileInfo);
            if (metadata.common.picture) {
                const picture = metadata.common.picture[0];
                res.send({
                    status: true,
                    message: "Metadata extracted",
                    data: {
                        name: metadata.common.title,
                        cover: {
                            data: picture.data.toString("base64"),
                            format: picture.format,
                        },
                    },
                });
            }
            else {
                res.send({
                    status: true,
                    message: "File is uploaded",
                    data: {
                        name: track.name,
                        mimetype: track.mimetype,
                        size: track.size,
                    },
                });
            }
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    console.log(`⚡️[server]: Server is running at http://localhost:${port!}`);
});
