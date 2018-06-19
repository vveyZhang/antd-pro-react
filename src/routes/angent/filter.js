export function agentStatus(status) {
    switch (status) {
        case '1':
            return '待审核';
        case '2':
            return '准代理';
        case '3':
            return '已代理';
        case '4':
            return '已拒绝';
        case '5':
            return '已关闭';
    }
}