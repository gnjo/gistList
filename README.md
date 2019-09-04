### gistList
gist creater

### important
```
let fn={}
fn.basic =(u,p)=>{
 let _btoa =function(str){return btoa( unescape(encodeURIComponent( str )) )}
 return `Basic ${_btoa(u +':' +p)}`
}
```
### usage
```
//pug
script(src="https://gnjo.github.io/gistList/gistList.js")
```
```
//password localStorage save
//localStorage.setItem('macro.pwd',fn.basic('kaigetuten',pwd))
//option localStroge save
////localStorage.setItem('macro.opt',JSON.string...(opt))

gistList('.tar',{
 main:'macro.txt'
 ,sub:'note.txt'
 ,u:'kaigetuten'
 ,p:'macro.pwd'
 ,opt:'macro.opt'
 ,url:'https://gnjo.github.io/gistList/edit.html'
 ,max:50
})
```

### develop
https://codepen.io/gnjo/pen/QWLOGEp
