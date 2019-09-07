/*history
v1.0 make
v1.2 coded
v1.6 window.open
v1.7 bugfix window.open issue
*/
;(function(root){
 let VER='gistList v1.7'
 
 //console.log('in')
 if(!document.body.dataset.scroll){
  let el=document.createElement('style')
  el.classList.add('scroll')
  document.head.appendChild(el)
  document.body.dataset.scroll='true';  
 }
 //console.log('a')
 let css=`
body{
background:%%bg%%;
color:%%c%%;
}

::-webkit-scrollbar-thumb {
  background: %%c%%;
  border-radius: 0px;
}

.hidescrollbar::-webkit-scrollbar
,.hidescroll::-webkit-scrollbar {
  width: 0px;
}

::-webkit-scrollbar {
  background-color: %%bg%%;
  width: 8px;
}

::-webkit-scrollbar-button {
  background-color: %%bg%%;
  height: 0px;
  width: 0px;
  border-radius: 0px;
}
`
 
 function entry(bg,c){
  let el=document.querySelector('style.scroll')
  el.innerHTML=css.replace(/%%bg%%/g,bg).replace(/%%c%%/g,c)
 }
 root.scroll=entry
})(this);

//scroll('#000','#aaa')

/*****/
;(function(root){
 /*history
 v1.0 multiple user 
 v1.1 to.togistdebug

 */

 function entry(u,a){
  'use strict';
  ;
  var to={}
  var gists={}
  gists.user=u
  gists.authstring=a //basic ...........
  gists.headers={
   "Authorization":gists.authstring
   ,'Accept': 'application/json'
   ,'Content-Type': 'application/json'
  }
  gists.jsy=JSON.stringify
  gists.f=function(url,o){return fetch(url,o).then((d)=>{
   if(d.ok) return Promise.resolve(d).then(d=>d.json())
   else return Promise.reject(d.status)
  })}
  gists.create=function(data){
   let url="https://api.github.com/gists"
   ,o={
    method:'POST'
    ,headers: gists.headers
    ,body: gists.jsy(data)
   }
   ;   
   return gists.f(url,o)  
  }
  gists.update=function(id,data){
   let url="https://api.github.com/gists/" + id
   ,o={
    method:'PATCH'
    ,headers: gists.headers
    ,body: gists.jsy(data)
   }
   ;   
   return gists.f(url,o)  
  }
  gists.searchid=function(url,o){return gists.f(url,o) }
  gists.search=gists.searchid;

  to.togistdebug=false;

  //ary=[[c,f],[c,f]]... c is content, f is filename
  to.togist2=(async (_ary,gistid,desc)=>{

   //let fname= filename||'anonymous'
   let ary =_ary
   ,data={"files": { } }
   if(desc) data.description=desc; //bug fix desc
   data.public=false
   ary.map(d=>{
    let content=d[0],fname=d[1];
    if(to.togistdebug){
     console.log('content length',content.length)
     console.log('fname',fname)
    }

    data.files[fname] = {"content": content}
   })
   ;
   var ret =(gistid)?await gists.update(gistid,data) :await gists.create(data)
   ;
   if(to.togistdebug){
    console.log('gistid',ret.id)
    console.log('gist url',ret.html_url)
   }
   return ret;
  });


  to.togist=(async (content,gistid,filename,desc)=>{

   let fname= filename||'anonymous'
   ,data={"files": { } }
   if(desc) data.description=desc; //bug fix desc
   data.public=false
   data.files[fname] = {"content": content}
   ;
   var ret =(gistid)?await gists.update(gistid,data) :await gists.create(data)
   ;
   if(to.togistdebug){
    console.log('gistid',ret.id)
    console.log('filename',fname)
    console.log('gist url',ret.html_url)
   }
   return ret;
  });

  to.togistsearch=(async (gistid,file)=>{
   //search id
   let url ="https://api.github.com/gists/" + gistid
   ,o={method:'GET',mode:'cors',headers:gists.headers}
   var ret =await gists.searchid(url,o)
   ;
   if(to.togistdebug) console.log('url',url);
   if(!file) return ret;
   return ret.files[file].raw_url 
  })
  to.togistpage=(async (num)=>{
   let _num=num||'1'
   ,user=gists.user
   ,url =`https://api.github.com/users/${user}/gists?page=${_num}`
   ,o={method:'GET',mode:'cors',headers:gists.headers}
   ;
   var ret =await gists.search(url,o)
   ;
   if(to.togistdebug) console.log('url',url)
   return ret;

  });

  return Object.assign({},to,gists)
 }

 root.getTogist=entry;
})(this);

/*****/
/*hisotry
v1.0
v1.2 opt
*/

