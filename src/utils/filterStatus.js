export function goodsStatus(status) {
    switch (status) {
        case 1:
        return '销售中';
        case 2:
        return '下架';
        case 3:
        return '删除';
    }
}