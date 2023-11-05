import "./public/iconfont.css";

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    if (typeof replaceIcon !== "undefined") {
      const timeout = setTimeout(() => {
        replaceIcon();
        clearTimeout(timeout);
      }, 100);
    }
    next();
  });
};
