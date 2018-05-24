import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Slider, Text } from 'react-native-elements';
import { VictoryChart, VictoryAxis, VictoryLine, VictoryZoomContainer } from 'victory-native';
import _ from 'lodash';
import moment from 'moment';

//constants
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class ChartLine extends React.PureComponent {
  constructor(props) {
    super();
    this.entireDomain = this.getEntireDomain(props);
    this.state = {
      zoomedXDomain: this.entireDomain.x,
      maxPoints: 60,
    };
  }

  getEntireDomain(props) {
    const data = props.crypto.historicalData;
    return {
      y: [_.minBy(data, datum => datum.close).y, _.maxBy(data, datum => datum.close).y],
      x: [data[0].time, _.last(data).time],
    };
  }

  //get specific subset of data based on the max points
  getData() {
    const { zoomedXDomain, maxPoints } = this.state;
    const dataByMinute = this.props.crypto.historicalData;
    const filtered = dataByMinute.filter(
      // is d "between" the ends of the visible x-domain?
      data => {
        return data.time >= zoomedXDomain[0] && data.time <= zoomedXDomain[1];
      }
    );

    //rendering smaller sample of points, maxPoints passed in
    if (filtered.length > maxPoints) {
      const k = Math.ceil(filtered.length / maxPoints);

      return filtered.filter((data, index) => index % k === 0);
    }

    return filtered;
  }

  onDomainChange = domain => {
    this.setState({
      zoomedXDomain: domain.x,
    });
  };

  render() {
    const crypto = this.props.crypto;
    const color = crypto.color;

    return (
      <View>
        <VictoryChart
          width={SCREEN_WIDTH * 0.95}
          height={SCREEN_HEIGHT * 0.5}
          scale={{ x: 'time' }}
          domainPadding={styleObjects.containerDomainPadding}
          padding={styleObjects.containerPadding}
          onZoomDomainChange={this.onDomainChange}
          containerComponent={<VictoryZoomContainer responsive={false} zoomDimension="x" />}>
          <VictoryAxis
            label="Time (min)"
            padding={0}
            fixLabelOverlap
            tickCount={4}
            style={styleObjects.independentAxis}
            tickFormat={t => {
              const date = new Date(t);
              return `${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') +
                date.getMinutes()}`;
            }}
          />

          <VictoryAxis
            dependentAxis
            padding={0}
            style={styleObjects.dependentAxis}
            fixLabelOverlap
            tickFormat={t => {
              return `${_.ceil(t, 5)}`;
            }}
          />

          <VictoryLine
            style={{
              data: { stroke: color },
            }}
            interpolation="cardinal"
            data={this.getData()}
            x="time"
            y="close"
            animate={{
              duration: 3000,
              onLoad: { duration: 500 },
            }}
          />
        </VictoryChart>

        <Text style={[styleObjects.sliderLabel, { color }]}>
          overview: past 24 hours in {_.floor(this.state.maxPoints)} minutes segments
        </Text>

        <Slider
          value={this.state.maxPoints}
          onValueChange={value => this.setState({ maxPoints: value })}
          minimumValue={5}
          maximumValue={120}
          thumbTintColor={color}
        />
      </View>
    );
  }
}

//Not using stylesheets in order to pass in pure objects for victory charts
const styleObjects = {
  containerPadding: {
    top: 8,
    bottom: 50,
    left: 45,
    right: 35,
  },
  containerDomainPadding: {
    y: 15,
    x: [5, 5],
  },
  dependentAxis: {
    axis: { stroke: 'white' },
    tickLabels: { fill: 'white' },
    padding: 5,
  },
  independentAxis: {
    axis: { stroke: 'white' },
    axisLabel: { fontSize: 20, padding: 30, fill: 'white' },
    tickLabels: { fill: 'white', padding: 8 },
  },
  sliderLabel: {
    textAlign: 'center',
    alignSelf: 'center',
    paddingTop: 10,
  },
};
