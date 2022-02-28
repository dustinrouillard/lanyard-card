import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { LanyardPresence } from './types/lanyard';
import { msToTime } from './utils/time';
import { Missing } from './icons/Missing';

interface ActivityProps {
  user: LanyardPresence;
}

export function Activity(props: ActivityProps) {
  const [timestamp, setTimestamp] = useState<number>(new Date().getTime());
  const [currentActivity, setCurrentActivity] = useState(props.user.activities.filter((activity) => activity.type == 0 && activity.timestamps)[0]);

  useEffect(() => {
    const activity = props.user.activities.filter((activity) => activity.type == 0 && activity.timestamps)[0];
    if (activity) {
      setCurrentActivity(activity);
      const int = setInterval(() => {
        setTimestamp(new Date().getTime() - activity.timestamps.start);
      }, 1000);

      return () => {
        clearInterval(int);
      };
    } else setCurrentActivity(null);
  }, [props.user]);

  return !!currentActivity ? (
    <Container>
      <ContainerHeading>Activity</ContainerHeading>
      <Content>
        <LeftSide>
          {currentActivity.assets && (
            <svg width="70" height="70" viewBox="0 0 70 70">
              <foreignObject x="0" y="0" width="70" height="70" mask={`url(#${!!currentActivity.assets?.small_image ? 'svg-mask-activity-image' : ''})`}>
                <ActivityImage
                  src={
                    currentActivity.assets.large_image.startsWith('mp:external')
                      ? currentActivity.assets.large_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, '$2:/')
                      : `https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.large_image}.webp`
                  }
                />
              </foreignObject>
            </svg>
          )}
          {!currentActivity.assets && <Missing width={70} height={70} />}
          {currentActivity.assets?.small_image && (
            <ActivitySmallImage
              src={
                currentActivity.assets.small_image.startsWith('mp:external')
                  ? currentActivity.assets.small_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, '$2:/')
                  : `https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.small_image}.webp`
              }
            />
          )}
        </LeftSide>
        <RightSide>
          <ActivityName>{currentActivity.name}</ActivityName>
          {currentActivity.details && (
            <ActivityDetails>{currentActivity.details.length > 27 ? `${currentActivity.details.substring(0, 27).trim()}...` : currentActivity.details}</ActivityDetails>
          )}
          {currentActivity.state && (
            <ActivityState>{currentActivity.state.length > 27 ? `${currentActivity.state.substring(0, 27).trim()}...` : currentActivity.state}</ActivityState>
          )}
          {timestamp && <ActivityTimestamp>{msToTime(timestamp)} elapsed</ActivityTimestamp>}
        </RightSide>
      </Content>
    </Container>
  ) : (
    <></>
  );
}

const Container = styled.div`
  margin: 0 15px 0 15px;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContainerHeading = styled.h3`
  font-size: 14px;
  opacity: 0.6;
  margin-bottom: 10px;
`;

const LeftSide = styled.div`
  display: flex;
  position: relative;
  align-self: flex-start;
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ActivityImage = styled.img<{ mask?: boolean }>`
  width: 70px;
  height: 70px;
  /* mask: ${({ mask }) => (mask ? `url(#svg-mask-activity-image)` : '')}; */
  mask-size: cover;
`;

const ActivitySmallImage = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  bottom: -4px;
  right: -4px;
`;

const ActivityName = styled.h3`
  font-size: 12px;
  margin: 0 0 0 10px;
`;

const ActivityDetails = styled.h3`
  font-size: 12px;
  margin: 3px 0 0 10px;
`;

const ActivityState = styled.h3`
  font-size: 12px;
  margin: 3px 0 0 10px;
`;

const ActivityTimestamp = styled.h3`
  font-size: 10px;
  margin: 3px 0 0 10px;
`;
