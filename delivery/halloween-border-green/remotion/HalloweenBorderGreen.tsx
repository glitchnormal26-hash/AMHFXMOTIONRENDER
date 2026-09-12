import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';

const GREEN = '#00FF00';
const ORANGE = '#FF6A00';
const PURPLE = '#7D2AE8';
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const Web: React.FC<{corner: 'tl' | 'tr'}> = ({corner}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 28) * 2.5;
  const flip = corner === 'tr';
  return (
    <svg width="330" height="250" viewBox="0 0 330 250" style={{position:'absolute',top:0,[flip?'right':'left']:0,scale:flip?'-1 1':'1 1',opacity:0.9,zIndex:5,translate:`0px ${drift}px`}}>
      <g fill="none" stroke="#D8C8E6" strokeWidth="3" opacity="0.72">
        <path d="M0 0 L310 0 M0 0 L270 88 M0 0 L225 166 M0 0 L148 236" />
        <path d="M73 0 Q69 29 57 47 Q93 44 112 60 Q121 29 121 0" />
        <path d="M126 0 Q118 56 96 84 Q154 78 184 103 Q198 53 196 0" />
        <path d="M187 0 Q178 83 145 123 Q217 117 250 150 Q274 80 273 0" />
      </g>
      <circle cx="49" cy="42" r="5" fill="#C9B5D9" opacity="0.8" />
    </svg>
  );
};

const Bat: React.FC<{x:number;y:number;s:number;phase:number}> = ({x,y,s,phase}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 15 + phase) * 10;
  const flap = 0.82 + Math.sin(frame / 4.5 + phase) * 0.12;
  const tilt = Math.sin(frame / 25 + phase) * 7;
  return (
    <svg width={120*s} height={64*s} viewBox="0 0 120 64" style={{position:'absolute',left:x,top:y,translate:`0px ${bob}px`,rotate:`${tilt}deg`,zIndex:6}}>
      <g fill="#120916" stroke="#6A2C85" strokeWidth="2" opacity="0.97">
        <path d={`M58 34 C43 ${17*flap}, 24 ${12*flap}, 6 20 C16 25, 18 36, 12 49 C31 45, 44 51, 58 43 Z`} />
        <path d={`M62 34 C77 ${17*flap}, 96 ${12*flap}, 114 20 C104 25, 102 36, 108 49 C89 45, 76 51, 62 43 Z`} />
        <ellipse cx="60" cy="38" rx="8" ry="12" />
        <path d="M56 29 L58 20 L62 29 L66 21 L68 31" />
      </g>
      <circle cx="57" cy="35" r="1.8" fill="#FF7A00" />
      <circle cx="63" cy="35" r="1.8" fill="#FF7A00" />
    </svg>
  );
};

const ThornVine: React.FC<{side:'left'|'right'}> = ({side}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 36 + (side === 'left' ? 0 : 1.5)) * 7;
  const right = side === 'right';
  return (
    <svg width="250" height="1080" viewBox="0 0 250 1080" style={{position:'absolute',top:0,[right?'right':'left']:0,scale:right?'-1 1':'1 1',translate:`${sway}px 0px`,zIndex:4}}>
      <defs><linearGradient id={`vine-${side}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#26102E"/><stop offset="0.55" stopColor="#0E0711"/><stop offset="1" stopColor="#3E174D"/></linearGradient></defs>
      <path d="M18 1110 C88 968 36 858 126 756 C184 690 130 584 78 513 C18 431 99 315 148 249 C198 181 153 87 82 -25" fill="none" stroke={`url(#vine-${side})`} strokeWidth="42" strokeLinecap="round" />
      <g fill="#1A0C1F" opacity="0.96"><path d="M76 900 l82 -64 l-48 83 z"/><path d="M52 715 l89 -55 l-57 78 z"/><path d="M101 568 l88 -51 l-60 74 z"/><path d="M90 385 l92 -47 l-66 72 z"/><path d="M132 210 l83 -40 l-59 65 z"/></g>
      <g fill={PURPLE} opacity="0.28"><circle cx="82" cy="925" r="13"/><circle cx="104" cy="548" r="10"/><circle cx="124" cy="202" r="12"/></g>
    </svg>
  );
};

const BottomFog: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = Math.sin(frame / 32) * 42;
  return <div style={{position:'absolute',left:-160,right:-160,bottom:-40,height:270,overflow:'hidden',zIndex:3}}><div style={{position:'absolute',inset:0,translate:`${shift}px 0px`,filter:'blur(25px)',opacity:0.62,background:'radial-gradient(ellipse at 12% 72%, rgba(190,168,210,.7) 0 11%, transparent 28%), radial-gradient(ellipse at 35% 85%, rgba(108,75,128,.6) 0 14%, transparent 31%), radial-gradient(ellipse at 60% 76%, rgba(214,195,225,.58) 0 12%, transparent 29%), radial-gradient(ellipse at 86% 82%, rgba(122,84,145,.6) 0 14%, transparent 32%)'}}/></div>;
};

