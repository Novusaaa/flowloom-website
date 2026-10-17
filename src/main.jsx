import React from 'react';
import {createRoot} from 'react-dom/client';
import {MotionConfig} from 'motion/react';
import {ModalLayer} from './motion';
import Marketing from './Marketing';
import './styles.css';
import './root-motion.css';
createRoot(document.getElementById('root')).render(<MotionConfig reducedMotion='user'><Marketing/><ModalLayer/></MotionConfig>);
