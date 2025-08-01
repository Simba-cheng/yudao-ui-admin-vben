// todo @芋艿：要不要共享
/**
 * Created by 芋道源码
 *
 * 枚举类
 */

// ========== COMMON 模块 ==========
// 全局通用状态枚举
export const CommonStatusEnum = {
  ENABLE: 0, // 开启
  DISABLE: 1, // 禁用
};

// 全局用户类型枚举
export const UserTypeEnum = {
  MEMBER: 1, // 会员
  ADMIN: 2, // 管理员
};

// ========== SYSTEM 模块 ==========
/**
 * 菜单的类型枚举
 */
export const SystemMenuTypeEnum = {
  DIR: 1, // 目录
  MENU: 2, // 菜单
  BUTTON: 3, // 按钮
};

/**
 * 角色的类型枚举
 */
export const SystemRoleTypeEnum = {
  SYSTEM: 1, // 内置角色
  CUSTOM: 2, // 自定义角色
};

/**
 * 数据权限的范围枚举
 */
export const SystemDataScopeEnum = {
  ALL: 1, // 全部数据权限
  DEPT_CUSTOM: 2, // 指定部门数据权限
  DEPT_ONLY: 3, // 部门数据权限
  DEPT_AND_CHILD: 4, // 部门及以下数据权限
  DEPT_SELF: 5, // 仅本人数据权限
};

/**
 * 用户的社交平台的类型枚举
 */
export const SystemUserSocialTypeEnum = {
  DINGTALK: {
    title: '钉钉',
    type: 20,
    source: 'dingtalk',
    img: 'https://s1.ax1x.com/2022/05/22/OzMDRs.png',
  },
  WECHAT_ENTERPRISE: {
    title: '企业微信',
    type: 30,
    source: 'wechat_enterprise',
    img: 'https://s1.ax1x.com/2022/05/22/OzMrzn.png',
  },
};

// ========== INFRA 模块 ==========
/**
 * 代码生成模板类型
 */
export const InfraCodegenTemplateTypeEnum = {
  CRUD: 1, // 基础 CRUD
  TREE: 2, // 树形 CRUD
  SUB: 15, // 主子表 CRUD
};

/**
 * 任务状态的枚举
 */
export const InfraJobStatusEnum = {
  INIT: 0, // 初始化中
  NORMAL: 1, // 运行中
  STOP: 2, // 暂停运行
};

/**
 * API 异常数据的处理状态
 */
export const InfraApiErrorLogProcessStatusEnum = {
  INIT: 0, // 未处理
  DONE: 1, // 已处理
  IGNORE: 2, // 已忽略
};

// ========== PAY 模块 ==========
/**
 * 支付渠道枚举
 */
export const PayChannelEnum = {
  WX_PUB: {
    code: 'wx_pub',
    name: '微信 JSAPI 支付',
  },
  WX_LITE: {
    code: 'wx_lite',
    name: '微信小程序支付',
  },
  WX_APP: {
    code: 'wx_app',
    name: '微信 APP 支付',
  },
  WX_NATIVE: {
    code: 'wx_native',
    name: '微信 Native 支付',
  },
  WX_WAP: {
    code: 'wx_wap',
    name: '微信 WAP 网站支付',
  },
  WX_BAR: {
    code: 'wx_bar',
    name: '微信条码支付',
  },
  ALIPAY_PC: {
    code: 'alipay_pc',
    name: '支付宝 PC 网站支付',
  },
  ALIPAY_WAP: {
    code: 'alipay_wap',
    name: '支付宝 WAP 网站支付',
  },
  ALIPAY_APP: {
    code: 'alipay_app',
    name: '支付宝 APP 支付',
  },
  ALIPAY_QR: {
    code: 'alipay_qr',
    name: '支付宝扫码支付',
  },
  ALIPAY_BAR: {
    code: 'alipay_bar',
    name: '支付宝条码支付',
  },
  WALLET: {
    code: 'wallet',
    name: '钱包支付',
  },
  MOCK: {
    code: 'mock',
    name: '模拟支付',
  },
};

/**
 * 支付的展示模式每局
 */
export const PayDisplayModeEnum = {
  URL: {
    mode: 'url',
  },
  IFRAME: {
    mode: 'iframe',
  },
  FORM: {
    mode: 'form',
  },
  QR_CODE: {
    mode: 'qr_code',
  },
  APP: {
    mode: 'app',
  },
};

/**
 * 支付类型枚举
 */
export const PayType = {
  WECHAT: 'WECHAT',
  ALIPAY: 'ALIPAY',
  MOCK: 'MOCK',
};

