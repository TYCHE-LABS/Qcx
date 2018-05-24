import React from 'react';
import { View, Dimensions } from 'react-native';
import { Slider, Text } from 'react-native-elements';
import {
  VictoryChart,
  VictoryAxis,
  VictoryZoomContainer,
  VictoryCandlestick,
  VictoryBrushContainer,
} from 'victory-native';
import _ from 'lodash';
import moment from 'moment';

//constants
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class ChartCandle extends React.PureComponent {
  constructor(props) {
    super();
    this.entireDomain = this.getEntireDomain(props);
    this.state = {
      zoomedXDomain: this.entireDomain.x,
      zoomedYDomain: this.entireDomain.y,
      maxPoints: props.maxPoints,
      sliderMax: props.sliderMax,
      dayTag: null,
    };
  }

  getEntireDomain(props) {
    const data = props.data;
    return {
      y: [_.minBy(data, datum => datum.close).y, _.maxBy(data, datum => datum.close).y],
      x: [data[0].time, _.last(data).time],
    };
  }

  getData() {
    const { zoomedXDomain, maxPoints } = this.state;
    const data = this.props.data;

    const filtered = data.filter(
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

  //label helper
  getXAxisLabel = t => {
    const dayTag = this.state.dayTag;
    if (dayTag) return moment(new Date(t)).format('D/M');
    return moment(new Date(t)).format('D/M ha');
  };

  onDomainChange = domain => {
    this.setState({
      zoomedXDomain: domain.x,
      zoomedYDomain: domain.y,
    });
  };

  //conditional rendering
  renderXAxisTitle = dayTag => {
    if (dayTag) return 'Time (day)';
    return 'Time (hour)';
  };

  renderSliderText = (dayTag, maxPoints) => {
    if (dayTag) return `overview: ${_.floor(maxPoints)} day segment`;
    return `overview: past ${_.floor(maxPoints)} hours`;
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.dayTag !== nextProps.dayTag) {
      //update max value state
      this.setState({
        maxPoints: nextProps.maxPoints,
        sliderMax: nextProps.sliderMax,
        dayTag: nextProps.dayTag,
      });
    }
  }

  render() {
    const {
      sliderMin,
      dayTag,
      crypto: { color },
    } = this.props;
    const { maxPoints, sliderMax } = this.state;
    return (
      <View>
        <VictoryChart
          width={SCREEN_WIDTH * 0.95}
          height={SCREEN_HEIGHT * 0.5}
          scale={{ x: 'time' }}
          domainPadding={{ y: 15, x: [5, 5] }}
          padding={styleObjects.containerPadding}
          onZoomDomainChange={this.onDomainChange}
          containerComponent={<VictoryZoomContainer responsive={false} zoomDimension="x" />}>
          <VictoryAxis
            label={this.renderXAxisTitle(dayTag)}
            padding={0}
            fixLabelOverlap
            tickCount={4}
            style={styleObjects.independentAxis}
            tickFormat={t => {
              return `${this.getXAxisLabel(t)}`;
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

          <VictoryCandlestick
            style={{ data: { stroke: color } }}
            candleColors={{ positive: 'green', negative: 'red' }}
            data={this.getData()}
            x="time"
            y="close"
          />
        </VictoryChart>

        <Text style={[styleObjects.sliderLabel, { color }]}>
          {this.renderSliderText(dayTag, maxPoints)}
        </Text>

        <Slider
          value={this.state.maxPoints}
          onValueChange={value => this.setState({ maxPoints: value })}
          minimumValue={sliderMin}
          maximumValue={sliderMax}
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
    tickLabels: { fill: 'white', padding: 5 },
  },
  sliderLabel: {
    textAlign: 'center',
    alignSelf: 'center',
    paddingTop: 10,
  },
};
