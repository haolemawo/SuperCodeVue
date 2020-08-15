// 商品优惠券新增、编辑
<template>
  <div>
    <el-dialog
      v-if="params.isvisible"
      title="新增/编辑"
      width="60%"
      custom-class="BrandForm-dialog"
      top="58px"
      :lock-scroll="true"
      :visible.sync="params.isvisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form
        ref="entityForm"
        v-loading="FormDataLoading"
        :model="entity"
        :rules="rules"
        :disabled="params.type === 'View'"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="优惠券名称" prop="COUPONNAME">
              <el-input v-model="entity.COUPONNAME" clearable class="fullWidth" placeholder="请输入优惠券名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="GRANTNUM">
              <template slot="label">
                优惠券数量
                <el-tooltip effect="dark" placement="top">
                  <div slot="content">优惠券数量<br> 设为0即为无限制</div>
                  <i class="el-icon-info" />
                </el-tooltip>
              </template>
              <el-input-number v-model="entity.GRANTNUM" class="fullWidth" controls-position="right" placeholder="请输入优惠券数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="BRANDWEBSITE">
              <template slot="label">
                金额限制
                <el-tooltip effect="dark" placement="top">
                  <div slot="content">订单需满足的最低消费金额才能使用 <br> 设为0即为无限制</div>
                  <i class="el-icon-info" />
                </el-tooltip>
              </template>
              <el-input-number v-model="entity.AMOUNTLIMITUSE" class="fullWidth" controls-position="right" placeholder="请输入适用金额限制" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <template slot="label">
                限领数
                <el-tooltip effect="dark" placement="top">
                  <div slot="content">每人限领数量<br> 设为0即为无限制</div>
                  <i class="el-icon-info" />
                </el-tooltip>
              </template>
              <el-input-number v-model="entity.PERLIMITNUM" class="fullWidth" controls-position="right" placeholder="请输入适用金额限制" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item prop="PREFERENTIALTYPE" required>
              <template slot="label">
                优惠形式
                <el-tooltip effect="dark" placement="top">
                  <div slot="content">优惠券可抵扣金额或按商品价格折扣</div>
                  <i class="el-icon-info" />
                </el-tooltip>
              </template>
              <el-radio-group v-model="entity.PREFERENTIALTYPE">
                <el-radio
                  v-for="(item, i) in PreferentialTypeGroup"
                  :key="i"
                  :label="item.Key"
                >{{ item.Name }}</el-radio>
              </el-radio-group>
              <el-input v-if="entity.PREFERENTIALTYPE=='Amount'" v-model="entity.PREFERENTIALVAL" clearable placeholder="请输入优惠金额" type="number" class="mLeft30" />
              <el-input v-if="entity.PREFERENTIALTYPE=='Discount'" v-model="entity.PREFERENTIALVAL" clearable placeholder="优惠折扣比例1-100, 100不打折" type="number" class="mLeft30" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="发放形式" prop="GRANTTYPE">
              <el-select v-model="entity.GRANTTYPE" class="fullWidth" clearable placeholder="请选择">
                <el-option
                  v-for="item in GrantTypeOptions"
                  :key="item.Key"
                  :label="item.Name"
                  :value="item.Key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否上架" required>
              <el-select v-model="entity.ISUPPERSHELF" class="fullWidth" clearable placeholder="请选择">
                <el-option label="上架" value="Y" />
                <el-option label="下架" value="N" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="相关商品" prop="COUPONTYPE" required>
              <el-select
                v-model="entity.COUPONTYPE"
                style="width:120px"
                clearable
                placeholder="请选择"
                @change="ChangeCouponType"
              >
                <el-option
                  v-for="item in CouponTypeOptions"
                  :key="item.Key"
                  :label="item.Name"
                  :value="item.Key"
                />
              </el-select>
              <el-cascader
                v-if="entity.COUPONTYPE === 'AppointSort'"
                v-model="entity.REFRECORDID"
                placeholder="请输入分类关键词检索"
                :options="SortListOptions"
                :props="{ checkStrictly: true, emitPath: false, value: 'key', label: 'label', leaf: 'isLeaf' }"
                clearable
                style="width:50%"
              />
              <el-select
                v-if="entity.COUPONTYPE === 'AppointGoods'"
                v-model="entity.REFRECORDID"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入商品关键词检索"
                :remote-method="remoteMallMethod"
                :loading="remoteLoading"
              >
                <el-option
                  v-for="item in MallListOptions"
                  :key="item.MALLID"
                  :label="item.MALLNAME"
                  :value="item.MALLID"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="有效期" prop="EFFECTIVETYPE" required>
              <el-select v-model="entity.EFFECTIVETYPE" style="width:120px" clearable placeholder="请选择">
                <el-option
                  v-for="item in EffectiveTimeTypeOptions"
                  :key="item.Key"
                  :label="item.Name"
                  :value="item.Key"
                />
              </el-select>
              <el-date-picker
                v-if="entity.EFFECTIVETYPE == 'FixedDate'"
                v-model="EFFECTIVETIME"
                class="mLeft30"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="chageEffectiveTime"
              />
              <el-input v-if="entity.EFFECTIVETYPE=='FixedDays'" v-model="entity.EFFECTIVEDAYS" placeholder="请输入有效天数" type="number" class="mLeft30" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="entity.REMARK" class="fullWidth" type="text" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="params.type !== 'View'" type="primary" :loading="SaveDataLoading" @click="save('entity')">保存</el-button>
        <el-button @click="params.isvisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UploadService from '@/api/common/common.js'
