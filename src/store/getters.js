const getters = {
  language: state => state.app.language,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  user: state => state.user,
  // token: state => state.user.token,
  avatar: state => state.user.Avatar,
  name: state => state.user.Name,
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  website: state => state.common.website,
  isFullScren: state => state.common.isFullScren,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  recommend: state => state.recommend
}
export default getters
