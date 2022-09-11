export type Message = {
    _id: string;
    conversationId: string;
    read: boolean;
    receiver: string;
    sender: string;
    text: string;
    isImage: boolean;
    isFile: boolean;
    file: any;
    fileName: string;
    fileSize: string;
    dayCreated: string;
    createdAt: Date;
    skip: number;
    timeCreated: string;
    youtubeThumbnail: string
};