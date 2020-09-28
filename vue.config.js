module.exports = {
  devServer: {
    proxy: 'http://192.168.100.4:8088/api'
  },
  "transpileDependencies": [
    "vuetify"
  ],
}