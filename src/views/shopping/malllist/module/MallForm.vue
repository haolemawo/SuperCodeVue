// 添加商品表单
<template>
  <div>
    <el-dialog
      v-if="params.isvisible"
      title="新增/编辑商品分类"
      width="75%"
      custom-class="Form-dialog"
      top="30px"
      :lock-scroll="true"
      :visible.sync="params.isvisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-tabs v-loading="EditInitLoading" tab-position="left" style="height: 500px;over">
        <el-tab-pane label="基础信息">
          <el-form
            ref="entity"
            :model="MallBaseDetail"
            :inline="false"
            :rules="rules"
            :disabled="IsView"
            label-width="120px"
          >
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="商品编码" prop="MALLCODE">
                  <el-input
                    v-model="MallBaseDetail.MALLCODE"
                    class="inputFullWidth"
                    placeholder="商品编码"
                  >
                    <i v-if="!IsView" slot="suffix" class="cursor_pointer el-input__icon el-icon-orange" @click="AutoCode" />
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品名称" prop="MALLNAME">
                  <el-input v-model="MallBaseDetail.MALLNAME" class="inputFullWidth" placeholder="商品名称" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="商品分类" prop="MALLTYPEID">
                  <el-select v-model="MallBaseDetail.MALLTYPEID" class="inputFullWidth" placeholder="商品分类">
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
                <el-form-item label="商品型号">
                  <el-input v-model="MallBaseDetail.MALLMARQUE" class="inputFullWidth" placeholder="商品型号" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="品牌分类" prop="MALLTYPEID">
                  <el-select
                    v-model="MallBaseDetail.BRANDTYPEID"
                    clearable
                    remote
                    reserve-keyword
                    placeholder="请选择品牌分类"
                    :remote-method="remoteBrandType"
                    :loading="SelectLoading"
                    class="inputFullWidth"
                    @change="changeBrandType"
                  >
                    <el-option
                      v-for="item in BrandTypeSelectData"
                      :key="item.BRANDTYPEID"
                      :label="item.BRANDTYPENAME"
                      :value="item.BRANDTYPEID"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品品牌">
                  <el-select
                    v-model="MallBaseDetail.BRANDID"
                    clearable
                    remote
                    reserve-keyword
                    placeholder="请选择商品品牌"
                    :remote-method="remoteBrand"
                    :loading="SelectLoading"
                    class="inputFullWidth"
                  >
                    <el-option
                      v-for="item in BrandSelectData"
                      :key="item.BRANDID"
                      :label="item.BRANDNAME"
                      :value="item.BRANDID"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <!-- <el-col :span="12">
                <el-form-item label="生成地址">
                  <el-input v-model="entity.SEQNO" placeholder="生成地址" />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="12">
                <el-form-item label="库存数量" prop="QUANTITY">
                  <el-input v-model="MallBaseDetail.QUANTITY" type="number" placeholder="库存数量" />
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <el-form-item label="库存单位" prop="STOCKUNIT">
                  <el-select v-if="MallBaseDetail.STOCKUNIT" v-model="MallBaseDetail.STOCKUNIT" class="inputFullWidth" placeholder="库存单位">
                    <el-option
                      v-for="item in MallUnit"
                      :key="item.Key"
                      :label="item.Value"
                      :value="item.Key"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="浏览量">
                  <el-input v-model="MallBaseDetail.BROWSEVOLUME" class="inputFullWidth" type="number" placeholder="浏览量" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="是否上架" prop="ISUPPERSHELF">
                  <el-select v-model="MallBaseDetail.ISUPPERSHELF" class="inputFullWidth" placeholder="是否上架">
                    <el-option label="是" value="Y" />
                    <el-option label="否" value="N" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否首页推荐" prop="ISHOMEPAGE">
                  <el-select v-model="MallBaseDetail.ISHOMEPAGE" class="inputFullWidth" placeholder="是否首页推荐">
                    <el-option label="是" value="Y" />
                    <el-option label="否" value="N" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="最低起购">
                  <el-input v-model="MallBaseDetail.MINIMUMPURCHASE" class="inputFullWidth" type="number" placeholder="最低起购，默认为1" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单次最大购买量">
                  <el-input v-model="MallBaseDetail.MAXIMUMSINGLEPURCHASE" class="inputFullWidth" type="number" placeholder="单次最大购买量" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="购买赠送积分">
                  <el-input v-model="MallBaseDetail.PRESENTATIONPOINTS" class="inputFullWidth" type="number" placeholder="购买赠送积分" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-form-item label="商品简述">
                <el-input v-model="MallBaseDetail.MALLDESC" type="textarea" placeholder="商品简单描述" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="MallBaseDetail.REMARK" type="textarea" placeholder="商品备注信息" />
              </el-form-item>
            </el-col>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品规格">
          <el-form
            ref="MallSpecificAtioinTypeList"
            size="mini"
            label-width="100px"
            class="demo-dynamic"
            :disabled="IsView"
          >
            <el-form-item
              prop="MallSpecificAtioinSelect"
              label="规格类型"
              :rules="[
                { required: true, message: '请选择规格类型', trigger: 'blur' }
              ]"
            >
              <el-select v-model="MallSpecificAtioinSelect" label-width="250px" multiple placeholder="请选择规格类型" @change="ChangeMallSpecificAtioinSelect" @remove-tag="RemoveMallSpecificAtioinSelect">
                <el-option
                  v-for="item in MallSpecificAtioinTypeInitData"
                  :key="item.Key"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
            </el-form-item>
          </el-form>

          <el-table
            class="MallSpecificDt"
            :data="MallSpecificAtioinData"
            row-key="rowkey"
            size="mini"
            border
            style="width: 100%"
          >
            <el-table-column
              v-for="item in MallSpecificDynamicHeader"
              :key="item.Key"
              align="center"
              width="100px"
            >
              <template slot="header" slot-scope="scope">
                <label>
                  {{ item.Value }}
                  <el-tooltip content="点击可批量设置" placement="top">
                    <i class="el-icon-edit-outline cursor_pointer" @click="batchSetTypeValue(scope, item.Key, item.Value)" />
                  </el-tooltip>
                </label>
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="MallSpecificAtioinData[scope.$index][item.Key]"
                  size="mini"
                  :placeholder="item.Value"
                />
                <!-- <el-select v-model="MallSpecificAtioinData[scope.$index][item.Key]" size="mini" filterable placeholder="请选择">
                  <el-option
                    v-for="item1 in MallSpecificAtioinTypeInitData"
                    :key="item1.Key"
                    :value="item1.Value"
                    :label="item1.Value"
                  />
                </el-select> -->
              </template>
            </el-table-column>
            <el-table-column align="center" width="100px">
              <template slot="header" slot-scope="scope">
                <label>
                  原价
                  <el-tooltip content="点击可批量设置" placement="top">
                    <i class="el-icon-edit-outline cursor_pointer" @click="batchSetTypeValue(scope, 'OriginalPrice', '原价')" />
                  </el-tooltip>
                </label>
              </template>
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.OriginalPrice"
                  placeholder="原价"
                  size="mini"
                  controls-position="right"
                  :min="0"
                  :precision="2"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="100px"
            >
              <template slot="header" slot-scope="scope">
                <label>
                  优惠价
                  <el-tooltip content="点击可批量设置" placement="top">
                    <i class="el-icon-edit-outline cursor_pointer" @click="batchSetTypeValue(scope, 'SpecialPrice', '优惠价')" />
                  </el-tooltip>
                </label>
              </template>
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.SpecialPrice"
                  placeholder="优惠价"
                  size="mini"
                  controls-position="right"
                  :min="0"
                  :precision="2"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" width="100px">
              <template slot="header" slot-scope="scope">
                <label>
                  库存数量
                  <el-tooltip content="点击可批量设置" placement="top">
                    <i class="el-icon-edit-outline cursor_pointer" @click="batchSetTypeValue(scope, 'QuantityNum', '库存数量')" />
                  </el-tooltip>
                </label>
              </template>
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.QuantityNum"
                  placeholder="库存数量"
                  size="mini"
                  controls-position="right"
                  :min="0"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" width="100px">
              <template slot="header" slot-scope="scope">
                <label>
                  重量(kg)
                  <el-tooltip content="点击可批量设置" placement="top">
                    <i class="el-icon-edit-outline cursor_pointer" @click="batchSetTypeValue(scope, 'Weight', '重量')" />
                  </el-tooltip>
                </label>
              </template>
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.Weight"
                  placeholder="重量(kg)"
                  size="mini"
                  controls-position="right"
                  :min="0"
                />
              </template>
            </el-table-column>
            <el-table-column v-if="!IsView" align="center" width="90px">
              <template slot-scope="scope">
                <el-tooltip v-if="scope.$index>0" content="复制" placement="top">
                  <el-button icon="el-icon-document-copy" circle size="mini" @click="handleMallSpecificAtioin(scope.$index, scope.row, 'copy')" />
                </el-tooltip>
                <el-tooltip v-if="scope.$index>0" content="删除" placement="top">
                  <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="handleMallSpecificAtioin(scope.$index, scope.row, 'delete')" />
                </el-tooltip>
              </template>
            </el-table-column>
            <div v-if="!IsView" slot="append" style="text-align: center;padding: 5px 0px;">
              <el-button
                size="mini"
                @click="AddMallSpecificAtioin()"
              >增加行数据</el-button>
            </div>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="商品相册">
          <el-upload
            :show-file-list="true"
            :action="GetUploadServer()"
            :headers="UpLoadHeaders"
            :data="UpLoadData"
            list-type="picture-card"
            :file-list="MallPhotoFileList"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :on-success="uploadAppSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品详情">
          <el-form
            ref="MallDetail"
            :model="MallBaseDetail"
            size="small"
            :inline="false"
            :rules="rules"
            label-width="110px"
            label-position="top"
          >
            <el-col :span="24">
              <el-form-item label="商品详情">
                <Tinymce ref="editor" v-model="MallBaseDetail.MALLDETAIL" :height="400" />
              </el-form-item>
            </el-col>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="SEO配置">
          <el-form
            ref="MallSeoDetail"
            :model="MallBaseDetail"
            :disabled="IsView"
            size="small"
            :inline="false"
            :rules="rules"
            label-width="110px"
          >
            <el-col :span="24">
              <el-form-item label="SEO标题">
                <el-input v-model="MallBaseDetail.SEOTITLE" class="inputFullWidth" placeholder="SEO标题,一般不超过80个字符" />
              </el-form-item>
              <el-form-item label="SEO关键词">
                <el-input v-model="MallBaseDetail.SEOKEYWORD" class="inputFullWidth" placeholder="SEO关键词,一般不超过100个字符，多个关键字以半圆角逗号 [ , ] 隔开" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="SEO描述">
                <el-input v-model="MallBaseDetail.SEODESCRIBE" class="inputFullWidth" type="textarea" placeholder="SEO描述,一般不超过200个字符" />
              </el-form-item>
            </el-col>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!IsView" type="primary" :loading="SaveDataLoading" @click="save('entity')">保存</el-button>
        <el-button @click="params.isvisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import service from '@/api/shopping/shoppingmall'
