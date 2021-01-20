<template>
  <div>
    <el-dialog
      v-if="editparams.isvisible"
      title="新增/编辑菜单"
      :visible.sync="editparams.isvisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="entity"
        size="small"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="父级菜单">
              <el-cascader
                v-model="entity.MENUPARENTNO"
                :options="menuOptions"
                style="width:100%"
                :props="{ checkStrictly: true, value: 'MenuNo', label: 'MenuName', children: 'MenuChild' }"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单编码">
              <el-input v-model="entity.MENUNO" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称">
              <el-input v-model="entity.MENUNAME" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否可见">
              <el-select v-model="entity.ISVISIBLE" placeholder="请选择">
                <el-option label="是" value="Y" />
                <el-option label="否" value="N" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-select v-model="entity.ISENABLED" placeholder="请选择">
                <el-option label="启用" value="Y" />
                <el-option label="停用" value="N" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单图标" class="upload-mallicon-form" prop="MENUPIC">
              <i v-if="entity.MENUPIC" :class="`upload-mallicon iconfont ${entity.MENUPIC}`" @click="ChociceIcon" />
              <i v-else class="upload-mallicon el-icon-upload" @click="ChociceIcon" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="entity.MENUORDER" :min="1" label="排序" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="editparams.isvisible = false">取消</el-button>
      </div>
    </el-dialog>
    <ChoiceMenu-Icon v-if="iconparams.isvisible" ref="mallTypeIcon" :params="iconparams" @AcceptChociceIcon="AcceptChociceIcon" />
  </div>
</template>
<script>

import service from '@/api/system/menu'
import ChoiceMenuIcon from '@/layout/components/Common/ChoiceMenuIcon'
export default {
  name: 'MenueditForm',
  components: { 'ChoiceMenu-Icon': ChoiceMenuIcon },
  props: {
    editparams: { // 这个就是父组件中子标签自定义名字
      type: Object,
      required: true
    }
  },
  data() {
    return {
      RoleLevelOptions: [],
      menuOptions: [],
      entity: { },
      iconparams: { // 选择图标参数
        isvisible: false
      }
    }
  },
  created() {
    this.Init()
  },
  methods: {
    Init() {
      this.GetMenuList()
      this.GetMenuData()
    },
    GetMenuList() {
      service.GetMenuList({ }).then(res => {
        if (res.Issuccess) {
          this.menuOptions = res.Data
        } else {
          this.$message.error(res.DataMsg)
        }
      })
    },
    GetMenuData() {
      service.GetMenuDataByNo({ menuNo: this.editparams.key }).then(res => {
        if (res.Issuccess) {
          this.entity = res.Data
        } else {
          this.$message.error(res.DataMsg)
        }
      })
    },
    // 选择分类图标
    ChociceIcon() {
      this.iconparams.isvisible = false
      this.$nextTick(() => {
        this.iconparams = {
          isvisible: true,
          AcceptMethod: 'AcceptChociceIcon',
          ChoiceType: 'Radio', // 单选
          type: 'Choice'
        }
      })
    },
    AcceptChociceIcon(icon) {
      this.entity.MENUPIC = icon.val
    },
    save() {
      // 保存
      service.SaveMenuData({ MenuData: this.entity }).then(res => {
        if (res.Issuccess) {
          if (res.Data) {
            this.$message({
              message: '操作成功!',
              type: 'success'
            })
            this.editparams.isvisible = false
            this.$parent.InitData()
          } else {
            this.$message.error('保存失败，请重试!')
          }
        } else {
          this.$message.error(res.DataMsg)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-mallicon{
  padding: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}
</style>