const Pumpkin: React.FC<{position:[number,number,number];scale:number;phase:number;mirror?:boolean}> = ({position,scale,phase,mirror}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cycle = (frame/(fps*10))*Math.PI*2;
  const bob = Math.sin(cycle*2+phase)*0.12;
  const rotY = Math.sin(cycle+phase)*0.22+(mirror?-0.12:0.12);
  const glow = 0.55+Math.sin(cycle*3+phase)*0.12;
  const lobes=[-0.72,-0.36,0,0.36,0.72];
  return <group position={[position[0],position[1]+bob,position[2]]} scale={scale} rotation={[0.04,rotY,mirror?-0.05:0.05]}>
    {lobes.map((x,i)=><mesh key={x} position={[x*0.52,0,Math.abs(i-2)*-0.055]} scale={[0.72,1,0.7]} castShadow receiveShadow><sphereGeometry args={[0.82,32,24]}/><meshStandardMaterial color={ORANGE} roughness={0.46} metalness={0.04} emissive="#5A1600" emissiveIntensity={glow}/></mesh>)}
    <mesh position={[0,0.92,0]} rotation={[0,0,0.08]}><cylinderGeometry args={[0.14,0.22,0.62,10]}/><meshStandardMaterial color="#293914" roughness={0.8}/></mesh>
    <mesh position={[-0.29,0.17,0.77]} rotation={[Math.PI/2,0,0.18]}><coneGeometry args={[0.16,0.28,3]}/><meshBasicMaterial color="#FFD266"/></mesh>
    <mesh position={[0.29,0.17,0.77]} rotation={[Math.PI/2,0,-0.18]}><coneGeometry args={[0.16,0.28,3]}/><meshBasicMaterial color="#FFD266"/></mesh>
    <mesh position={[0,-0.2,0.77]} rotation={[Math.PI/2,0,Math.PI]} scale={[1.1,0.52,1]}><coneGeometry args={[0.26,0.36,3]}/><meshBasicMaterial color="#FFB333"/></mesh>
    <pointLight color="#FF7A00" intensity={1.6+glow} distance={4.5} position={[0,0.1,1.35]}/>
  </group>;
};

