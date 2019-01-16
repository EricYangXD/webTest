# How to create a new Vue.js program

    some tips about how to create a program quickly and correctly

## 1st Step

    vue init webpack "vueweb"

## 2nd Step

    cd vueweb and change package.json as your requirements
    add some files into src folder like "views","pages","utils","api"

## 3rd Step

    npm install

## 4th Step

    npm run dev

## 5th Step

    now let's talk something about the folder structure

### folder structure

    for instance:

-   build - webpack config files
-   config - webpack config files
-   dist - build
-   src - your app
    -   api
    -   assets - resources
    -   common - some utils
    -   base - common components
    -   components - your vue components
    -   mock - fake data
    -   pages - your pages
    -   store - save some status
    -   App.vue
    -   main.js - main file
    -   router - set your router
-   static - static assets
-   package.json
-   index.html
-   .gitignore
