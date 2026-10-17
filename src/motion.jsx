import React, { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, animate, motion, useInView, useIsPresent, useReducedMotion } from 'motion/react';
import './motion.css';

// Measured from the source app's shared motion configuration.
export const EASE_OUT = [0.16, 1, 0.3, 1];
export const SPRING_LAYOUT = { type: 'spring', stiffness: 360, damping: 32, mass: 0.6 };
export const SPRING_PANEL = { type: 'spring', stiffness: 420, damping: 40, mass: 0.5 };
export const SPRING_PRESS = { type: 'spring', stiffness: 500, damping: 30, mass: 0.6 };
export const SPRING_SWAP = { type: 'spring', stiffness: 460, damping: 30, mass: 0.55 };
export const SPRING_TABS = { type: 'spring', stiffness: 170, damping: 24, mass: 1.2 };
export const RISE = {
  hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: EASE_OUT } }
};
export const ROW = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } }
};
export const PAGE_STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
export const LIST_STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.035 } } };

function ReelDigit({ digit, delay, duration, blur, animateOnMount, className }) {
  const reduce = useReducedMotion();
  const strip = useRef(null);
  const previous = useRef(digit);
  const mounted = useRef(animateOnMount);
  useEffect(() => {
    const changed = previous.current !== digit;
    previous.current = digit;
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!changed || reduce || !blur || !strip.current) return;
    const element = strip.current;
    const controls = animate(element, { filter: ['blur(10px)', 'blur(0px)'] }, {
      duration: Math.min(duration * 0.75, 0.32), delay, ease: EASE_OUT
    });
    return () => {
      controls.stop();
      element.style.filter = 'blur(0px)';
    };
  }, [digit, delay, duration, blur, reduce]);
  return <span className={`number-reel-digit ${className || ''}`}>
    <motion.span ref={strip} className="number-reel-strip"
    initial={{ y: animateOnMount && !reduce ? 0 : `-${digit * 1.1}em` }}
    animate={{ y: `-${digit * 1.1}em` }}
    transition={reduce ? { duration: 0 } : { duration, delay, ease: EASE_OUT }}>
      {Array.from({ length: 10 }, (_, number) => <span key={number}>{number}</span>)}
    </motion.span>
  </span>;
}

export function NumberRoll({ value, delay = 0, duration = 0.9, stagger = 0.04, prefix, suffix,
  className = '', digitClassName, locale = 'en-US', format, pad, blur = false,
  startOnView = true, animateOnMount = true }) {
  const host = useRef(null);
  const visible = useInView(host, { once: true, amount: 0.6 });
  const [started, setStarted] = useState(!startOnView || !animateOnMount);
  const [settled, setSettled] = useState(!animateOnMount);
  const reduce = useReducedMotion();
  let displayed;
  if (format) displayed = String(format(Number(value)));else
  if (typeof value === 'number') displayed = locale ? Math.round(value).toLocaleString(locale) : String(Math.round(value));else
  displayed = String(value ?? '');
  if (pad) displayed = displayed.padStart(pad, '0');
  useEffect(() => {
    if (visible || reduce) setStarted(true);
  }, [visible, reduce]);
  useEffect(() => {
    if (!started || settled) return;
    const timer = window.setTimeout(() => setSettled(true), (duration + delay + displayed.length * stagger) * 1000);
    return () => window.clearTimeout(timer);
  }, [started, settled, duration, delay, displayed.length, stagger]);
  const characters = Array.from(displayed);
  return <span ref={host} className={`number-roll ${className}`}>
    <span className="motion-sr-only">{prefix}{displayed}{suffix}</span>
    <span aria-hidden="true" className="number-roll-visible">
      {prefix != null && <span>{prefix}</span>}
      {characters.map((character, index) => /\d/.test(character) ?
      <ReelDigit key={`place-${characters.length - index - 1}`} digit={started ? Number(character) : 0}
      delay={settled ? 0 : delay + index * stagger} duration={duration} blur={blur}
      animateOnMount={animateOnMount} className={digitClassName} /> :
      <span key={`place-${characters.length - index - 1}`}>{character}</span>)}
      {suffix != null && <span>{suffix}</span>}
    </span>
  </span>;
}

export function MotionPill({ layoutId, className = '', style, transition = SPRING_TABS }) {
  const reduce = useReducedMotion();
  return <motion.span aria-hidden="true" layoutId={layoutId} layout="position"
  transition={reduce ? { duration: 0 } : transition}
  className={`motion-pill ${className}`} style={style} />;
}

export function SwapText({ stateKey, children, className = '' }) {
  const reduce = useReducedMotion();
  return <motion.span layout={!reduce} transition={SPRING_SWAP} aria-live="polite"
  className={`motion-swap-text ${className}`}>
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span key={stateKey} className="motion-swap-item"
      initial={reduce ? { opacity: 0 } : { y: 14, opacity: 0, filter: 'blur(6px)' }}
      animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1, filter: 'blur(0px)' }}
      exit={reduce ? { opacity: 0 } : { y: -14, opacity: 0, filter: 'blur(6px)' }}
      transition={reduce ? { duration: 0.15 } : SPRING_SWAP}>{children}</motion.span>
    </AnimatePresence>
  </motion.span>;
}

