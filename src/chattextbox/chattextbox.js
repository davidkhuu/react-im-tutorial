import React from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';

const KEY_CODE_ENTER = 13;

class ChatTextBoxComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      chatText: '',
    };
  }

  userTyping = (e) => e.keyCode === KEY_CODE_ENTER ?
    this.submitMessage() :
    this.setState({ chatText: e.target.value });

  messageValid = (txt) => txt && txt.replace(/\s/g, '').length;

  userClickedInput = () => this.props.messageReadFn();

  submitMessage = () => {
    if (this.messageValid(this.state.chatText)) {
      this.props.submitMessageFn(this.state.chatText);
      document.getElementById('chattextbox').value = '';
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.chatTextBoxContainer}>
        <TextField
          placeholder="Type your message..."
          onKeyUp={(e) => this.userTyping(e)}
          id="chattextbox"
          className={classes.chatTextBox}
          onFocus={this.userClickedInput}
        />
        <Send onClick={this.submitMessage} className={classes.sendBtn} />
      </div>
    );
  }

}

export default withStyles(styles)(ChatTextBoxComponent);