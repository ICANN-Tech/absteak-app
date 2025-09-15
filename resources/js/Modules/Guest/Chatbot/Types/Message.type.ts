export interface MessageType {
    id?: string;
    from: MessageFrom;
    message: string;
    timestamp?: Date;
    isFromCS?: boolean;
}

export enum MessageFrom {
    User = 'user',
    Bot = 'bot',
    CS = 'cs',
}