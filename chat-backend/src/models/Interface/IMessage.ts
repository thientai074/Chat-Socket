export interface IMessage {
    _id: string;
    conversationId: string;
    text: string;
    receiver: string;
    sender: string;
    read: boolean;
    isImage: boolean;
    isFile: boolean;
    fileSize: string;
    file: any;
    fileName: string;
    skip: number;
    timeCreated: string;
    youtubeThumbnail: string;
}