/**
 * 支付订单状态枚举
 */
export const PayOrderStatusEnum = {
  WAITING: {
    status: 0,
    name: '未支付',
  },
  SUCCESS: {
    status: 10,
    name: '已支付',
  },
  CLOSED: {
    status: 20,
    name: '未支付',
  },
};

// ========== MALL - 商品模块 ==========
/**
 * 商品 首页 日期类型
 */
export enum TimeRangeTypeEnum {
  DAY30 = 1,
  MONTH = 30,
  WEEK = 7,
  YEAR = 365,
}

/**
 * 商品 SPU 状态
 */
export const ProductSpuStatusEnum = {
  RECYCLE: {
    status: -1,
    name: '回收站',
  },
  DISABLE: {
    status: 0,
    name: '下架',
  },
  ENABLE: {
    status: 1,
    name: '上架',
  },
};

// ========== MALL - 营销模块 ==========
/**
 * 优惠劵模板的有限期类型的枚举
 */
export const CouponTemplateValidityTypeEnum = {
  DATE: {
    type: 1,
    name: '固定日期可用',
  },
  TERM: {
    type: 2,
    name: '领取之后可用',
  },
};

/**
 * 优惠劵模板的领取方式的枚举
 */
export const CouponTemplateTakeTypeEnum = {
  USER: {
    type: 1,
    name: '直接领取',
  },
  ADMIN: {
    type: 2,
    name: '指定发放',
  },
  REGISTER: {
    type: 3,
    name: '新人券',
  },
};

/**
 * 营销的商品范围枚举
 */
export const PromotionProductScopeEnum = {
  ALL: {
    scope: 1,
    name: '通用劵',
  },
  SPU: {
    scope: 2,
    name: '商品劵',
  },
  CATEGORY: {
    scope: 3,
    name: '品类劵',
  },
};

/**
 * 营销的条件类型枚举
 */
export const PromotionConditionTypeEnum = {
  PRICE: {
    type: 10,
    name: '满 N 元',
  },
  COUNT: {
    type: 20,
    name: '满 N 件',
  },
};

/**
 * 优惠类型枚举
 */
export const PromotionDiscountTypeEnum = {
  PRICE: {
    type: 1,
    name: '满减',
  },
  PERCENT: {
    type: 2,
    name: '折扣',
  },
};

// ========== MALL - 交易模块 ==========
/**
 * 分销关系绑定模式枚举
 */
export const BrokerageBindModeEnum = {
  ANYTIME: {
    mode: 1,
    name: '首次绑定',
  },
  REGISTER: {
    mode: 2,
    name: '注册绑定',
  },
  OVERRIDE: {
    mode: 3,
    name: '覆盖绑定',
  },
};
/**
 * 分佣模式枚举
 */
export const BrokerageEnabledConditionEnum = {
  ALL: {
    condition: 1,
    name: '人人分销',
  },
  ADMIN: {
    condition: 2,
    name: '指定分销',
  },
};
/**
 * 佣金记录业务类型枚举
 */
export const BrokerageRecordBizTypeEnum = {
  ORDER: {
    type: 1,
    name: '获得推广佣金',
  },
  WITHDRAW: {
    type: 2,
    name: '提现申请',
  },
};
/**
 * 佣金提现状态枚举
 */
export const BrokerageWithdrawStatusEnum = {
  AUDITING: {
    status: 0,
    name: '审核中',
  },
  AUDIT_SUCCESS: {
    status: 10,
    name: '审核通过',
  },
  AUDIT_FAIL: {
    status: 20,
    name: '审核不通过',
  },
  WITHDRAW_SUCCESS: {
    status: 11,
    name: '提现成功',
  },
  WITHDRAW_FAIL: {
    status: 21,
    name: '提现失败',
  },
};
/**
 * 佣金提现类型枚举
 */
export const BrokerageWithdrawTypeEnum = {
  WALLET: {
    type: 1,
    name: '钱包',
  },
  BANK: {
    type: 2,
    name: '银行卡',
  },
  WECHAT: {
    type: 3,
    name: '微信',
  },
  ALIPAY: {
    type: 4,
    name: '支付宝',
  },
};

/**
 * 配送方式枚举
 */
export const DeliveryTypeEnum = {
  EXPRESS: {
    type: 1,
    name: '快递发货',
  },
  PICK_UP: {
    type: 2,
    name: '到店自提',
  },
};
/**
 * 交易订单 - 状态
 */
