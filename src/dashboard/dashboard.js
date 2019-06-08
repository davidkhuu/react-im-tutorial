import React from 'react';
import ChatListComponent from '../chatlist/chatlist';
import { Button, withStyles } from '@material-ui/core';
import styles from './styles';
import ChatViewComponent from '../chatview/chatview';
const firebase = require('firebase');

class DashboardComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      chats: []
    };
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      if (!_usr) {
        this.props.history.push('/login');
      } else {
        await firebase
          .firestore()
          .collection('chats')
          .where('users', 'array-contains', _usr.email)
          .onSnapshot(async res => {
            const chats = res.docs.map(_doc => _doc.data());
            await this.setState({
              email: _usr.email,
              chats: chats
            });
            console.log(chats)
          });
      }
    });
  }

  selectChat = (chatIndex) => {
    this.setState({ selectedChat: chatIndex });
  }

  newChatBtnClicked = () => this.setState({ newChatFormVisible: true, selectedChat: null });

  signOut = () => firebase.auth().signOut();

  render() {
    const { classes} = this.props;
    return (
      <div>
        <ChatListComponent
          history={this.props.history}
          newChatBtnFn={this.newChatBtnClicked}
          selectChatFn={this.selectChat}
          chats={this.state.chats}
          userEmail={this.state.email}
          selectedChatIndex={this.state.selectedChat}
        />
        {
          this.state.newChatFormVisible ?
          null :
          <ChatViewComponent
            user={this.state.email}
            chat={this.state.chats[this.state.selectedChat]}
          />
        }
        <Button
          className={classes.signOutBtn}
          onClick={this.signOut}
        >
          Sign Out
        </Button>
      </div>
    );
  }

}

export default withStyles(styles)(DashboardComponent);