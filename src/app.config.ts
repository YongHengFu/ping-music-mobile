export default {
  pages: [
    'pages/music/music',
    'pages/video/video',
    'pages/personal/personal'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    backgroundColor: '#FFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/music/music',
        text: '',
        iconPath: 'assets/icons/music.png',
        selectedIconPath: 'assets/icons/music-active.png'
      }, {
        pagePath: 'pages/video/video',
        text: '',
        iconPath: 'assets/icons/video.png',
        selectedIconPath: 'assets/icons/video-active.png'
      }, {
        pagePath: 'pages/personal/personal',
        text: '',
        iconPath: 'assets/icons/personal.png',
        selectedIconPath: 'assets/icons/personal-active.png'
      }
    ]
  }
}
