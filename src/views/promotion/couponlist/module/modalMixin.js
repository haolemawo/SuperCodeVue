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
    var validateEFFECTIVETYPE = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback(new Error('请选择有效期类型'))
      } else if (value === 'FixedDate' && (this.entity.EFFECTIVESTARTTIME === '' || this.entity.EFFECTIVESTARTTIME === null)) {
        callback(new Error('请输入有效期的开始结束日期!'))
      } else if (value === 'FixedDays' && (this.entity.EFFECTIVEDAYS === '' || this.entity.EFFECTIVEDAYS === null)) {
        callback(new Error('请输入有效期的天数!'))
      } else {
        callback()
      }
    }
    // 优惠形式
    var validatePREFERENTIALTYPE = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback(new Error('请选择优惠形式'))
      } else if (value === 'Amount' && (this.entity.PREFERENTIALVAL === '' || this.entity.PREFERENTIALVAL === null)) {
        callback(new Error('请输入优惠金额!'))
      } else if (value === 'Discount' && (this.entity.PREFERENTIALVAL === '' || this.entity.PREFERENTIALVAL === null)) {
        callback(new Error('请输入优惠折扣比例!'))
      } else {
        callback()
      }
    }
    // 相关商品
    var validateCOUPONTYPE = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback(new Error('请选择相关商品'))
      } else if (value !== 'GeneralCoupon' && (this.entity.REFRECORDID === '' || this.entity.REFRECORDID === 0)) {
        callback(new Error('请选择相关商品或分类!'))
      } else {
        callback()
      }
    }
    return {
      entity: {
        COUPONID: 0,
        COUPONNAME: null,
        PREFERENTIALTYPE: null,
        PREFERENTIALVAL: null,
        AMOUNTLIMITUSE: null,
        PERLIMITNUM: null,
        GRANTNUM: null,
        GRANTTYPE: null,
        GRANTSTARTTIME: null,
        GRANTENDTIME: null,
        EFFECTIVETYPE: null,
        EFFECTIVESTARTTIME: null,
        EFFECTIVEENDTIME: null,
        EFFECTIVEDAYS: null,
        COUPONTYPE: null,
        REFTABLE: null,
        REFRECORDNAME: null,
        REFRECORDID: 0,
        ISUPPERSHELF: null,
        REMARK: null
      },
      rules: {
        COUPONNAME: [
          { required: true, message: '请输入优惠券名称', trigger: ['blur', 'change'] }
        ],
        GRANTTYPE: [
          { required: true, message: '请选择发放形式', trigger: ['blur', 'change'] }
        ],
        GRANTNUM: [
          { required: true, message: '请选择发放数量', trigger: ['blur', 'change'] }
        ],
        EFFECTIVETYPE: [
          { validator: validateEFFECTIVETYPE, trigger: ['blur', 'change'] }
        ],
        PREFERENTIALTYPE: [
          { validator: validatePREFERENTIALTYPE, trigger: ['blur', 'change'] }
        ],
        COUPONTYPE: [
          { validator: validateCOUPONTYPE, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {

  }
}
