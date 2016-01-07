'use strict';

var React = require('react-native');
var {
  AppRegistry,
  ScrollView,
  StyleSheet,
  View,
  Image,
  ListView,
  TouchableHighlight,
  Text
  } = React;
var RCTUIManager = require('NativeModules').UIManager;

var styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 300
  },
  horizontalScrollView: {
    height: 120,
  },
  containerPage: {
    height: 50,
    width: 50,
    backgroundColor: '#527FE4',
    padding: 5,
  },
  text: {
    fontSize: 20,
    color: '#888888',
    left: 80,
    top: 20,
    height: 40,
  },
  button: {
    margin: 7,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,height:100
  },
  buttonContents: {
    flexDirection: 'row',
    width: 64,
    height: 64,
  },
  img: {
    width: 64,
    height: 64,
  }
})

var Thumb = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  render: function() {
    return (
      <View style={styles.button}>
        <Text style={styles.text}>
          {this.props.text}
        </Text>
      </View>
    );
  }
});

var createThumbRow = (item, i) => <Thumb key={i} text={item.name} />;

var index = React.createClass({
  title: '<ScrollView>',
  description: 'To make content scrollable, wrap it within a <ScrollView> component',
  getInitialState: function() {
    return {
      Items: [],
      viewHeight: 0,
      scrollViewHeight: 0
    }
  },
  componentWillMount: function() {
    var Items = this.getData()
    this.setState({Items: Items.Items})
  },
  componentDidMount: function() {
  },
  getData: function(url) {
    return require('./mockdata/index.json')
  },
  isReachedBottom: function(scrollOffset) {
    if(this.state.scrollViewHeight <= this.state.viewHeight + scrollOffset.y) {
      var Items = this.state.Items.concat(this.getData().Items)
      this.setState({Items:Items})
    }
  },
  render: function() {
    return (
      <ScrollView
        ref = {component=>{this._scrollView=component}}
        automaticallyAdjustContentInsets={false}
        onScroll={(event:Object) => {this.isReachedBottom(event.nativeEvent.contentOffset)}}
        scrollEventThrottle={1000}
        style={styles.scrollView}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(ev) => {}}
        onResponderMove={(ev) => {}}
        onLayout={(evt) => {
          this.setState({viewHeight: evt.nativeEvent.layout.height})
          RCTUIManager.measure(this._scrollView.getInnerViewNode(), (...data) => { this.setState({scrollViewHeight: data[3]})})
        }}
        >
        {this.state.Items.map(createThumbRow)}
      </ScrollView>
    );
  }
})

/*var touch = React.createClass({
  render: function() {
    return (
      <View>
        <View style={styles.button}
          onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={(evt) => {
          console.log(evt.nativeEvent)
        }}
              onResponderRelease={(evt) => {

        }}
          >
        </View>
      </View>
    )
  }
})*/
AppRegistry.registerComponent('weekly', () => index);
