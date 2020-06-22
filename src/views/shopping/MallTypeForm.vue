// 商品分类新增、编辑表单
<template>
  <div>
    <el-dialog
      v-if="params.isvisible"
      title="新增/编辑商品分类"
      width="60%"
      custom-class="RoleAuthorizeForm-dialog"
      node-key="id"
      top="58px"
      :lock-scroll="true"
      :visible.sync="params.isvisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form
        ref="entity"
        :model="entity"
        size="small"
        :inline="false"
        :rules="rules"
        label-width="110px"
      >
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="父级分类">
              <el-select v-model="entity.PARENTYPEID" placeholder="父级分类">
                <el-option
                  v-for="item in MallTypeSelectData"
                  :key="item.Key"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类编码" prop="MALLTYPECODE">
              <el-input
                v-model="entity.MALLTYPECODE"
                placeholder="分类编码"
              >
                <i slot="suffix" class="cursor_pointer el-input__icon el-icon-orange" @click="AutoCode" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="分类名称" prop="MALLTYPENAME">
              <el-input v-model="entity.MALLTYPENAME" placeholder="分类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input v-model="entity.SEQNO" type="number" placeholder="排序" />
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="是否首页推荐">
              <el-select v-model="entity.ISHOMEPAGE" placeholder="是否首页推荐">
                <el-option label="是" value="Y" />
                <el-option label="否" value="N" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-select v-model="entity.ISENABLED" placeholder="是否启用">
                <el-option label="启用" value="Y" />
                <el-option label="停用" value="N" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <!-- <el-col :span="12">
            <el-form-item label="分类背景色" prop="MALLTYPEICON">
              <el-input v-model="entity.MALLTYPEICON" placeholder="分类图标" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="分类图标" class="upload-mallicon-form" prop="MALLTYPEICON">
              <!-- <el-input v-model="entity.MALLTYPEICON" placeholder="分类图标" /> -->
              <el-image
                v-if="entity.MALLTYPEICON"
                style="width: 25px; height: 25px"
                :src="entity.MALLTYPEICON"
                :preview-src-list="MallTypeIconHrefList"
              />
              <i class="el-icon-upload avatar-uploader-icon upload-mallicon" @click="ChociceTypeIcon" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="展示大图" prop="MALLTYPEIMAGE">
              <el-input v-model="entity.MALLTYPEIMAGE" placeholder="展示大图" />
            </el-form-item>
          </el-col> -->
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="entity.MALLTYPEDESC" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="SEO标题">
            <el-input v-model="entity.SEOTITLE" class="fullWidth" placeholder="SEO标题,一般不超过80个字符" />
          </el-form-item>
          <el-form-item label="SEO关键词">
            <el-input v-model="entity.SEOKEYWORD" class="fullWidth" placeholder="SEO关键词,一般不超过100个字符，多个关键字以半圆角逗号 [ , ] 隔开" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="SEO描述">
            <el-input v-model="entity.SEODESCRIBE" class="fullWidth" type="textarea" placeholder="SEO描述,一般不超过200个字符" />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="SaveDataLoading" @click="save('entity')">保存</el-button>
        <el-button @click="params.isvisible = false">取消</el-button>
      </div>
    </el-dialog>
    <ChoiceMallTypeIcon-Form v-if="iconparams.isvisible" ref="mallTypeIcon" :params="iconparams" @AcceptChociceTypeIcon="AcceptChociceTypeIcon" />
  </div>
</template>
<script>
import service from '@/api/shopping/shoppingmall'
import ChoiceMallTypeDefaultIcon from '@/layout/components/Common/ChoiceMallTypeDefaultIcon'
export default {
  name: 'MallTypeForm',
  components: { 'ChoiceMallTypeIcon-Form': ChoiceMallTypeDefaultIcon },
  props: {
    params: { // 这个就是父组件中子标签自定义名字
      type: Object,
      required: true
    }
  },
  data() {
    return {
      MallTypeSelectData: [], // 商城分类
      SaveDataLoading: false,
      entity: {
        MALLTYPEID: 0,
        MALLTYPECODE: null,
        MALLTYPENAME: null,
        PARENTYPEID: null,
        MALLTYPEICON: null,
        MALLTYPEIMAGE: null,
        SEQNO: null,
        ISENABLED: null,
        ISHOMEPAGE: null,
        MALLTYPEDESC: null,
        SEOTITLE: null,
        SEOKEYWORD: null,
        SEODESCRIBE: null,
        REMARK: null
      },
      rules: {
        MALLTYPECODE: [
          { required: true, message: '请输入分类编码', trigger: 'change' }
        ],
        MALLTYPENAME: [
          { required: true, message: '请输入分类名称', trigger: 'change' }
        ]
      },
      iconparams: { // 选择图标参数
        isvisible: false
      },
      MallTypeIconHrefList: []
    }
  },
  created() {
    this.Init()
    if (this.params.type === 'Edit') {
      this.GetMallTypeBytId(this.params.keyid)
    }
  },
  methods: {
    Init() {
      this.GetMallTypeTree()
    },
    // 初始化父级下拉框的值
    GetMallTypeTree(typeid) {
      // 获取菜单
      service.GetMallTypeSelectTree({ malltypeid: typeid }).then(response => {
        if (response.Issuccess) {
          this.MallTypeSelectData = response.Data
        }
      })
    },
    // 初始化当前编辑对象
    GetMallTypeBytId(id) {
      service.GetMallTypeBytId({ malltypeid: id }).then(response => {
        if (response.Issuccess) {
          this.entity = response.Data
          this.entity.PARENTYPEID = this.entity.PARENTYPEID === null ? '0' : this.entity.PARENTYPEID
        }
      })
    },
    save() {
      // 保存
      service.SaveMallType({ entity: this.entity }).then(response => {
        if (response.Issuccess) {
          this.$message({
            message: '操作成功!',
            type: 'success'
          })
          this.params.isvisible = false
          this.$parent.RefreshList()
        } else {
          this.$message.error(response.DataMsg)
        }
      })
    },
    AutoCode() {
      alert('自动生成,暂未实现')
    },
    // 选择分类图标
    ChociceTypeIcon() {
      this.iconparams.isvisible = false
      this.$nextTick(() => {
        this.iconparams = {
          isvisible: true,
          AcceptMethod: 'AcceptChociceTypeIcon',
          ChoiceType: 'Radio', // 单选
          type: 'Choice'
        }
      })
    },
    AcceptChociceTypeIcon(iconHref) {
      this.MallTypeIconHrefList = []
      this.MallTypeIconHrefList.push(iconHref[0])
      this.entity.MALLTYPEICON = iconHref[0]
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__body{
    height: 480px;
    overflow: auto;
}
.el-input{
    width: 200px;
}
.fullWidth{
    width: 100%;
}
.upload-mallicon{
  padding: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}
</style>
