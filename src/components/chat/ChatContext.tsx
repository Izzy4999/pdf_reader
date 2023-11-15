import { createContext, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StereoPannerNode>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContextprovider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState<string>("");

  const { toast } = useToast();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({message}: {message:string}) => {
      const resposnse = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });
      if (!resposnse) {
        throw new Error("Failed to send message");
      }

      return resposnse.body;
    },
  });

  const addMessage = () => sendMessage({message})

  const handleInputChange = () =>{

  }

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        idLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
