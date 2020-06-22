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
            <span>{{ currentUserChat != null ? currentUserChat.username : '' }}</span>
          </div>
          <div v-for="o in 10" :key="o" class="text item">
            {{ '列表内容 ' + o }}
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
    // 滚动区高度
    // (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
    chatWidthHeight: function() {
      const Height = (document.documentElement.clientHeight - 160) + 'px'
      return { height: Height }
    }
  },
  created() {
    const conn = $.hubConnection('https://localhost:44359/api/chatHub', { qs: 'clientId=1232222' })
    var demoChatHubProxy = conn.createHubProxy('ChatHub')
    demoChatHubProxy.on('ReceiveMessage', function(message) {
      console.log(message)
    })
    conn.start()
      .done(function() { console.log('Now connected, connection ID=' + conn.id) })
      .fail(function() { console.log('Could not connect') })
  },
  // 在Vue的生命周期函数mounted中进行连接
  mounted() {

  },
  methods: {
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
.userChatTalk-container .el-card__header{
    padding: 10px 15px;
}
</style>
