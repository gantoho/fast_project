export function useBookmarklet() {
  const jsCode = `(function(){
  try{
    var p=new URLSearchParams(location.search),n=p.size;
    if(!n)return;
    p.forEach(function(v,k){
      var e=document.querySelector('[name="'+k.replace(/["\\\\]/g,'')+'"]')||document.getElementById(k);
      if(!e)return;
      var t=e.tagName.toLowerCase();
      if(t==='input'||t==='textarea'||t==='select')e.value=v;
      e.dispatchEvent(new Event('input',{bubbles:true}));
      e.dispatchEvent(new Event('change',{bubbles:true}));
      e.dispatchEvent(new Event('blur',{bubbles:true}));
    });
  }catch(e){}
})()`

  const bookmarkletUrl = 'javascript:' + encodeURIComponent(jsCode)

  return { bookmarkletUrl }
}