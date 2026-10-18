// Public-page analytics only. No account identifiers, query strings or browser storage.
export function startSiteAnalytics({mirror=false}={}){
  if(typeof window==='undefined')return ()=>{};
  const allowed=new Set(['/','https://flowloom.cc/guide/','https://flowloom.cc/downloads/']);
  const path=mirror&&location.pathname==='/flowloom-website/'?'/':location.pathname;
  if(!allowed.has(path)||new URLSearchParams(location.search).has('invite'))return ()=>{};
  let sent=false;
  const send=()=>{
    if(sent||document.visibilityState!=='visible')return;
    if(navigator.doNotTrack==='1'||navigator.globalPrivacyControl)return;
    sent=true;
    let referrer='';try{referrer=new URL(document.referrer).hostname;}catch{}
    const body=JSON.stringify({id:crypto.randomUUID(),path,referrer});
    const endpoint=mirror?'https://flowloom.cc/api/site-analytics/visit':'/api/site-analytics/visit';
    fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain'},body,credentials:'omit',keepalive:true}).catch(()=>{});
  };
  const restore=event=>{if(event.persisted){sent=false;send();}};
  document.addEventListener('visibilitychange',send);window.addEventListener('pageshow',restore);send();
  return ()=>{document.removeEventListener('visibilitychange',send);window.removeEventListener('pageshow',restore);};
}
