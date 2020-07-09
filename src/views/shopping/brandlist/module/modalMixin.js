export default {
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      entity: {
        BRANDID: 0,
        BRANDNAME: null,
        BRANDTYPEID: null,
        BRANDLOGO: null,
        BRANDWEBSITE: null,
        ISHOT: null,
        ISRECOMMEND: null,
        ISENABLE: null,
        SEOTITLE: null,
        SEOKEYWORD: null,
        SEODESCRIBE: null,
        REMARK: null
      },
      rules: {
        BRANDNAME: [
          { required: true, message: '请输入品牌名称', trigger: 'change' }
        ],
        BRANDTYPEID: [
          { required: true, message: '请选择品牌分类', trigger: 'change' }
        ],
        ISENABLE: [
          { required: true, message: '请选择是否启用', trigger: 'change' }
        ]
      }
    }
  },
  methods: {

  }
}
