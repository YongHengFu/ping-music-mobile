import Taro from '@tarojs/taro'
const menuBarInfo = Taro.getMenuButtonBoundingClientRect()
export const statusBarHeight = Taro.getSystemInfoSync().statusBarHeight
export const navigationBarHeight = (menuBarInfo.top - statusBarHeight) * 2 + menuBarInfo.height + statusBarHeight
export const pageWith = Taro.getSystemInfoSync().screenWidth
export const menuBarHeight = menuBarInfo.height
export const menuBarWidth = (Taro.getSystemInfoSync().screenWidth - menuBarInfo.right) * 2 + menuBarInfo.width
