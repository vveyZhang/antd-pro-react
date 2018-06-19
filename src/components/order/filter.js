export function filterOrderStatus(status) {
    switch (status) {
        case 1:
            return ' 待付款';
        case 2:
            return ' 待商家处理';
        case 3:
            return ' 待商家发货';
        case 4:
            return ' 待代理发货';
        case 5:
            return ' 待收货';
        case 6:
            return ' 已完成';
        case 7:
            return ' 已关闭';
        default:
            return ' ';
    }
}

export function filterPayMode(mode) {
    switch (mode) {
        case 1:
            return '转账';
        case 2:
            return '余额';
        default:
            return '未支付'
    }
}

export function filterOrderType(type) {
    switch (type) {
        case 1:
            return '首次采购订单';
        case 2:
            return ' 本地库存提货';
        case 3:
            return ' 云库存提货';
        case 4:
            return ' 在云库存购买';
        case 5:
            return ' 在本地库存购买';
    }
}

export function filterOrderWxStatus(status) {
    switch (status) {
        case 1:
            return ' 待付款';
        case 2:
            return ' 待商家处理';
        case 3:
            return ' 待发货';
        case 4:
            return ' 待代理发货';
        case 5:
            return ' 待收货';
        case 6:
            return ' 已完成';
        case 7:
            return ' 已关闭';
        default:
            return ' ';
    }
}
export function getAgent(agents, id) {
    for (let agent of agents) {
        if (agent.id == id) {
            return agent.name
        }
    }
    return ''
}

export function agnetInfo(agent) {
    if (typeof agent != 'object' || agent.level == 1) return (
        {
            name: "加乐活总部",
            phone: '0517-83797123',
            level: '总部'
        }
    )
    return (
        {
            name: agent.name,
            phone: agent.phone,
            level: agent.level,
        }
    )
}