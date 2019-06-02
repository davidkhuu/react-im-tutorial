import React from 'react';
import ChatListComponent from '../chatlist/chatlist';
import styles from './styles';
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
    console.log('selected chat', chatIndex)
  }

  newChatBtnClicked = () => this.setState({ newChatFormVisible: true, selectedChat: null });

  render() {
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
      </div>
    );
  }

}

export default DashboardComponent;