export const TradeOrderStatusEnum = {
  UNPAID: {
    status: 0,
    name: '待支付',
  },
  UNDELIVERED: {
    status: 10,
    name: '待发货',
  },
  DELIVERED: {
    status: 20,
    name: '已发货',
  },
  COMPLETED: {
    status: 30,
    name: '已完成',
  },
  CANCELED: {
    status: 40,
    name: '已取消',
  },
};

// ========== ERP - 企业资源计划 ==========

export const ErpBizType = {
  PURCHASE_ORDER: 10,
  PURCHASE_IN: 11,
  PURCHASE_RETURN: 12,
  SALE_ORDER: 20,
  SALE_OUT: 21,
  SALE_RETURN: 22,
};

// ========== BPM 模块 ==========

export const BpmModelType = {
  BPMN: 10, // BPMN 设计器
  SIMPLE: 20, // 简易设计器
};

export const BpmModelFormType = {
  NORMAL: 10, // 流程表单
  CUSTOM: 20, // 业务表单
};

export const BpmProcessInstanceStatus = {
  NOT_START: -1, // 未开始
  RUNNING: 1, // 审批中
  APPROVE: 2, // 审批通过
  REJECT: 3, // 审批不通过
  CANCEL: 4, // 已取消
};

export const BpmAutoApproveType = {
  NONE: 0, // 不自动通过
  APPROVE_ALL: 1, // 仅审批一次，后续重复的审批节点均自动通过
  APPROVE_SEQUENT: 2, // 仅针对连续审批的节点自动通过
};

// 候选人策略枚举 （ 用于审批节点。抄送节点 )
export enum CandidateStrategyEnum {
  /**
   * 审批人自选
   */
  APPROVE_USER_SELECT = 34,
  /**
   * 部门的负责人
   */
  DEPT_LEADER = 21,
  /**
   * 部门成员
   */
  DEPT_MEMBER = 20,
  /**
   * 流程表达式
   */
  EXPRESSION = 60,
  /**
   * 表单内部门负责人
   */
  FORM_DEPT_LEADER = 51,
  /**
   * 表单内用户字段
   */
  FORM_USER = 50,
  /**
   * 连续多级部门的负责人
   */
  MULTI_LEVEL_DEPT_LEADER = 23,
  /**
   * 指定岗位
   */
  POST = 22,
  /**
   * 指定角色
   */
  ROLE = 10,
  /**
   * 发起人自己
   */
  START_USER = 36,
  /**
   * 发起人部门负责人
   */
  START_USER_DEPT_LEADER = 37,
  /**
   * 发起人连续多级部门的负责人
   */
  START_USER_MULTI_LEVEL_DEPT_LEADER = 38,
  /**
   * 发起人自选
   */
  START_USER_SELECT = 35,
  /**
   * 指定用户
   */
  USER = 30,
  /**
   * 指定用户组
   */
  USER_GROUP = 40,
}

/**
 * 节点类型
 */
export enum NodeTypeEnum {
  /**
   * 子流程节点
   */
  CHILD_PROCESS_NODE = 20,
  /**
   * 条件分支节点 (对应排他网关)
   */
  CONDITION_BRANCH_NODE = 51,
  /**
   * 条件节点
   */
  CONDITION_NODE = 50,

  /**
   * 抄送人节点
   */
  COPY_TASK_NODE = 12,

  /**
   * 延迟器节点
   */
  DELAY_TIMER_NODE = 14,

  /**
   * 结束节点
   */
  END_EVENT_NODE = 1,

  /**
   * 包容分支节点 (对应包容网关)
   */
  INCLUSIVE_BRANCH_NODE = 53,

  /**
   * 并行分支节点 (对应并行网关)
   */
  PARALLEL_BRANCH_NODE = 52,

  /**
   * 路由分支节点
   */
  ROUTER_BRANCH_NODE = 54,
  /**
   * 发起人节点
   */
  START_USER_NODE = 10,
  /**
   * 办理人节点
   */
  TRANSACTOR_NODE = 13,

  /**
   * 触发器节点
   */
  TRIGGER_NODE = 15,
  /**
   * 审批人节点
   */
  USER_TASK_NODE = 11,
}

/**
 * 任务状态枚举
 */
export enum TaskStatusEnum {
  /**
   * 审批通过
   */
  APPROVE = 2,

  /**
   * 审批通过中
   */
  APPROVING = 7,
  /**
   * 已取消
   */
  CANCEL = 4,
  /**
   * 未开始
   */
  NOT_START = -1,

  /**
   * 审批不通过
   */
  REJECT = 3,

  /**
   * 已退回
   */
  RETURN = 5,
  /**
   * 审批中
   */
  RUNNING = 1,
  /**
   * 待审批
   */
  WAIT = 0,
}
