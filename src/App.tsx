import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
// import "./App.css"
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react"

function App() {
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message: `Hi there! Welcome to our pizza restaurant. What can I get started for you today?
          We have a variety of pizzas, sides, toppings, and drinks. Let me know what you'd like, and I'll help you with all the details.
        `,
      sender: "Pizza AI",
      direction: "incoming",
    },
  ])

  const handleSend = async (message: string) => {
    const newMessage = {
      message,
      sender: "user",
      direction: "outgoing",
    }

    const newMessages = [...messages, newMessage] // all the old messages + the new one

    // update our messages state
    setMessages(newMessages)

    // set typing indicator (chatgpt is typing)
    setTyping(true)

    // process messages to the backend (send it over and see the response)
  }

  return (
    <div
      style={{
        position: "relative",
        height: "95vh",
        width: "50vw",
        margin: "0 auto",
      }}
    >
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={
              typing ? <TypingIndicator content="Pizza AI is typing" /> : null
            }
          >
            {messages.map((message, index) => (
              <Message key={index} model={message} />
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            onSend={handleSend}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  )
}

export default App