const ThreeBorder: React.FC = () => {
  const frame=useCurrentFrame();
  const {width,height,fps}=useVideoConfig();
  const cycle=(frame/(fps*10))*Math.PI*2;
  const cameraX=Math.sin(cycle)*0.08;
  const cameraY=Math.cos(cycle)*0.05;
  return <ThreeCanvas width={width} height={height} camera={{fov:36,position:[cameraX,cameraY,12]}} style={{position:'absolute',inset:0,zIndex:7}} gl={{alpha:true,antialias:true,outputColorSpace:THREE.SRGBColorSpace}}>
    <ambientLight intensity={1.25}/><directionalLight color="#FFF1D5" intensity={2.1} position={[2,5,6]}/><directionalLight color="#7D2AE8" intensity={1.0} position={[-5,1,3]}/>
    <Pumpkin position={[-5.45,-2.86,0]} scale={1.18} phase={0.2}/><Pumpkin position={[5.45,-2.82,0]} scale={1.12} phase={1.7} mirror/><Pumpkin position={[-5.95,2.65,-1.1]} scale={0.62} phase={2.8}/><Pumpkin position={[5.95,2.62,-1.1]} scale={0.58} phase={4.3} mirror/>
    <fog attach="fog" args={['#120916',14,24]}/>
  </ThreeCanvas>;
};

export const HalloweenBorderGreen: React.FC = () => {
  const frame=useCurrentFrame();
  const intro=interpolate(frame,[0,18],[0,1],{...clamp,easing:Easing.out(Easing.cubic)});
  const pulse=0.55+Math.sin(frame/17)*0.13;
  const topGlowX=Math.sin(frame/42)*120;
  return <AbsoluteFill style={{backgroundColor:GREEN,overflow:'hidden'}}><AbsoluteFill style={{opacity:intro}}>
    <div style={{position:'absolute',left:0,right:0,top:0,height:188,zIndex:1,background:'linear-gradient(180deg, #0B0610 0%, #1B0A23 66%, rgba(27,10,35,0) 100%)'}}/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:215,zIndex:1,background:'linear-gradient(0deg, #08040D 0%, #1A0921 70%, rgba(26,9,33,0) 100%)'}}/>
    <div style={{position:'absolute',left:0,top:0,bottom:0,width:240,zIndex:1,background:'linear-gradient(90deg, #09050D 0%, #17091D 72%, rgba(23,9,29,0) 100%)'}}/>
    <div style={{position:'absolute',right:0,top:0,bottom:0,width:240,zIndex:1,background:'linear-gradient(-90deg, #09050D 0%, #17091D 72%, rgba(23,9,29,0) 100%)'}}/>
    <div style={{position:'absolute',left:250,right:250,top:72,height:5,borderRadius:10,zIndex:2,opacity:pulse,background:'linear-gradient(90deg, transparent, #7D2AE8, #FF6A00, #7D2AE8, transparent)',boxShadow:'0 0 26px rgba(125,42,232,.55)'}}/>
    <div style={{position:'absolute',left:310+topGlowX,top:94,width:280,height:48,borderRadius:'50%',zIndex:2,filter:'blur(25px)',opacity:0.28,background:'#FF6A00'}}/>
    <Web corner="tl"/><Web corner="tr"/><ThornVine side="left"/><ThornVine side="right"/><BottomFog/>
    <Bat x={620} y={55} s={0.82} phase={0.1}/><Bat x={910} y={74} s={0.64} phase={1.4}/><Bat x={1200} y={46} s={0.76} phase={2.5}/>
    <ThreeBorder/>
    <div style={{position:'absolute',left:258,right:258,top:178,bottom:178,zIndex:20,backgroundColor:GREEN,boxShadow:'0 0 0 4px rgba(44,13,54,.95), 0 0 0 9px rgba(255,106,0,.32), 0 0 42px rgba(125,42,232,.28)'}}/>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,zIndex:21,pointerEvents:'none'}}><g fill="none" strokeLinecap="round"><path d="M259 178 H560" stroke="#FF6A00" strokeWidth="5" opacity="0.68"/><path d="M1360 178 H1661" stroke="#7D2AE8" strokeWidth="5" opacity="0.72"/><path d="M259 902 H560" stroke="#7D2AE8" strokeWidth="5" opacity="0.72"/><path d="M1360 902 H1661" stroke="#FF6A00" strokeWidth="5" opacity="0.68"/></g></svg>
  </AbsoluteFill></AbsoluteFill>;
};
