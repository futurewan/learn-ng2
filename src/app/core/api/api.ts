export const Api = {
    login: 'api/user/login@Post', // 方法名首字母必须大写
    logout: 'api/user/logout@Get', // 退出登录
    getImgToken: 'api/imageCode/token@Get', // 获取图形token
    // getImgCode: 'client/user/getImageVerifyCode@Get', //登录超过3次密码错误 （token拼接用）
    getImgVin: 'api/imageCode/image@Get', // 图形验证码 （token拼接用）
    sendPhoneCode: 'api/msg/code/send@Get', // 发送手机验证码
    register: 'api/user/register@Post', // 注册
    findPsw: 'api/user/loginpassword/find@Post', // 忘记密码
    getContact: 'api/service/contact@Get', // 获取客服电话

    changePassword: 'api/user/loginpassword/reset@Post', // 重置登录密码
    realNameAuth: 'api/user/auth/realName@Post', // 实名认证
    bankCardVerify: 'api/user/auth/bankCard@Post', // 绑定银行卡
    bankInfo: 'api/bank/detail@Get', // 银行卡信息
    recommendBank: 'api/bank/bankState@Get', // 查询推荐银行信息
    signContract: 'api/user/sign/Contract@Post', // 用户银行卡签约申请
    signContractCallBack: 'api/user/sign/Contract/CallBack', // 用户银行卡回调

    setPayPassword: 'api/user/paypassword/set@Post', // 设置支付密码
    resetPayPassword: 'api/user/paypassword/reset@Post', // 修改支付密码
    findPayPassword: 'api/user/paypassword/find@Post', // 找回支付密码
    orderKey: 'api/investOrder/key@Get', // 获取下单key值
    chargeForm: 'api/investOrder/rechargeAddWAP@Post', // 充值表单
    chargeResult: 'api/investOrder/rechargeDetail@Get', // 充值结果
    withdraw: 'api/investOrder/withdrawAdd@Post', // 提现申请
    subWithdraw: 'api/investOrder/withdrawAddPay@Post', // 提交提现

    getProList: 'api/product/list@Get',  // 获取产品列表
    getIndexList: 'api/product/index@Get',  // 首页产品列表
    getProDetail: 'api/product/detail@Get', // 获取产品详情
    getExp: 'api/product/exp@Get', // 获取体验标
    getIndexNew: 'api/activity/indexNew@Get', // 获取首页new标签状态
    productCalc: 'api/product/calc@Get',
    getInvestList: 'api/product/investList@Get', // 获取投资记录
    getAuthInfo: 'api/product/authImages@Get', // 获取认证消息
    getQAList: 'api/content/help/list@Get', // 帮助中心
    getCanUse: 'api/user/balance@Get', // 可用余额
    couponList: 'api/activity/coupon/list@Get', // 卡券列表
    transferList: 'api/transfer/list@Get', // 我的债权-列表

    // friendlist: 'api/friend/list@Get', // 好友列表
    friend: 'api/friend/statistic@Get', // 好友联盟
    raiseinteres: 'api/friend/award/rate@Get', // 好友联盟奖励利率明细
    // bonuscash: 'api/friend/award/cash@Get', // 好友联盟奖励现金明细
    myfriendlist: 'api/friend/list@Get', // 我的好友
    friendInvist: '/api/friend/awardDetail@Get', // 好友投资奖励
    friendAwardDetailList: 'api/friend/friendAwardDetailList@Get', // 好友联盟奖励明细
    inviteUrl: 'api/friend/inviteUrl@Get', // 获取邀请码

    makeOrder: 'api/investOrder/add@Post', // 投资下单
    payOrder: 'api/investOrder/addPay@Post', // 投资支付

    findNews: 'api/content/shangYi/list@Get', // 发现 新闻列表
    findNewsList: 'api/content/shangYi/detail@Get', // 发现 新闻列表(v2.6.2)

    my: 'api/acct/center@Get', // 我的
    info: 'api/account/info@Get', // 用户账户信息
    capital: 'api/acct/transLog@Get', // 资金明细
    integral: 'api/activity/integral/list@Get', // 积分
    myInvest: 'api/account/loan/statistic@Get', // 我的投资-首页
    myInvestList: 'api/acct/invest@Get', // 我的投资-列表
    myInvestDetail: 'api/acct/invest/detail@Get', // 我的投资-详情、
    payBackList: 'api/accountInvest/payBackList@Get', // 用户投资的回款记录
    contract: 'api/accountInvest/loan/contract@Get', // 获取债 券合同
    canTransferList: 'api/transfer/canTransferList@Get', // 用户可债转记录
    setTransfer: 'api/config/setTransfer@Get',
    isTransfer: 'api/transfer/isTransfer@Get', // 债权转让/变现判断
    ordinaryTransfer: 'api/transfer/calc@Get',
    transferApply: 'api/transfer/apply@Post', // 债权转让申请
    transferSuper: 'api/transfer/superDebt@Post', // 超债转让申请
    transferCancel: 'api/transfer/cancel@Post', // 债权转让取消
    transferDetail: 'api/transfer/detail@Get',  // 债转详情
    getCash: 'api/config/getCashIn@Get',  //    变现手续费率


    expgold: 'api/activity/expglod/Info@Get', // 体验金
    headImageUpload: 'api/file/headImage/upload@Post', // 头像上传
    upload: 'api/file/headImage/uploadOfWAPOrPC@Post', // 上传
    ossUpload: 'api/file/loan/uploadListOfOSS@Post', // oss上传

    bannerList: 'api/content/banner@Get', // 我的借款banner
    myLoanList: 'api/account/loan/list@Get', // 我的借款列表
    myLoanBase: 'api/account/loan/statistic@Get', // 我的借款统计
    myLoanDetail1: 'api/account/loan/detail-1@Get', // 我的借款详情
    myLoanDetail2: 'api/account/loan/detail-2@Get',
    myLoanDetail3: 'api/account/loan/detail-3@Get',
    myLoanDetail4: 'api/account/loan/detail-4@Get',
    myLoanDetail5: 'api/account/loan/detail-5@Get',
    myLoanDetail6: 'api/account/loan/detail-6@Get',
    myLoanDetail7: 'api/account/loan/detail-7@Get',
    myLoanDetail8: 'api/account/loan/detail-8@Get',
    myLoanDetail9: 'api/account/loan/detail-9@Get',
    myLoanDetail10: 'api/account/loan/detail-10@Get',
    myLoanDynamic: 'api/account/loan/dynamic@Get', // 借款状态
    myRepayment: '/api/account/loan/repayment@Post', //主动还款
    myLoanCalc: 'api/loan/calc@Get', // 还款计算器
    myLoanRefundType: '/api/account/loan/refundType@Get', // 还款方式
    userMaterial: 'api/account/user/material@Get',
    houseMaterial: 'api/account/house/material@Get',
    carMaterial: 'api/account/car/material@Get',
    investOrderCheck: '/api/investOrder/check@Get',
    // investOrderCheckGET说明：校验用户是否实名认证，是否设置交易密码，
    // 如果传入productNo，校验用户是否可投新手标/是否做过风险测评，
    // 不传则只校验实名认证和交易密码。

    // weixin
    wxConf: 'api/mpWX/getJSConfig@Post', // 获取JS-SDK使用权限验证配置
    wxUser: 'api/mpWX/getWeiXinAndUser@Get', // 通过微信code获取微信信息和用户信息
    wxId: 'api/mpWX/getWeiXinAppID@Get', // 获取微信服务号id
    wxBind: 'api/user/bindWeiXin@Get', // 绑定微信

    addrSearch: 'api/evaluate/search@Get', // 地址时实查询
    evalRemain: 'api/evaluate/remainder@Get', // 用户剩余估值次数（-1无限制）
    evaluate: 'api/evaluate/house@Post', // 用户剩余估值次数（-1无限制）
    loan: 'api/loan/apply@Post', // 借款  1房贷，2车贷

}
