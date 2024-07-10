import { useState } from "react"
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react"
import {
  Direction,
  Sender,
  ChatMessage,
  convertChatMessagesToApiMessages,
} from "./App.util"

function App() {
  const typingIndicatorContent = Sender.AI + " is typing..."
  const [typing, setTyping] = useState<boolean>(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      message: `Hi there! Welcome to our pizza restaurant. What can I get started for you today?\nWe have a variety of pizzas, sides, toppings, and drinks. Let me know what you'd like, and I'll help you with all the details.`,
      sender: Sender.AI,
      direction: Direction.INCOMING,
    },
  ])

  const handleSendMessage = async (messageContent: string): Promise<void> => {
    const newUserChatMessage: ChatMessage = {
      message: messageContent,
      sender: Sender.USER,
      direction: Direction.OUTGOING,
    }

    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      newUserChatMessage,
    ])
    setTyping(true)
    await processChatMessagesToBackend([...chatMessages, newUserChatMessage])
  }

  const processChatMessagesToBackend = async (
    chatMessages: ChatMessage[],
  ): Promise<void> => {
    const apiMessages = convertChatMessagesToApiMessages(chatMessages)

    try {
      const response = await fetch("http://localhost:3000/api/v1/pizza/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      })

      if (!response.ok) {
        console.error("Received response, but is either 4xx or 5xx")
        handleSendMessageUnsuccessfulResponse()
        return
      }
      const { content } = await response.json()

      const newAssistantChatMessage: ChatMessage = {
        message: content,
        sender: Sender.AI,
        direction: Direction.INCOMING,
      }

      setChatMessages((prevChatMessages) => [
        ...prevChatMessages,
        newAssistantChatMessage,
      ])
    } catch (error) {
      console.error(error)
      handleSendMessageUnsuccessfulResponse()
    } finally {
      setTyping(false)
    }
  }

  const handleSendMessageUnsuccessfulResponse = (): void => {
    const newAssistantErrorChatMessage: ChatMessage = {
      message: "Something went wrong with my intelligence. Please try again.",
      sender: Sender.AI,
      direction: Direction.INCOMING,
    }
    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      newAssistantErrorChatMessage,
    ])
  }

  return (
    <div
      style={{
        position: "relative",
        height: "98vh",
        width: "95vw",
        margin: "0 auto",
      }}
    >
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={
              typing ? (
                <TypingIndicator content={typingIndicatorContent} />
              ) : null
            }
          >
            {chatMessages.map((chatMessage, index) => (
              <Message key={index} model={chatMessage} />
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            onSend={handleSendMessage}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  )
}

export default App
