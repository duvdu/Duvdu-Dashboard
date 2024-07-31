import React, { useEffect, useRef, useState } from 'react'
import Lucide from '../../../base-components/Lucide';
import { Volume2, VolumeX } from 'lucide-react';

const convertDuration = (durationInMilliseconds:any) => {
    const totalSeconds = Math.floor(durationInMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedDuration;
  };
  
const isVideo = (coverUrl:any) => {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv'];
    const urlExtension = coverUrl?.split('.').pop().toLowerCase();
    return videoExtensions.includes(`.${urlExtension}`);
  };
export default function ProjectCard({item}:{item:any}) {
    const [soundIconName, setSoundIconName] = useState('volume-xmark');
    const [isMuted, setIsMuted] = useState(false);
    const [Duration, setDuration] = useState(0);
    const videoRef = useRef<any>(null);
    useEffect(() => {
      if (videoRef.current) {
        const timerId = setInterval(() => {
          if (videoRef.current?.duration) {
            setDuration(videoRef.current.duration);
            clearInterval(timerId);
          }
        }, 10)
      }
    }, [Number.isNaN(videoRef.current?.duration)]);
    
    const timeUpdate = () => {
      setDuration(videoRef.current.duration - videoRef.current.currentTime);
    }
    const handleSoundIconClick = () => {
      setIsMuted(soundIconName === 'volume-xmark' ? true : false)
      setSoundIconName(soundIconName === 'volume-xmark' ? 'volume-high' : 'volume-xmark')
      if (videoRef.current)
        videoRef.current.muted = soundIconName === 'volume-high';
    };
  
    const handleHover = () => {
      if (videoRef.current) {
        videoRef.current.play();
        videoRef.current.muted = !isMuted;
      }
    };
  
    const handleLeave = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setDuration(videoRef.current.duration);
      }

    };
  
    const isVideoCover = isVideo(item?.cover)
  return (
            <div
              key={item._id}
              className="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
            >
              <div className="box">
                <div className="p-5">
                  <div 
                    onMouseEnter={handleHover}
                    onMouseLeave={handleLeave}        
                  className="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
           {isVideoCover?
            <a>
                <video
                className='cardvideo'
                ref={videoRef}
                onTimeUpdate={timeUpdate}
                loop
                >
                <source src={item.cover} type='video/mp4' />
                </video>
                <div className="absolute right-3 bottom-3 bg-[#CADED333] rounded-full cursor-pointer py-1 px-3 z-10">
                    <span className="text-white">
                        {convertDuration(Duration * 1000)}
                    </span>
                </div>
                <div onClick={handleSoundIconClick} className="absolute right-3 top-3 bg-[#CADED333] rounded-full cursor-pointer py-1 px-3 z-10">
                    <span className="text-white">
                    {soundIconName === 'volume-xmark' ?<VolumeX />:<Volume2 />}
                    </span>
                </div>
            </a>
            :   
            <a>
                <img
                    alt="Midone - HTML Admin Template"
                    className="rounded-md"
                    src={item.cover}
                />
            </a>     
        }
                    <div className="absolute bottom-0 z-10 px-5 pb-3 text-white">
                      <a href="" className="block text-base font-medium">
                        {item.name}
                      </a>
                      <span className="mt-3 text-xs text-white/90">
                        {item.user.name}
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 text-slate-600 dark:text-slate-500">
                    <div className="flex items-center">
                      <Lucide icon="Link" className="w-4 h-4 mr-2" /> Address
                      : {item.address}
                    </div>
                    <div className="flex items-center mt-2">
                      <Lucide icon="Layers" className="w-4 h-4 mr-2" />
                      {item.user.name}
                    </div>
                    {/* <div className="flex items-center mt-2">
                      <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />{" "}
                      {item.projectScale.scale + " "}
                      {item.projectScale.time}
                    </div> */}
                  </div>
                </div>
                <div className="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400 hidden">
                  <a className="flex items-center mr-auto text-primary" >
                    <Lucide icon="Eye" className="w-4 h-4 mr-1" /> Preview
                  </a>
                </div>
                
              </div>
            </div>

    )
}
