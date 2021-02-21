# resource-page-v2

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

scr
-assets
-----png
-------picture.png
-----fonts
-------Arial.ttf
-style
----main.scss
-components
----Home.vue
-App.vue 
vue.config.js


Thêm và sử dụng static assets: 
- thêm vào thư mục src/assets các kiểu font, ảnh, icon ...
- ở các file .vue trong folder component hay view sử dụng relative path như trong thư mục scr: 
    VD nếu lấy từ App.vue thì chỉ cần ./assets/png đc rồi
    nhưng nếu lấy ở Home.vue thì ../assets/png
-tuy nhiên nếu có sử dụng sass và vue.config.js để tạo global css thì để dùng relative path ta thêm '~@/assets/png' ==> ~@ là /scr
    



File vue.config.js laf optional thêm vào để điều chỉnh các mặc định webpack đã đc ẩn đi
https://cli.vuejs.org/config  vào đây để xem thêm

VD để add sass global vào vue 
https://css-tricks.com/how-to-import-a-sass-file-into-every-vue-component-in-an-app/
tạo folder chứa toàn bộ file scss, co thể import hết vào 1 cái main.scss
viết config mới để nó nhận file scss tổng ấy , sau đó vào các component vue sử dụng variable sass ầm ầm thôi

