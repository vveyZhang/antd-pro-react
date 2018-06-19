import { isUrl } from '../utils/utils';
const menuData = [
  {
    name: '财务',
    icon: 'bank',
    path: 'finance',
    children: [{
      name: '微信账单',
      path: 'wx',
    }]
  },
  {
    name: '商品管理',
    icon: 'appstore',
    path: 'goods',
  },
  {
    name: '订单',
    icon: 'profile',
    path: 'order',
    children: [
      {
        name: '微信订单',
        path: 'wx',
      }]
  },
  {
    name: '微信小程序',
    icon: 'wechat',
    path: 'wxManage',
    children: [{
      name: '首页管理',
      path: 'home',
    },
    {
      name: '卡包管理',
      path: 'card',
    },
    {
      name: '用户管理',
      path: 'user',
    }
    ]
  },
  {
    name: '权限管理',
    icon: 'safety',
    path: 'authority',
  }
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.name || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);