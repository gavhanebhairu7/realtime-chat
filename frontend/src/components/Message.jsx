import React from "react";
import { formatDate } from "../utils/helperFunctions";

function Message(props) {
  return (
    // <div className={props.sent ? "chat chat-end" : "chat chat-start"}>
    //   <div
    //     className={
    //       props.sent
    //         ? "chat-bubble chat-bubble-success"
    //         : "chat-bubble chat-bubble-primary"
    //     }
    //   >
    //     {props.msg}
    //   </div>
    // </div>
    <div className={props.sent ? "chat chat-end" : "chat chat-start"}>
      <div className="chat-header">
        {props.sender.user_name + " "}
        <time className="text-xs opacity-50">{formatDate(props.time)}</time>
      </div>
      <div className="chat-bubble">{props.msg}</div>
    </div>
  );
}

export default Message;
