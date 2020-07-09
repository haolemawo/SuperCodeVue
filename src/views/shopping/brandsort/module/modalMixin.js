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
        BRANDTYPEID: 0,
        BRANDTYPENAME: '',
        SEQNO: null,
        ISENABLE: null,
        REMARK: null
      },
      rules: {
        ISENABLE: [
          { required: true, message: '请选择分类状态', trigger: 'change' }
        ],
        BRANDTYPENAME: [
          { required: true, message: '请输入分类名称', trigger: 'change' }
        ]
      }
    }
  },
  methods: {

  }
}
