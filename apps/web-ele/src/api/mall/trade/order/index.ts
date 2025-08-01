import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MallOrderApi {
  /** 商品属性 */
  export interface ProductProperty {
    /** 属性的编号 */
    propertyId?: null | number;
    /** 属性的名称 */
    propertyName?: string;
    /** 属性值的编号 */
    valueId?: null | number;
    /** 属性值的名称 */
    valueName?: string;
  }

  /** 订单项 */
  export interface OrderItem {
    /** 编号 */
    id?: null | number;
    /** 用户编号 */
    userId?: null | number;
    /** 订单编号 */
    orderId?: null | number;
    /** 商品 SPU 编号 */
    spuId?: null | number;
    /** 商品 SPU 名称 */
    spuName?: string;
    /** 商品 SKU 编号 */
    skuId?: null | number;
    /** 商品图片 */
    picUrl?: string;
    /** 购买数量 */
    count?: null | number;
    /** 商品原价（总） */
    originalPrice?: null | number;
    /** 商品原价（单） */
    originalUnitPrice?: null | number;
    /** 商品优惠（总） */
    discountPrice?: null | number;
    /** 商品实付金额（总） */
    payPrice?: null | number;
    /** 子订单分摊金额（总） */
    orderPartPrice?: null | number;
    /** 分摊后子订单实付金额（总） */
    orderDividePrice?: null | number;
    /** 售后状态 */
    afterSaleStatus?: null | number;
    /** 属性数组 */
    properties?: ProductProperty[];
  }

  /** 订单日志 */
  export interface OrderLog {
    /** 日志编号 */
    id: number;
    /** 日志内容 */
    content?: string;
    /** 创建时间 */
    createTime?: Date;
    /** 用户类型 */
    userType?: number;
  }

  /** 订单 */
  export interface Order {
    /** 订单编号 */
    id?: null | number;
    /** 订单流水号 */
    no?: string;
    /** 下单时间 */
    createTime?: Date | null;
    /** 订单类型 */
    type?: null | number;
    /** 订单来源 */
    terminal?: null | number;
    /** 用户编号 */
    userId?: null | number;
    /** 用户 IP */
    userIp?: string;
    /** 用户备注 */
    userRemark?: string;
    /** 订单状态 */
    status?: null | number;
    /** 购买的商品数量 */
    productCount?: null | number;
    /** 订单完成时间 */
    finishTime?: Date | null;
    /** 订单取消时间 */
    cancelTime?: Date | null;
    /** 取消类型 */
    cancelType?: null | number;
    /** 商家备注 */
    remark?: string;
    /** 支付订单编号 */
    payOrderId?: null | number;
    /** 是否已支付 */
    payStatus?: boolean;
    /** 付款时间 */
    payTime?: Date | null;
    /** 支付渠道 */
    payChannelCode?: string;
    /** 商品原价（总） */
    totalPrice?: null | number;
    /** 订单优惠（总） */
    discountPrice?: null | number;
    /** 运费金额 */
    deliveryPrice?: null | number;
    /** 订单调价（总） */
    adjustPrice?: null | number;
    /** 应付金额（总） */
    payPrice?: null | number | string;
    /** 发货方式 */
    deliveryType?: null | number;
    /** 自提门店编号 */
    pickUpStoreId?: number;
    /** 自提核销码 */
    pickUpVerifyCode?: string;
    /** 配送模板编号 */
    deliveryTemplateId?: null | number;
    /** 发货物流公司编号 */
    logisticsId?: null | number;
    /** 发货物流单号 */
    logisticsNo?: string;
    /** 发货时间 */
    deliveryTime?: Date | null;
    /** 收货时间 */
    receiveTime?: Date | null;
    /** 收件人名称 */
    receiverName?: string;
    /** 收件人手机 */
    receiverMobile?: string;
    /** 收件人邮编 */
    receiverPostCode?: null | number;
    /** 收件人地区编号 */
    receiverAreaId?: null | number;
    /** 收件人地区名字 */
    receiverAreaName?: string;
    /** 收件人详细地址 */
    receiverDetailAddress?: string;
    /** 售后状态 */
    afterSaleStatus?: null | number;
    /** 退款金额 */
    refundPrice?: null | number;
    /** 优惠劵编号 */
    couponId?: null | number;
    /** 优惠劵减免金额 */
    couponPrice?: null | number;
    /** 积分抵扣的金额 */
    pointPrice?: null | number;
    /** VIP 减免金额 */
    vipPrice?: null | number;
    /** 订单项列表 */
    items?: OrderItem[];
    /** 下单用户信息 */
    user?: {
      /** 用户头像 */
      avatar?: string;
      /** 用户编号 */
      id?: null | number;
      /** 用户昵称 */
      nickname?: string;
    };
    /** 推广用户信息 */
    brokerageUser?: {
      /** 用户头像 */
      avatar?: string;
      /** 用户编号 */
      id?: null | number;
      /** 用户昵称 */
      nickname?: string;
    };
    /** 订单操作日志 */
    logs?: OrderLog[];
  }

  /** 交易订单统计 */
  export interface OrderSummary {
    /** 订单数量 */
    orderCount: number;
    /** 订单金额 */
    orderPayPrice: number;
    /** 退款单数 */
    afterSaleCount: number;
    /** 退款金额 */
    afterSalePrice: number;
  }

  /** 订单发货请求 */
  export interface DeliveryRequest {
    /** 订单编号 */
    id?: number;
    /** 发货方式 */
    expressType: string;
    /** 物流公司编号 */
    logisticsId: null | number;
    /** 物流编号 */
    logisticsNo: string;
  }

  /** 订单备注请求 */
  export interface RemarkRequest {
    /** 订单编号 */
    id: number;
    /** 备注 */
    remark: string;
  }

  /** 订单调价请求 */
  export interface PriceRequest {
    /** 订单编号 */
    id: number;
    /** 调整金额，单位：分 */
    adjustPrice: number;
  }

  /** 订单地址请求 */
  export interface AddressRequest {
    /** 订单编号 */
    id: number;
    /** 收件人名称 */
    receiverName: string;
    /** 收件人手机 */
    receiverMobile: string;
    /** 收件人地区编号 */
    receiverAreaId: number;
    /** 收件人详细地址 */
    receiverDetailAddress: string;
  }

  export interface OrderExpressTrackRespDTO {
    /** 发生时间 */
    time: Date;
    /** 快递状态 */
    content: string;
  }
}

