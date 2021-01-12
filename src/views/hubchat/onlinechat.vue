<template>
  <div class="components-container">
    <div class="page-head-bar">
      当前客服在线沟通
    </div>
    <split-pane :min-percent="15" :default-percent="20" :max-percent="30" split="vertical">
      <template slot="paneL">
        <div class="left-container">
          <el-card class="chatUser-container" :style="chatWidthHeight">
            <el-input
              v-model="userNameFilterText"
              size="mini"
              placeholder="输入用户昵称进行筛选"
            />
            <div class="chatUserList BeautifyScrollBar">
              <div v-for="(item, index) in userChatList" :key="index" class="chatUserItem" @click="switchUserChat(item)">
                <el-avatar :src="item.useravatar" />
                <div class="chatUserDetail">
                  <div class="chatUser_tit cursor_default">{{ item.username }}</div>
                  <div class="chatUser_desc cursor_default">{{ item.usertablabel }}</div>
                </div>
                <div class="chatUser_unread">
                  <span>{{ item.unreadcount > 99 ? '99+' : item.unreadcount }}</span>
                </div>
                <div class="chatUser_delete">
                  <i class="el-icon-error" @click="deleteUserChat(item.userid)" />
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </template>
      <template slot="paneR">
        <el-card class="userChatTalk-container" :style="chatWidthHeight">
          <div slot="header" class="clearfix">
            <span>{{ currentUserChat != null ? currentUserChat.username : '欢迎回来~~~' }}</span>
          </div>
          <div class="chatcontainer">
            <div v-for="o in 30" :key="o" class="text item">
              {{ '列表内容 ' + o }}
            </div>
          </div>
          <div class="chat-AssistTool">
            <el-tooltip effect="dark" class="Litem" content="表情" placement="top">
              <i class="el-icon-edit" />
            </el-tooltip>
            <el-tooltip effect="dark" class="Litem" content="图片" placement="top">
              <i class="el-icon-picture-outline-round" />
            </el-tooltip>
            <el-tooltip effect="dark" class="Litem" content="截图" placement="top">
              <i class="el-icon-scissors" />
            </el-tooltip>
            <el-tooltip effect="dark" class="Litem" content="留言" placement="top">
              <i class="el-icon-s-promotion" />
            </el-tooltip>
          </div>
          <div style="height:100%;">
            <el-input
              v-model="NeedSendMessage"
              type="textarea"
              placeholder="请输入内容"
              show-word-limit
              clearable
              rows="4"
              resize="none"
              class="chat-textarea"
            />
            <el-button class="chat-btnSend" :type="SendMessageBtnType" round @click="SendMessageFun">发送</el-button>
          </div>
        </el-card>
      </template>
    </split-pane>
  </div>
</template>

<script>
import userinfoService from '@/api/baseinfo/userinfo'
import splitPane from 'vue-splitpane'
export default {
  components: { 'split-pane': splitPane },
  data() {
    return {
      userNameFilterText: '',
      NeedSendMessage: '',
      SendMessageBtnType: '',
      userChatList: [{
        username: '张三',
        userid: '1',
        usertablabel: '12345646',
        useravatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        unreadcount: 10
      }, {
        username: '李四',
        userid: '2',
        usertablabel: '12345646',
        useravatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        unreadcount: 20
      }, {
        username: '王五',
        userid: '3',
        usertablabel: '12345646',
        useravatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        unreadcount: 100
      }],
      currentUserChat: null,
      currentUserChatTalkDetail: []
    }
  },
  computed: {
    // 动态设置高度
    chatWidthHeight: function() {
      const Height = (document.documentElement.clientHeight - 160) + 'px'
      return { height: Height }
    }
  },
  watch: {
    NeedSendMessage(val) {
      if (val !== '') {
        this.SendMessageBtnType = 'primary'
      } else {
        this.SendMessageBtnType = ''
      }
    }
  },
  created() {
    // this.signalr.on('GetOnlineUserInfo', function(res) {
    //   // 可以做相关业务逻辑
    //   console.log('signalr 来了')
    //   console.log(res)
    // })
    var CurrentUser = {
      'UserName': '222用户',
      'UserID': '123123132123',
      'UserRole': 'Sender'
    }
    this.signalr.start().then(res => {
      this.signalr.invoke('SendLogin', CurrentUser, function(res) {
        // 可以做相关业务逻辑
        console.log('获取在线人员信息2')
        console.log(res)
      })
    })
    this.ReceiveMessage()
    this.ReceiveOnlineUserInfo()
    // this.signalr.start()
  },
  // 在Vue的生命周期函数mounted中进行连接
  mounted() {
    // this.signalr.invoke('GetOnlineUserInfo', function(res){
    //   console.log(res)
    // })
  },
  methods: {
    ReceiveOnlineUserInfo() {
      this.signalr.on('ReceiveOnlineUserInfo', function(res) {
        // 可以做相关业务逻辑
        console.log('获取在线人员信息2')
        console.log(res)
      })
    },
    ReceiveMessage() {
      this.signalr.on('ReceiveMessage', function(res) {
        if (res.messageLevel === 'Broadcast') {
          alert(res.fromUserName + '说：' + res.message)
        } else {
          console.log(res)
        }
      })
    },
    SendMessageFun() { // 点击按钮发送消息
      if (this.NeedSendMessage) {
        var msg = {
          fromUserName: '李四',
          fromUserid: '1999',
          Message: this.NeedSendMessage,
          IsSendAll: true,
          MessageLevel: 'Broadcast'
        }
        this.signalr.invoke('SendMessage', msg).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$message({
          showClose: true,
          message: '请先输入消息，消息内容不能为空',
          type: 'warning'
        })
      }
    },
    switchUserChat(userchat) {
      this.currentUserChat = userchat
    },
    deleteUserChat: function(userid) {
      alert(userid)
    }
  }
}
</script>
<style lang="scss" scoped>
.components-container {
    margin-top: 10px;
    height: 100%;
}
/deep/ .chatUser-container .el-card__body{
  padding: 0px;

}
.chatUserList{
  overflow-y: scroll;
}
.chatUserItem{
  height: 55px;
  padding: 8px;
  border-bottom: 1px solid #F2F6FC;
}
.chatUserItem:hover {
  background-color: #EBEEF5;
}
.chatUserItem:hover .chatUser_delete{
  display: block;
}
.chatUserItem:hover .chatUser_unread{
  display: none;
}
.chatUser_unread{
    float: right;
    max-width: 30px;
    background-color: red;
    border-radius: 47px;
    max-height: 30px;
    margin-top: 12px;
    padding: 0px 2px;
    font-size: 14px;
    overflow: hidden;
}
.chatUserDetail{
  display: inline-block;
  line-height: 16px;
  user-select: none;
}
.chatUser_tit{
    font-size: 16px;
    line-height: 25px;
}
.chatUser_desc{
      font-size: 12px;
}
.chatUser_delete{
    line-height: 44px;
    float: right;
    display: none;
    cursor: pointer;
}
.userChatTalk-container {
  /deep/.el-card__header{
    padding: 10px 15px;
  }
  /deep/.el-card__body{
    height: 100%;
    padding: 0px;
  }
}
.chatcontainer{
  height: 60%;
  overflow-y: auto;
  background-color: #F0F2F5;
}
.chat-AssistTool{
  padding: 10px 15px;
  .Litem{
    margin-right: 10px;
    cursor: pointer;
  }
}
.chat-textarea {
  /deep/.el-textarea__inner{
    border: 0px;
 }
}
.chat-btnSend{
  margin-bottom: 20px;
  position: fixed;
  right: 20px;
  bottom: 10px;
}
</style>
