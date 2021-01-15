<template>
  <div>
    <div @click="LockScreen">
      <i class="el-icon-lock" />
    </div>
    <div v-if="dialogVisible" class="dialog">
      <div class="dialog-bg">
        <el-carousel height="100%" direction="vertical" :autoplay="false" :interval="6000" style="width:100%; height: 100%;">
          <el-carousel-item v-for="item in bgImages" :key="item" style="width:100%; height: 100%;">
            <div :style="{'width':'100%', 'height': '100%', 'background': 'url('+item+') no-repeat center'}" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="dialog-form">
        <el-form ref="form" label-width="80px" label-position="top">
          <el-form-item label="请输入登录密码进行解锁">
            <el-input v-model="loginpwd" show-password clearable placeholder="请输入登录密码进行解锁" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="UnlockingLoading" @click="Unlocking">立即解锁</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import UserServer from '@/api/baseinfo/userinfo'
export default {
  data() {
    return {
      UnlockingLoading: false,
      dialogVisible: false,
      loginpwd: null,
      bgImages: [
        require('@/assets/images/lockscreen/lockscreen_1.jpg'),
        require('@/assets/images/lockscreen/lockscreen_2.jpg'),
        require('@/assets/images/lockscreen/lockscreen_3.jpg')
      ]
    }
  },
  methods: {
    LockScreen() {
      this.loginpwd = null
      this.dialogVisible = true
    },
    // 解锁
    Unlocking() {
      if (this.loginpwd.length <= 0) {
        this.$message.error('请输入登录密码进行解锁!')
        return
      }
      this.UnlockingLoading = true
      UserServer.UnLockScreenCheckPwd({ pwd: this.loginpwd }).then(res => {
        if (res.Issuccess) {
          this.dialogVisible = false
        } else {
          this.$message.error(res.DataMsg)
        }
        this.UnlockingLoading = false
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.dialog {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    .dialog-bg{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    .dialog-form{
        padding: 30px;
        width: 30%;
        text-align: center;
        position: relative;
        margin: 0 auto 50px;
        background: #fff;
        box-sizing: border-box;
        box-shadow: 0 1px 3px rgba(0,0,0,.3);
        border-radius: 2px;
        top: 35%;
        box-shadow:2px 2px 3px 3px rgba(0,0,0,.5);
    }
}
</style>
