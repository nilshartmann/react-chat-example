import React from "react";
import { Avatar } from "../components";

export default function AddMessage({ onMsgSend, userId }) {
  const [msg, setMsg] = React.useState("");

  const onMsgChange = e => setMsg(e.target.value); // <== replaces setState({...})

  const onMsgKeyPress = e => {
    // https://stackoverflow.com/a/43845165/6134498
    const keyCode = e.which || e.keyCode;
    if (keyCode === 13) {
      onMsgSendClick();
    }
  };

  const onMsgSendClick = () => {
    if (msg.trim().length > 0) {
      onMsgSend(msg);
      setMsg(""); // <== replaces setState({msg: ""})
    }
  };

  const btnDisabled = msg.trim().length === 0;

  const avatar = <Avatar userId={userId} />;

  return (
    <div className="AddMessage">
      {avatar}

      <div className="Form">
        <label htmlFor="AddMessageInput">Add Message</label>
        <div className="InputWithButton">
          <input type="text" value={msg} onKeyPress={onMsgKeyPress} onChange={onMsgChange} />
          <button disabled={btnDisabled} onClick={onMsgSendClick}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