function useHoverCapable() {
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setHover(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return hover;
}

export const MotionButton = forwardRef(function MotionButton({ pressScale = 0.99, disabled, children, ...props }, ref) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  return <motion.button ref={ref} type="button" disabled={disabled}
  whileTap={reduce || disabled ? undefined : { scale: pressScale }}
  whileHover={reduce || disabled || !canHover ? undefined : { scale: 1.01 }}
  transition={SPRING_PRESS} {...props}>{children}</motion.button>;
});

// Modal callers throughout the app conditionally mount their dialogs. Keeping the
// presence boundary here allows both the panel and backdrop to finish their exit.
const modalSubscribers = new Set();
let modalRecords = [];
const subscribeToModals = (callback) => {
  modalSubscribers.add(callback);
  return () => modalSubscribers.delete(callback);
};
const getModals = () => modalRecords;
function publishModals(records) {
  modalRecords = records;
  modalSubscribers.forEach((callback) => callback());
}

export function useModalRegistration(props) {
  const id = useId();
  useLayoutEffect(() => {
    const existing = modalRecords.find((record) => record.id === id);
    const record = { id, props, previousFocus: existing?.previousFocus ?? document.activeElement };
    publishModals(existing ? modalRecords.map((item) => item.id === id ? record : item) : [...modalRecords, record]);
  });
  useLayoutEffect(() => () => publishModals(modalRecords.filter((record) => record.id !== id)), [id]);
}

let modalLockCount = 0;
let previousBodyOverflow = '';
let previousRootInert = false;
let lockedRoot = null;
const focusableSelector = 'button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

function ModalShell({ record }) {
  const { title, description, children, onClose, className = '', renderClose } = record.props;
  const reduce = useReducedMotion();
  const isPresent = useIsPresent();
  const panel = useRef(null);
  const latestClose = useRef(onClose);
  latestClose.current = onClose;
  useEffect(() => {
    if (modalLockCount++ === 0) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      lockedRoot = document.getElementById('root');
      if (lockedRoot) {
        previousRootInert = lockedRoot.inert;
        lockedRoot.inert = true;
      }
    }
    const element = panel.current;
    const frame = requestAnimationFrame(() => {
      if (element && !element.contains(document.activeElement)) {
        (element.querySelector('[autofocus]') || element.querySelector(focusableSelector) || element).focus({ preventScroll: true });
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      if (--modalLockCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
        if (lockedRoot) lockedRoot.inert = previousRootInert;
        lockedRoot = null;
      }
      const activeModal = modalRecords.at(-1);
      const previousDialog = record.previousFocus?.closest?.('[data-modal-id]');
      if (record.previousFocus?.isConnected && (!activeModal || previousDialog?.dataset.modalId === activeModal.id)) {
        record.previousFocus.focus({ preventScroll: true });
      }
    };
  }, [record.id]);
  useEffect(() => {
    if (!isPresent) return;
    const onKeyDown = (event) => {
      if (modalRecords.at(-1)?.id !== record.id) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        latestClose.current?.();
      }
      if (event.key !== 'Tab' || !panel.current) return;
      const elements = [...panel.current.querySelectorAll(focusableSelector)].filter((element) => element.getClientRects().length && !element.closest('[inert]'));
      const first = elements[0],last = elements.at(-1);
      if (!first) {
        event.preventDefault();
        panel.current.focus();
      } else if (event.shiftKey && (document.activeElement === first || !panel.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [record.id, isPresent]);
  const outside = (event) => {
    if (isPresent && event.target === event.currentTarget && modalRecords.at(-1)?.id === record.id) latestClose.current?.();
  };
  return <div className="modal-overlay motion-modal-root" style={{ pointerEvents: isPresent ? undefined : 'none' }}>
    <motion.div className="motion-modal-backdrop" aria-hidden="true"
    initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: reduce ? { duration: 0 } : { duration: 0.15, ease: EASE_OUT } }}
    transition={reduce ? { duration: 0 } : { duration: 0.2, ease: EASE_OUT }} />
    <div className="motion-modal-viewport" onMouseDown={outside}>
      <div className="motion-modal-align" onMouseDown={outside}>
        <motion.section ref={panel} tabIndex={-1} layout="size" layoutDependency={children}
        className={`modal motion-modal-panel ${className}`} data-modal-id={record.id} role="dialog" aria-modal="true" aria-label={title}
        initial={reduce ? false : { opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : 6, scale: reduce ? 1 : 0.96,
          transition: reduce ? { duration: 0 } : { duration: 0.15, ease: EASE_OUT } }}
        transition={reduce ? { duration: 0 } : SPRING_PANEL}>
          <header><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{renderClose?.(onClose)}</header>
          {children}
        </motion.section>
      </div>
    </div>
  </div>;
}

export function ModalLayer() {
  const records = useSyncExternalStore(subscribeToModals, getModals, getModals);
  if (typeof document === 'undefined') return null;
  return createPortal(<AnimatePresence>{records.map((record) => <ModalShell key={record.id} record={record} />)}</AnimatePresence>, document.body);
}