import brandServer from '@/api/shopping/BrandServer'
import UploadService from '@/api/common/common.js'
import { getToken } from '@/utils/auth'
import { getFilterStr } from '@/layout/components/Controls/SearchConditionToolFun'

export default {
  name: 'MallForm',
  components: { Tinymce },
  props: {
    params: { // 这个就是父组件中子标签自定义名字
      type: Object,
      required: true
    }
  },
  data() {
    return {
      EditInitLoading: false,
      IsView: false, // 是否查看
      MallTypeSelectData: [], // 商城分类
      MallUnit: [], // 商品单位
      MallSpecificAtioinTypeInitData: [], // 商品规格下拉框
      UpLoadHeaders: { Authorization: 'Bearer ' + getToken() },
      UpLoadData: { fileFolder: 'MallPhoto' },
      SaveDataLoading: false,
      MallBaseDetail: {
        MALLID: 0,
        MALLNAME: null,
        MALLCODE: null,
        BRANDID: null,
        BRANDTYPEID: null,
        MALLTYPEID: null,
        MALLMARQUE: null,
        QUANTITY: null,
        STOCKUNIT: null,
        ISUPPERSHELF: 'N',
        ISHOMEPAGE: 'N',
        MINIMUMPURCHASE: 1,
        MAXIMUMSINGLEPURCHASE: null,
        FLOORPRICE: null,
        CEILINGPRICE: null,
        PRESENTATIONPOINTS: null,
        BROWSEVOLUME: null,
        MALLDETAIL: null,
        MALLSPECIFICATIONTYPE: null,
        MALLSPECIFICATION: null,
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
      // 已选择的商品规格信息
      MallSpecificAtioinSelect: [],
      // 商品规格信息list
      MallSpecificAtioinData: [{
        rowkey: Date.now(),
        OriginalPrice: null,
        SpecialPrice: null,
        QuantityNum: null,
        Weight: null
      }],
      // 相册
      MallPhotoAlbumList: [],
      MallPhotoFileList: [],
      // 规格table动态表头
      MallSpecificDynamicHeader: [],
      SelectLoading: false,
      BrandTypeSelectData: [],
      BrandSelectData: []
    }
  },
  created() {
    this.Init()
    if (this.params.type === 'Edit' || this.params.type === 'View') {
      this.InitEditData()
    }
    if (this.params.type === 'View') {
      this.IsView = true
    }
  },
  methods: {
    // 初始化界面一些下拉框的值
    Init() {
      this.GetMallTypeTree()
      this.remoteBrandType()
    },
    // 初始化商品分类下拉框的值
    GetMallTypeTree(typeid) {
      // 商品分类
      service.GetMallTypeSelectTree2({ malltypeid: typeid }).then(response => {
        if (response.Issuccess) {
          this.MallTypeSelectData = response.Data
        }
      })
      // 初始化商品单位下拉框的值 库存单位
      UploadService.GetPopSelect({ diccode: 'ShopMallUnit' }).then(response => {
        if (response.Issuccess) {
          this.MallUnit = response.Data
        }
      })
      // 初始化商品规格下拉框的值 规格类型
      UploadService.GetPopSelect({ diccode: 'SpecificAtioin' }).then(response => {
        if (response.Issuccess) {
          this.MallSpecificAtioinTypeInitData = response.Data
        }
      })
    },
    // 编辑时初始化数据
    InitEditData() {
      this.EditInitLoading = true
      service.GetMallInfoEntity({ mallid: this.params.keyid }).then(response => {
        if (response.Issuccess) {
          this.MallBaseDetail = response.Data
          const _SpecificAtioinSelect = JSON.parse(this.MallBaseDetail.MALLSPECIFICATIONTYPE)
          _SpecificAtioinSelect.forEach(item => {
            this.MallSpecificAtioinSelect.push(item.Key)
            this.MallSpecificDynamicHeader.push(item)
          })
          const _SpecificAtioinData = JSON.parse(this.MallBaseDetail.MALLSPECIFICATION)
          this.MallSpecificAtioinData = _SpecificAtioinData
        }
        this.EditInitLoading = false
      })
      service.GetMallPhotoInfoList({ mallid: this.params.keyid }).then(response => {
        if (response.Issuccess) {
          response.Data.forEach(item => {
            this.MallPhotoAlbumList.push(item)
          })
          this.MallPhotoAlbumList.forEach(item => {
            this.MallPhotoFileList.push({ name: item.FileName, url: item.Url })
          })
        }
      })
    },
    save() {
      // 保存
      if (this.MallPhotoAlbumList.length <= 0) {
        this.$message({
          showClose: true,
          message: '请先上传商品相册信息',
          type: 'warning'
        })
        return
      }
      if (this.MallSpecificAtioinSelect.length <= 0) {
        this.$message({
          showClose: true,
          message: '请完善商品规格信息',
          type: 'warning'
        })
        return
      }
      const NewMallSpecificAtioinSelect = []
      this.MallSpecificAtioinTypeInitData.forEach(i => {
        console.log(i)
        this.MallSpecificAtioinSelect.forEach(item => {
          if (i.Key === item) {
            NewMallSpecificAtioinSelect.push(i)
          }
        })
      })
      this.MallBaseDetail.QUANTITY = 0
      this.MallSpecificAtioinData.forEach(i => {
        this.MallBaseDetail.QUANTITY += i.QuantityNum
      })
      this.MallBaseDetail.CEILINGPRICE = Math.max.apply(Math, this.MallSpecificAtioinData.map(item => { return item.OriginalPrice }))
      this.MallBaseDetail.FLOORPRICE = Math.min.apply(Math, this.MallSpecificAtioinData.map(item => { return item.OriginalPrice }))
      this.MallBaseDetail.MALLSPECIFICATIONTYPE = JSON.stringify(NewMallSpecificAtioinSelect)
      this.MallBaseDetail.MALLSPECIFICATION = JSON.stringify(this.MallSpecificAtioinData)
      service.SaveMallInfo({ mallEntity: this.MallBaseDetail, photoListJson: JSON.stringify(this.MallPhotoAlbumList) }).then(res => {
        if (res.Issuccess) {
          this.$message({
            message: '操作成功!',
            type: 'success'
          })
          this.params.isvisible = false
          this.$parent.RefreshMallList()
        } else {
          this.$message.error(res.DataMsg)
        }
      })
    },
    AutoCode() {
      alert('自动生成,暂未实现')
    },
    GetUploadServer() {
      return UploadService.HttpUploadFile
    },
    // 上传图片相关
    beforeAvatarUpload(file) {
      if (this.IsView) {
        this.$message({
          showClose: true,
          message: '查看状态不允许上传，请编辑',
          type: 'warning'
        })
        return false
      }
      const form = new FormData()
      form.append('file', file)
      form.append('fileFolder', 'MallPhoto')
      this.UpLoadData.fileUid = file.uid
    },
    // 上传成功回掉
    uploadAppSuccess(response, file, fileList) {
      if (response.Issuccess) {
        this.MallPhotoAlbumList.push(response.Data[0])
      }
    },
    // 相册删除
    handleRemove(file) {
      const fileObj = file.response.Data[0]
      this.MallPhotoAlbumList.splice(fileObj, 1)
    },
    // 选择商品规格,动态扩展列表表头
    ChangeMallSpecificAtioinSelect(value) {
      this.MallSpecificDynamicHeader = []
      // 扩展表头
      this.MallSpecificAtioinTypeInitData.forEach(item => {
        if (value.includes(item.Key)) {
          this.MallSpecificDynamicHeader.push(item)
        }
      })
      // 增加列表数据对象对应的属性值
      this.MallSpecificAtioinData.map(item => {
        for (const v in value) {
          if (!item.hasOwnProperty(value[v])) {
            this.$set(item, value[v], null)
          }
        }
      })
    },
    // 移除已选择商品规格
    RemoveMallSpecificAtioinSelect(value) {
      // 移除列表数据对象对应的属性值
      this.MallSpecificAtioinData.map(item => {
        for (const v in item) {
          if (v === value) {
            delete item[v]
          }
        }
      })
    },
    // 批量设置商品规格列表的值
    batchSetTypeValue(obj, type, typeName) {
      this.$prompt('批量设置:' + typeName, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'number'
      }).then(({ value }) => {
        this.MallSpecificAtioinData.map(item => {
          for (const sx in item) {
            if (sx === type) {
              this.$set(item, sx, value)
              // item[sx] = value
            }
          }
        })
        console.log(this.MallSpecificAtioinData)
      }).catch()
    },
    // 增加商品规格列表数据行
    AddMallSpecificAtioin() {
      const rowDemo = this.MallSpecificAtioinData[0]
      const rowNew = {}
      for (const key in rowDemo) {
        rowNew[key] = null
      }
      rowNew.rowkey = Date.now()
      this.MallSpecificAtioinData.push(rowNew)
    },
    // 处理商品规格列表数据行【复制、删除】
    handleMallSpecificAtioin(rowIndex, rowData, action) {
      if (action === 'copy') { // 复制
        var newRow = JSON.parse(JSON.stringify(rowData))
        console.log(newRow)
        newRow.rowkey = Date.now()
        console.log(newRow)
        this.MallSpecificAtioinData.push(newRow)
      }
      if (action === 'delete') { // 删除
        this.MallSpecificAtioinData.splice(this.MallSpecificAtioinData.indexOf(rowData), 1)
      }
    },
    remoteBrandType(keyWord) {
      this.SelectLoading = true
      const param = {
        currenrpage: 1,
        pagesize: 15,
        filters: ''
      }
      brandServer.GetBrandTypeList(param).then(response => {
        if (response.Issuccess) {
          this.BrandTypeSelectData = []
          this.BrandTypeSelectData = response.Data.data
        }
        this.SelectLoading = false
      })
    },
    changeBrandType(typeid) {
      const param = {
        currenrpage: 1,
        pagesize: 15,
        filters: getFilterStr(' and BRANDTYPEID = ' + typeid)
      }
      brandServer.GetBrandList(param).then(response => {
        if (response.Issuccess) {
          this.BrandSelectData = []
          this.BrandSelectData = response.Data.data
        }
      })
    },
    remoteBrand(keyWord) {
      this.SelectLoading = true
      const param = {
        currenrpage: 1,
        pagesize: 15,
        filters: ''
      }
      brandServer.GetBrandList(param).then(response => {
        if (response.Issuccess) {
          this.BrandSelectData = []
          this.BrandSelectData = response.Data.data
        }
        this.SelectLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__body{
    height: 480px;
    overflow: auto;
}
/deep/ .MallSpecificDt tbody .cell{
    padding-left: 0px;
    padding-right: 0px;
}
/deep/ .MallSpecificDt tbody .cell .el-input-number {
    padding-left: 0px;
    padding-right: 0px;
    width: auto !important;
}
/deep/ .MallSpecificDt tbody .el-input{
  width: auto !important;
}
/deep/ .MallSpecificDt tbody input{
    text-align: center !important;
    padding-left: 8px !important;
    padding-right: 5px !important;
}
/deep/ .MallSpecificDt tbody .el-input__inner{
    text-align: left !important;
    padding-left: 8px !important;
    padding-right: 5px !important;
}
/deep/.el-tabs__content{
  overflow: auto;
  height: 100%;
}
</style>
