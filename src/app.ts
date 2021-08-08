import { createApp } from 'vue'
import Vuex from '@/store'
import '@tarojs/taro/html.css'
import './app.scss'

const App = createApp({
})
App.use(Vuex)
export default App
