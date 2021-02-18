import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import request from '../../../../helper/functions/request';

export default function CampaignInfo({ campaign, propertyId, isLive }) {
  const [nextInspection, setNextInspection] = React.useState(null);
  const [closed, setClosed] = React.useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await request({
          url: `/properties/${propertyId}/inspection-times`,
          config: {
            method: 'GET',
          },
        });

        dayjs.extend(utc);

        const next = data
          .map(inspection => {
            return dayjs.utc(inspection.inspection_date_time);
          })
          .sort(dates => {
            return dates.valueOf();
          })
          .find(dates => {
            return dates.isAfter();
          });

        if (next) {
          setNextInspection(dayjs(next).format('ddd D MMM'));
        } else {
          setClosed(true);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [propertyId, isLive]);

  if (!nextInspection) {
    return <View />;
  }

  return (
    <View>
      {!closed && isLive && <Text style={styles.text}>Open {nextInspection} | Available Now</Text>}
      {!closed && !isLive && <Text style={styles.text}>Open {nextInspection}</Text>}
      {closed && <Text style={styles.text}>Closed</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'font-light',
    paddingVertical: 3,
  },
});
