import {IMessage} from "../models/Interface/IMessage";
import {Message} from "../models/MessageModel";
import {
    errResponse,
    okResponse,
    dataNotFoundResponse,
    failureResponse,
} from "../msg/message";
import {errorUnknown} from "../utils/myVariables";
import moment from "moment";

export const saveMessageServices = async function (
    data: IMessage,
    file: any,
    fileName: string
) {
    try {
        let item = {};

        // Phân loại các loại mesage text, image, file

        // Phân loại mesage thường
        if (file === null) {
            item = {
                conversationId: data.conversationId,
                sender: data.sender,
                text: data.text,
                receiver: data.receiver,
                isImage: false,
                isFile: false,
                file: {
                    data: file,
                },
                fileName: fileName,
                fileSize: data.fileSize,
                dayCreated: moment().format("D MMM YYYY"),
                timeCreated: data.timeCreated,
                youtubeThumbnail: data.youtubeThumbnail,
            };
        } else {
            // Phân loại theo message gửi ảnh
            if (
                fileName.includes(".jpg") ||
                fileName.includes(".pdf") ||
                fileName.includes(".eps") ||
                fileName.includes(".ai") ||
                fileName.includes(".webp") ||
                fileName.includes(".indd") ||
                fileName.includes(".raw") ||
                fileName.includes(".jpeg") ||
                fileName.includes(".psd") ||
                fileName.includes(".png") ||
                fileName.includes(".gif") ||
                fileName.includes(".tiff") ||
                fileName.includes(".bmp") ||
                fileName.includes(".jfif")
            ) {
                item = {
                    conversationId: data.conversationId,
                    sender: data.sender,
                    text: "Image",
                    receiver: data.receiver,
                    isImage: true,
                    isFile: false,
                    file: {
                        data: file,
                    },
                    fileSize: data.fileSize,
                    fileName: fileName,
                    dayCreated: moment().format("D MMM YYYY"),
                    timeCreated: data.timeCreated,
                    youtubeThumbnail: data.youtubeThumbnail,
                };
            } else {
                // Phân loại message gửi theo file
                item = {
                    conversationId: data.conversationId,
                    sender: data.sender,
                    text: "File",
                    receiver: data.receiver,
                    isImage: false,
                    isFile: true,
                    fileSize: data.fileSize,
                    file: {
                        data: file,
                    },
                    fileName: fileName,
                    dayCreated: moment().format("D MMM YYYY"),
                    timeCreated: data.timeCreated,
                    youtubeThumbnail: data.youtubeThumbnail,
                };
            }
        }

        const itemCreate = new Message(item);
        await itemCreate.save();
        return okResponse(itemCreate);
    } catch (e: unknown) {
        let err: string;
        if (e instanceof Error) {
            err = e.message;
        } else {
            err = errorUnknown;
        }
        return errResponse(err);
    }
};

export const findAllMessagesServices = async function (data: IMessage) {
    try {
        const itemCount = await Message.find({
            conversationId: data.conversationId,
        }).count();

        // Logic scroll to up to load data
        const maxItemInPage = 8;
        let skipNumber = 0;
        let limitNumber = maxItemInPage;

        if (itemCount <= data.skip) {
            skipNumber = 0;
            limitNumber = maxItemInPage;
        } else if (data.skip === 0 && itemCount > maxItemInPage) {
            skipNumber = itemCount - maxItemInPage;
            limitNumber = maxItemInPage;
        } else if (
            data.skip === maxItemInPage &&
            itemCount < data.skip + maxItemInPage
        ) {
            skipNumber = 0;
            limitNumber = itemCount - maxItemInPage;
        } else if (
            data.skip === maxItemInPage &&
            itemCount >= data.skip + maxItemInPage
        ) {
            skipNumber = itemCount - data.skip - maxItemInPage;
            limitNumber = maxItemInPage;
        } else if (
            data.skip > maxItemInPage &&
            itemCount > maxItemInPage &&
            itemCount < data.skip + maxItemInPage
        ) {
            skipNumber = 0;
            limitNumber = itemCount - data.skip;
        } else if (
            data.skip > maxItemInPage &&
            itemCount > maxItemInPage &&
            itemCount >= data.skip + maxItemInPage
        ) {
            skipNumber = itemCount - data.skip - maxItemInPage;
            limitNumber = maxItemInPage;
        }

        const itemFind = await Message.aggregate([
            {
                $match: {
                    conversationId: data.conversationId,
                },
            },
            {
                $addFields: {
                    totalMessage: itemCount,
                },
            },
            {
                $project: {
                    _id: 1,
                    read: 1,
                    text: 1,
                    conversationId: 1,
                    sender: 1,
                    receiver: 1,
                    createdAt: 1,
                    fileName: 1,
                    file: 1,
                    isImage: 1,
                    isFile: 1,
                    dayCreated: 1,
                    totalMessage: 1,
                    timeCreated: 1,
                    fileSize: 1,
                    youtubeThumbnail: 1,
                    senderObjId: {$toObjectId: "$sender"},
                },
            },
            {
                $lookup: {
                    localField: "senderObjId",
                    from: "users",
                    foreignField: "_id",
                    as: "receiverDetails",
                },
            },
            {$skip: skipNumber},
            {$limit: limitNumber},
        ]);
        if (itemFind) {
            return okResponse(itemFind);
        } else {
            return dataNotFoundResponse();
        }
    } catch (e: unknown) {
        let err: string;
        if (e instanceof Error) {
            err = e.message;
        } else {
            err = errorUnknown;
        }
        return errResponse(err);
    }
};

export const markReadMessageServices = async function (data: IMessage) {
    try {
        const itemMarkRead = await Message.find({
            conversationId: data.conversationId,
        }).updateMany({read: true});

        return okResponse(itemMarkRead);
    } catch (e: unknown) {
        let err: string;
        if (e instanceof Error) {
            err = e.message;
        } else {
            err = errorUnknown;
        }
        return errResponse(err);
    }
};

export const deleteMessageServices = async function (data: IMessage) {
    try {
        const itemDelete = await Message.findOneAndDelete({
            conversationId: data.conversationId,
            sender: data.sender,
            receiver: data.receiver,
            timeCreated: data.timeCreated,
        });
        if (itemDelete) {
            return okResponse(itemDelete);
        } else {
            return failureResponse();
        }
    } catch (e: unknown) {
        let err: string;
        if (e instanceof Error) {
            err = e.message;
        } else {
            err = errorUnknown;
        }
        return errResponse(err);
    }
};

export const deleteAllMessageInConversationServices = async function (
    data: IMessage
) {
    try {
        const itemDelete = await Message.deleteMany({
            conversationId: data.conversationId,
        });

        if (itemDelete) {
            return okResponse(itemDelete);
        } else {
            return failureResponse();
        }
    } catch (e: unknown) {
        let err: string;
        if (e instanceof Error) {
            err = e.message;
        } else {
            err = errorUnknown;
        }
        return errResponse(err);
    }
};