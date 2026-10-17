import { tr } from "./i18n";import React from 'react';
import identity from '../brand.json';
export const brand = identity;
export const brandTitle = identity.name + (identity.chineseName ? ' · ' + identity.chineseName : '');

// Two open streams cross once; the underpass is genuinely transparent.
export const logoPaths = [
'M6 6C9.64 6 11.7904 7.568 13.2854 9.8259M18.7146 22.1741C20.2096 24.432 22.36 26 26 26',
'M6 26C6 13 26 19 26 6'];

export function Logo({ size = 32, wordmark = false, className = '', style = {}, ...props }) {
  return <span className={`flowloom-logo ${className}`.trim()} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', ...style }} role={wordmark ? undefined : 'img'} aria-label={wordmark ? undefined : brandTitle} {...props}><svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>{logoPaths.map((path) => <path key={path} d={path} />)}</svg>{wordmark && <span style={{ fontSize: size * .64, fontWeight: 550, letterSpacing: '-.05em', lineHeight: 1 }}>{tr("flowloom")}{brand.chineseName && <span style={{ fontSize: Math.max(10, size * .28), fontWeight: 450, letterSpacing: '.06em', marginLeft: 8, opacity: .6 }}>{brand.chineseName}</span>}</span>}</span>;
}
