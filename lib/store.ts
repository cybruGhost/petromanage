export const useStore = () => {
  return {
    currentUser: null,
    login: () => null,
    register: () => null,
    logout: () => {},
    getCartItems: () => [],
    getUnreadNotificationsCount: () => 0,
  }
}