/** 查询交易订单列表 */
export function getOrderPage(params: PageParam) {
  return requestClient.get<PageResult<MallOrderApi.Order>>(
    '/trade/order/page',
    {
      params,
    },
  );
}

/** 查询交易订单统计 */
export function getOrderSummary(params: PageParam) {
  return requestClient.get<MallOrderApi.OrderSummary>('/trade/order/summary', {
    params,
  });
}

/** 查询交易订单详情 */
export function getOrder(id: number) {
  return requestClient.get<MallOrderApi.Order>(
    `/trade/order/get-detail?id=${id}`,
  );
}

/** 查询交易订单物流详情 */
export function getExpressTrackList(id: number) {
  return requestClient.get<MallOrderApi.OrderExpressTrackRespDTO[]>(
    `/trade/order/get-express-track-list?id=${id}`,
  );
}

/** 订单发货 */
export function deliveryOrder(data: MallOrderApi.DeliveryRequest) {
  return requestClient.put('/trade/order/delivery', data);
}

/** 订单备注 */
export function updateOrderRemark(data: MallOrderApi.RemarkRequest) {
  return requestClient.put('/trade/order/update-remark', data);
}

/** 订单调价 */
export function updateOrderPrice(data: MallOrderApi.PriceRequest) {
  return requestClient.put('/trade/order/update-price', data);
}

/** 修改订单地址 */
export function updateOrderAddress(data: MallOrderApi.AddressRequest) {
  return requestClient.put('/trade/order/update-address', data);
}

/** 订单核销 */
export function pickUpOrder(id: number) {
  return requestClient.put(`/trade/order/pick-up-by-id?id=${id}`);
}

/** 订单核销 */
export function pickUpOrderByVerifyCode(pickUpVerifyCode: string) {
  return requestClient.put('/trade/order/pick-up-by-verify-code', {
    params: { pickUpVerifyCode },
  });
}

/** 查询核销码对应的订单 */
export function getOrderByPickUpVerifyCode(pickUpVerifyCode: string) {
  return requestClient.get<MallOrderApi.Order>(
    '/trade/order/get-by-pick-up-verify-code',
    { params: { pickUpVerifyCode } },
  );
}
