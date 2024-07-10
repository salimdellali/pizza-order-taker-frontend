export enum Sender {
  USER = "user",
  AI = "Pizza AI",
}

export enum Direction {
  INCOMING = "incoming",
  OUTGOING = "outgoing",
}

export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
}

export type ChatMessage = {
  message: string
  sender: Sender
  direction: Direction
}

export type ApiMessage = {
  role: Role
  content: string
}

export function convertChatMessagesToApiMessages(chatMessages: ChatMessage[]) {
  return chatMessages.map((chatMessage) => {
    const role = chatMessage.sender === Sender.AI ? Role.ASSISTANT : Role.USER
    return { role, content: chatMessage.message }
  })
}