;(function(root){
 if(!getTogist)return console.warn('need getTogist.js')
 ;
 let fn={}
 fn.q=(s,doc=document)=>{return doc.querySelector(s)}
fn.i3=(d)=>{
 if(typeof d !=='string') return d
 var el=document.createElement('table'); el.innerHTML=d.trim();
 var me=el.childNodes[0]
 el=void 0;
 return me
}
fn.a2=function(me,p){p.appendChild(me);return me}
fn.pad=(d,l)=>('000000000000000000'+d).slice(-1*l)
fn.lex=(str)=>{
  let title='',url='',line=0,c=44;
  let a =str.split('\n').forEach((d)=>{
   if( d.charAt(0) === '＃' ) title = d;
   else if(d.charAt(0) === '＠' && is.imgurl(d.slice(1))) url =d.slice(1);
   line += Math.ceil((d.length+0.1)/c)
  });
  return {t:title,u:url,l:line,s:str}
 }
fn.jpTime=(timestamp=Date.now())=>{
 return new Date(timestamp+1000*60*60*9)
  .toISOString()
  .replace(/-/g,'/')
  .replace('T',' ')
  .slice(0,'YYYY/MM/DD hh:mm'.length)
 ;
}
fn.empty=(el)=>{
  while( el.firstChild ){el.removeChild( el.firstChild )}
  return el
}
fn.basic=(u,p)=>{
 let _btoa =function(str){return btoa( unescape(encodeURIComponent( str )) )}
 return `Basic ${_btoa(u +':' +p)}`
}
 ;
 if(!fn.q('.giststyle')){
  let css=`
body{
/* background-color:black;
 color:#456;*/
 width:50rem;
 margin:2rem auto;
 font:14px/1.3 monospace;
}
.new,.upd{display:inline}
li{cursor:pointer}
li:after{content: ' 'attr(line)' 'attr(updated)}
li:hover{color:#f26}
ol,li{list-style:none;}
`
  let el=fn.i3(`<style class="giststyle">${css}</style>`)
  fn.a2(el,document.head)
 }
 ;
 function lay(obj,file){
  let fu=Date.now() + 25*3600
  let order =fu - new Date(obj.updated_at).getTime()
  ,size=fn.pad(obj.files[file].size,7)
  ,line=fn.pad(Math.ceil(parseInt(size)/(3*42*0.5)),4)
  ,title=fn.lex(obj.description).t
  ,updated=fn.jpTime( new Date(obj.updated_at).getTime() )
  ,id=obj.id
  ;
  return`
<li style="order:${order}" class="gistid" id="${id}" line="${line}" updated="${updated}" >
${title}</li>
`.trim()
 }
 ;

 function entry(_tar,opt){
  let o=Object.assign({},{sub:'',main:'',u:'',p:'',url:'',max:50,opt:'',blank:false,color:'#456',bgcolor:'#000'},opt)  
  ,plane=fn.q(_tar)||document.body
  ,to=getTogist(o.u,localStorage.getItem(o.p))
  ,caller=(e)=>{
   let url=`${o.url}?id=${e.target.id}&opt=${o.opt}`
   if(o.blank)?window.open(url,'_blank'):window.location=url //bugfix
  }
  ,board=fn.i3('<ol class="index"></ol>')
//  ,n=fn.i3(`<li style="order:1" ><label class="new">NEW </label><label class="upd">UPDATE</label></li>`)
  ,n=fn.i3(`<div style="order:1;" ><li class="new">NEW </li><li class="upd">UPDATE</li></div>`)
  ,ne=async()=>{
   let str='＃＊新規'
   let a=await to.togist(str,void 0,o.main,str)
   let b=void 0
   if(o.sub)
    b=await to.togist(str,a.id,o.sub,str)
   let c=await to.togistsearch(a.id)
   let el=fn.i3(lay(c))
   ;el.onclick=caller//bug fix
   fn.a2(el,board)
   ;a=b=c=void 0;
  }
  ,upd=async()=>{
   init();//
   let max=o.max,ary=[]
   for(let i=1;i<max;i++){
    let a =await to.togistpage(i);
    if(a.length===0) break;
    let mar =a
    mar=mar.filter(d=>d.files[o.main])
    for(let j=0;j<mar.length;j++){
     let obj=mar[j]
     ,el=fn.i3(lay(obj,o.main))
     ,raw=obj.files[o.main].raw_url
     ;el.onclick=caller
     fn.a2(el,board )
    }
   }
   ;ary=void 0;
  }
  ,init=()=>{
   //board.innerHTML=''
   fn.empty(board)
   fn.q('.new',n).onclick=ne;
   fn.q('.upd',n).onclick=upd;
   fn.a2(n,board)   
  }
  console.log(VER)
  scroll(o.bgcolor,o.color)//v1.3
  localStorage.setItem(o.opt,JSON.stringify(opt)) //v1.2
  init();
  fn.a2(board,plane)
 }

 root.gistList=entry;
})(this);
/*
localStorage.setItem('macro.pwd',fn.basic('kaigetuten',pwd))

gistList('.tar',{
 main:'macro.txt'
 ,sub:'note.txt'
 ,u:'kaigetuten'
 ,p:'macro.pwd'
 ,opt:'macro.opt'
 ,url:'https://gnjo.github.io/use.js'
 ,blank:false
 ,color:'#456'
 ,bgcolor:'#000'
 ,max:50
})
*/
