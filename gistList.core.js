/*hisotry
v1.0
v1.2 opt
*/

;(function(root){
 if(!getTogist)return console.warn('need getTogist.js')
 ;
 if(!fn.q('.giststyle')){
  let css=`
body{
 background-color:#1a1c1d;
 color:#adadad;
 width:50rem;
 margin:2rem auto;
 font:14px/1.0 monospace;
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
  let o=Object.assign({},{sub:'',main:'',u:'',p:'',url:'',max:50,opt:''},opt)  
  ,plane=fn.q(_tar)||document.body
  ,to=getTogist(o.u,localStorage.getItem(o.p))
  ,caller=(e)=>window.open(`${o.url}?id=${e.target.id}`,'_blank')
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
 ,max:50
})
*/
