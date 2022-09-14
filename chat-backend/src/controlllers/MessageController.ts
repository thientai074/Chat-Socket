import {
    saveMessageServices,
    findAllMessagesServices,
    markReadMessageServices,
    deleteMessageServices,
    deleteAllMessageInConversationServices,
} from "../services/MessageService";
import * as response from "../msg/message";
import {authorizationServices} from "../services/AuthorizationService";
import {Request, Response} from "express";
import {IMessage} from "../models/Interface/IMessage";
import {errorUnknown} from "../utils/myVariables";
import {errJwtNotVerify} from "../msg/message";
import {upload} from "../utils/myFunction";
import fs from "fs";

export const saveMessage = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);

        if (verify) {
            upload(req, res, async (err) => {
                if (err) {
                    console.log(err);
                } else {
                    let fileName = "";
                    let file = null;

                    if (req.file) {
                        fileName = req.file.filename;
                        file = fs.readFileSync("uploads/" + req.file.filename);
                    }

                    // const item = JSON.parse(JSON.stringify(req.body));
                    const item = req.body as IMessage;
                    const itemService: any = await saveMessageServices(
                        item,
                        file,
                        fileName
                    );
                    return res.json(itemService);
                }
            });
        } else {
            return errJwtNotVerify(res);
        }
    } catch (e: unknown) {
        let err: string;
        if (e instanceof Error) {
            err = e.message;
        } else {
            err = errorUnknown;
        }
        return response.err(err, res);
    }
};

// find all messages of 1 conversation
export const findAllMessages = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);

        if (verify) {
            const item = req.body as IMessage;
            const itemService = await findAllMessagesServices(item);
            return res.json(itemService);
        } else {
            return errJwtNotVerify(res);
        }
    } catch (e: unknown) {
        let err: string;
        if (e instanceof Error) {
            err = e.message;
        } else {
            err = errorUnknown;
        }
        return response.err(err, res);
    }
};

export const markReadMessage = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);

        if (verify) {
            const item = req.body as IMessage;
            const itemService = await markReadMessageServices(item);
            return res.json(itemService);
        } else {
            return errJwtNotVerify(res);
        }
    } catch (e: unknown) {
        let err: string;
        if (e instanceof Error) {
            err = e.message;
        } else {
            err = errorUnknown;
        }
        return response.err(err, res);
    }
};

export const deleteMessage = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);

        if (verify) {
            const item = req.body as IMessage;
            const itemService = await deleteMessageServices(item);
            return res.json(itemService);
        } else {
            return errJwtNotVerify(res);
        }
    } catch (e: unknown) {
        let err: string;
        if (e instanceof Error) {
            err = e.message;
        } else {
            err = errorUnknown;
        }
        return response.err(err, res);
    }
};

export const downloadFile = async function (req: Request, res: Response) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);

        if (verify) {
            const item = req.body as IMessage;
            const path = `${__dirname}/../../uploads/${item.fileName}`;
            return res.download(path);
        }
    } catch (e: unknown) {
        let err: string;
        if (e instanceof Error) {
            err = e.message;
        } else {
            err = errorUnknown;
        }
        return response.err(err, res);
    }
};

export const deleteAllMessageInConversation = async function (
    req: Request,
    res: Response
) {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return errJwtNotVerify(res);
        }

        const verify = await authorizationServices(authorization);

        if (verify) {
            const item = req.body as IMessage;
            const itemService = await deleteAllMessageInConversationServices(item);
            return res.json(itemService);
        } else {
            return errJwtNotVerify(res);
        }
    } catch (e: unknown) {
        let err: string;
        if (e instanceof Error) {
            err = e.message;
        } else {
            err = errorUnknown;
        }
        return response.err(err, res);
    }
};
