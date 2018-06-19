export function filterCouponTarget(target) {
    switch (target) {
        case "ALL":
            return "全部"
        case "普通":
            return "普通用户"
        case "会员":
            return "会员"
        case "内部":
            return "内部员工"
    }
}

export function filterCouponType(type) {
    switch (type) {
        case "优惠券":
            return "优惠券"
    }

}

export function filterCouponStatus(status) {
    switch (status) {
        case "ON":
            return "发放中"
        case "OFF":
            return "未发放"
    }
}


export const couponTarget = ['ALL', '普通', '会员', '内部'];

export const couponType = ['优惠券'];