import { getToken } from '@/utils/auth'
import shoppingService from '@/api/shopping/shoppingmall'
import * as CouponService from '@/api/shopping/CouponServer'
import modalMixin from './modalMixin'
import { getFilterStr } from '@/layout/components/Controls/SearchConditionToolFun'
export default {
  name: 'CouponForm',
  mixins: [modalMixin],
  data() {
    return {
      UpLoadHeaders: { Authorization: 'Bearer ' + getToken() },
      UpLoadData: { fileFolder: 'MallPhoto' },
      FormDataLoading: false,
      SaveDataLoading: false,
      remoteLoading: false,
      EFFECTIVETIME: null,
      SortListOptions: [],
      MallListOptions: [],
      PreferentialTypeGroup: [{
        Key: 'Amount',
        Name: '指定金额'
      }, {
        Key: 'Discount',
        Name: '折扣'
      }],
      GrantTypeOptions: [{
        Key: 'Denomination',
        Name: '通用领取'
      }, {
        Key: 'Registration',
        Name: '注册获取'
      }, {
        Key: 'Invitation',
        Name: '邀请发放'
      }, {
        Key: 'OfflineProvide',
        Name: '线下发放'
      }],
      EffectiveTimeTypeOptions: [{
        Key: 'FixedDate',
        Name: '固定日期'
      }, {
        Key: 'FixedDays',
        Name: '固定天数'
      }],
      CouponTypeOptions: [{
        Key: 'GeneralCoupon',
        Name: '通用券'
      }, {
        Key: 'AppointGoods',
        Name: '指定商品'
      }, {
        Key: 'AppointSort',
        Name: '指定分类'
      }]
    }
  },
  created() {
    if (this.params.type === 'Edit' || this.params.type === 'View') {
      this.InitData()
    }
  },
  methods: {
    chageEffectiveTime(val) {
      if (val) {
        this.entity.EFFECTIVESTARTTIME = val[0]
        this.entity.EFFECTIVEENDTIME = val[1]
      } else {
        this.entity.EFFECTIVESTARTTIME = ''
        this.entity.EFFECTIVEENDTIME = ''
      }
    },
    InitData() {
      this.FormDataLoading = true
      CouponService.GetCoupon({ id: this.params.keyid }).then(response => {
        if (response.Issuccess) {
          if (response.Data.COUPONTYPE === 'AppointGoods') {
            this.ChangeCouponType('AppointGoods')
          } else if (response.Data.COUPONTYPE === 'AppointSort') {
            this.ChangeCouponType('AppointSort')
          }
          this.entity = response.Data
        }
        this.FormDataLoading = false
      })
    },
    GetUploadServer() {
      return UploadService.HttpUploadFile
    },
    handleLogoSuccess(response, file, fileList) {
      if (response.Issuccess) {
        this.entity.BRANDLOGO = response.Data[0].Url
      }
    },
    beforeLogoUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
      const form = new FormData()
      form.append('file', file)
      form.append('fileFolder', 'MallPhoto')
      this.UpLoadData.fileUid = file.uid
      return isLt2M
    },
    save() {
      // 保存
      this.$refs.entityForm.validate((valid) => {
        if (valid) {
          CouponService.SaveCoupon({ entity: this.entity }).then(response => {
            if (response.Issuccess) {
              this.$message({
                message: '操作成功!',
                type: 'success'
              })
              this.params.isvisible = false
              this.$emit('RefreshList')
            } else {
              this.$message.error(response.DataMsg)
            }
          })
        }
      })
    },
    ChangeCouponType(val) {
      this.entity.REFRECORDID = ''
      if (val === 'AppointSort') {
        this.remoteSortMethod()
      } else if (val === 'AppointGoods') {
        this.remoteMallMethod('')
      }
    },
    remoteSortMethod() {
      shoppingService.GetMallTypeTreeList({}).then(res => {
        if (res.Issuccess) {
          this.SortListOptions = res.Data[0].children
        }
      })
    },
    remoteMallMethod(KeyWord) {
      const param = {
        currenrpage: 1,
        pagesize: 15,
        filters: KeyWord !== '' ? getFilterStr(" and MALLNAME LIKE '%" + KeyWord + "%'") : ''
      }
      this.remoteLoading = true
      shoppingService.GetMallInfoList(param).then(res => {
        if (res.Issuccess) {
          this.MallListOptions = res.Data.data
        }
        this.remoteLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-input-group__prepend{
    padding: 0px 10px;
}

.el-input{
    width: 250px;
}
.fullWidth{
    width: 100%;
}
</style>
