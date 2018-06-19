import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => {
        return import(`../models/${m}.js`)
      }
      ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['global'], () => import('../layouts/BasicLayout')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/change': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/ChangePassword')),
    },
    '/goods': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/goods/index')),
    },
    '/goods/add': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/goods/add')),
    },
    '/goods/editor/:id': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/goods/editor')),
    },
    // 订单
    '/order/wx': {
      component: dynamicWrapper(app, [], () => import('../routes/order/wx.order')),
    },
    '/order/wx/list': {
      component: dynamicWrapper(app, ['orderWx'], () => import('../routes/order/wx.order.list')),
    },
    '/order/wx/details/:id': {
      component: dynamicWrapper(app, ['orderWx'], () => import('../routes/order/wx.order.details')),
    },
    // '/order/agent': {
    //   component: dynamicWrapper(app, [], () => import('../routes/order/agent.order')),
    // },
    // '/order/agent/list': {
    //   component: dynamicWrapper(app, ['orderAgent'], () => import('../routes/order/agent.order.list')),
    // },
    // '/order/agent/details/:id': {
    //   component: dynamicWrapper(app, ['orderAgent'], () => import('../routes/order/agent.order.details')),
    // },
    // 财务
    '/finance/wx': {
      component: dynamicWrapper(app, [], () => import('../routes/finance/wx')),
    },
    '/wxManage/home': {
      component: dynamicWrapper(app, ['wxManage'], () => import('../routes/wxManage/home.js')),
    },
    '/wxManage/card': {
      component: dynamicWrapper(app, ['coupon'], () => import('../routes/wxManage/card.js')),
    },
    '/wxManage/card/coupon': {
      component: dynamicWrapper(app, ['coupon'], () => import('../routes/wxManage/coupon.js')),
    },
    '/wxManage/card/discount': {
      component: dynamicWrapper(app, ['coupon'], () => import('../routes/wxManage/discount.js')),
    },
    '/wxManage/discount': {
      component: dynamicWrapper(app, ['coupon'], () => import('../routes/wxManage/discount.js')),
    },
    '/wxManage/user': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/wxManage/user.js')),
    },
    '/wxManage/home/banner': {
      component: dynamicWrapper(app, ['wxManage', 'goods'], () => import('../routes/wxManage/home.banner.js')),
    },
    '/wxManage/home/article': {
      component: dynamicWrapper(app, ['wxManage'], () => import('../routes/wxManage/home.articles.js')),
    },
    '/wxManage/home/video': {
      component: dynamicWrapper(app, ['wxManage'], () => import('../routes/wxManage/home.video')),
    },
    // '/agent/list': {
    //   component: dynamicWrapper(app, ['agent'], () => import('../routes/angent/index.js')),
    // },
    '/authority': {
      component: dynamicWrapper(app, ['authority'], () => import('../routes/authority/index')),
    },
    '/authority/add': {
      component: dynamicWrapper(app, ['authority'], () => import('../routes/authority/add')),
    },
    '/authority/editor/:name': {
      component: dynamicWrapper(app, ['authority'], () => import('../routes/authority/editor')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);

    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:idthis.tabHeight
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
