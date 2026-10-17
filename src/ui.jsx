import { tr } from "./i18n";import React from 'react';
import { Logo } from './Brand';
import { icons } from './icon-library';
import { useModalRegistration } from './motion';

export function Icon({ name = 'Circle', size = 16, ...props }) {const Component = icons[name] || icons.Circle;return <Component size={size} strokeWidth={1.65} aria-hidden="true" {...props} />;}
export function WeaveMark({ className = '' }) {return <Logo className={className} size={24} />;}
export const brandColors = { google: '#4285f4', gmail: '#ea4335', slack: '#e84d8b', linear: '#6d6bd1', notion: '#161616', openai: '#161616', stripe: '#7961f2', hubspot: '#ff7a59', github: '#161616', googlesheets: '#34a853', postgresql: '#4b78a3' };
export function BrandIcon({ name, size = 16, className = '' }) {return <span className={`brand-icon ${className}`} style={{ width: size, height: size, backgroundColor: brandColors[name] || 'currentColor', maskImage: `url(https://flowloom.cc/assets/logos/${name}.svg)`, WebkitMaskImage: `url(https://flowloom.cc/assets/logos/${name}.svg)` }} aria-hidden="true" />;}
export function Modal(props) {useModalRegistration({ ...props, renderClose: (onClose) => <button className="icon-button" aria-label={tr("Close dialog")} onClick={onClose}><Icon name="X" /></button> });return null;}
export function EmptyState({ icon = 'Search', title = 'No results found', description = 'Try another search.' }) {return <div className="empty-state"><div className="empty-icon"><Icon name={icon} size={24} /></div><h3>{tr(title)}</h3><p>{tr(description)}</p></div>;}
export function Status({ value = 'Live' }) {return <span className={`status status-${value.toLowerCase()}`}><i />{tr(value)}</span>;}
