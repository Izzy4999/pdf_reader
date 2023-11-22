import { AppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { type } from "os";

type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput["getFileMessage"]["messages"];

type OmitText = Omit<Messages[number], "text">;

type ExtentedText = {
  text: string | JSX.Element;
};

export type ExtendedMessage = OmitText & ExtentedText;
