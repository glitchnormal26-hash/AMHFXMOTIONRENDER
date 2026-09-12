import React from 'react';
import {Composition} from 'remotion';
import {HalloweenBorderGreen} from './HalloweenBorderGreen';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="HalloweenBorderGreen"
    component={HalloweenBorderGreen}
    durationInFrames={300}
    fps={30}
    width={1920}
    height={1080}
  />
);
