import React,{useEffect,useSyncExternalStore} from 'react';
import messages from './messages.json';
import './locale.css';

let locale='zh-CN';
try{locale=localStorage.getItem('flowloom.locale')||((navigator.language||'').startsWith('zh')?'zh-CN':'en-US');}catch{}
if(!['zh-CN','en-US'].includes(locale))locale='zh-CN';
const listeners=new Set();
export function setLocale(next){if(!['zh-CN','en-US'].includes(next)||next===locale)return;locale=next;try{localStorage.setItem('flowloom.locale',next);}catch{}document.documentElement.lang=next;listeners.forEach(fn=>fn());}
export function getLocale(){return locale;}
export function useLocale(){const current=useSyncExternalStore(fn=>{listeners.add(fn);return()=>listeners.delete(fn);},()=>locale,()=>locale);useEffect(()=>{document.documentElement.lang=current;},[current]);return[current,setLocale];}
export function tr(value,variables={}){if(typeof value!=='string')return value;const key=value.trim(),leading=value.slice(0,value.indexOf(key)),trailing=value.slice(value.indexOf(key)+key.length);const translated=(locale==='zh-CN'?messages.zh[key]:messages.en[key])||key;return leading+translated.replace(/\{([a-zA-Z0-9_]+)\}/g,(whole,key)=>Object.hasOwn(variables,key)?String(variables[key]):whole)+trailing;}
export function relativeTime(value){
 if(!value)return '—';
 if(/just now/i.test(value))return tr('just now');
 const compact=String(value).match(/^(\d+)\s*(m|h|d|w)(?:\s*ago)?$/i);
 if(compact)return new Intl.RelativeTimeFormat(locale,{numeric:'auto'}).format(-Number(compact[1]),{m:'minute',h:'hour',d:'day',w:'week'}[compact[2].toLowerCase()]);
 return tr(value);
}
export function LanguageSwitch({compact=false}){const[current,change]=useLocale();return <label className={`locale-switch ${compact?'is-compact':''}`}><span aria-hidden="true">◎</span><select aria-label={tr('Language')} value={current} onChange={event=>change(event.target.value)}><option value="zh-CN">简体中文</option><option value="en-US">English</option></select></label>;}
