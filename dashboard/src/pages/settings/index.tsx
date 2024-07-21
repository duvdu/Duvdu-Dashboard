import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import fakerData from '../../utils/faker';
import Button from '../../base-components/Button';
import { FormInput } from '../../base-components/Form';
import Lucide from '../../base-components/Lucide';
import Tippy from '../../base-components/Tippy';
import { ActionUpdateProfile } from '../../redux/action/api/settings/profile/update';
import { useAppDispatch, useAppSelector } from '../../redux/stores/hooks';
import { StateUpdateProfile } from '../../redux/stores/api/settings/profile/update';
import Notification, { NotificationElement } from '../../base-components/Notification';

export default function Settings() {
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const stateUpdateProfile = useAppSelector(StateUpdateProfile);
  const basicNonStickyNotification = useRef<NotificationElement>();
  const basicNonStickyNotificationToggle = () => {
      // Show notification
      basicNonStickyNotification.current?.showToast();
    };
    useEffect(()=>{
        if(stateUpdateProfile?.data)
    basicNonStickyNotificationToggle()
            
      },[stateUpdateProfile?.data])
  
  const onUpdatePhoto = () => {
    if (profile) {
      const formData = new FormData();
      formData.append('profile', profile);
      dispatch(ActionUpdateProfile(formData));
    }
  };

  const onUpdateCover = () => {
    if (cover) {
      const formData = new FormData();
      formData.append('cover', cover);
      dispatch(ActionUpdateProfile(formData))
  };
    }

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setProfile(file);
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setCover(file);
  };

  return (
    <>
      <Notification
        id="success-notification-content"
        className="flex"
        getRef={(el) => {
            basicNonStickyNotification.current = el;
          }}
          options={{
            duration: 3000,
          }}
        >
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
            <div className="font-medium">Successfully Updated!</div>
        </div>
        </Notification>
    <div className="intro-y box lg:mt-5">
      <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
        <h2 className="mr-auto text-base font-medium">Default Settings</h2>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-10">
            <div className="col-span-12 gap-x-5">
              <div className="mx-auto w-full">
                <div className="p-5 border-2 border-dashed rounded-md shadow-sm border-slate-200/60 dark:border-darkmode-400">
                  <div className="relative h-40 mx-auto cursor-pointer image-fit zoom-in">
                    <FormInput
                      type="file"
                      className="absolute top-0 left-0 w-full h-full opacity-0"
                      onChange={handleCoverChange}
                    />
                    {cover ? (
                      <img className="rounded-md" alt="Cover" src={URL.createObjectURL(cover)} />
                    ) : (
                      <p className="text-center">Set Default Cover</p>
                    )}
                  </div>
                  <div className="relative mx-auto mt-5 cursor-pointer">
                    <Button type="button" className="w-full" onClick={onUpdateCover}>
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="p-5 border-2 border-dashed rounded-md shadow-sm border-slate-200/60 dark:border-darkmode-400">
              <div className="relative h-40 mx-auto cursor-pointer image-fit zoom-in">
                <FormInput
                  type="file"
                  className="absolute top-0 left-0 w-full h-full opacity-0"
                  onChange={handleProfileChange}
                />
                {profile ? (
                  <img className="rounded-md" alt="Profile" src={URL.createObjectURL(profile)} />
                ) : (
                  <p className="text-center">Set Default Profile</p>
                )}
              </div>
              <div className="relative mx-auto mt-5 cursor-pointer">
                <Button type="button" className="w-full" onClick={onUpdatePhoto}>
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
