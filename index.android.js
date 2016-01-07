'use strict'

let React = require('react-native')
let {
  AppRegistry,
  ScrollView,
  StyleSheet,
  View,
  Image,
  ListView,
  TouchableHighlight,
  Text,
  Alert
  } = React

let RCTUIManager = require('NativeModules').UIManager

let styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 300
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
    borderRadius: 3,
    height: 100
  },
  icon: {
    alignItems: 'center',
    marginBottom: 10
  }
})

let LoadingImg = React.createClass({
  getInitialState: function() {
    return {
      show: true
    }
  },
  render: function() {
    let loadingStyle
    if(this.state.show == true){
      loadingStyle = {
        opacity: 1
      }
    }
    else {
      loadingStyle = {
        opacity: 0
      }
    }
    return (
      <View style={[loadingStyle, styles.icon]}>
        <Image source={require('./images/loading.gif')}>
        </Image>
      </View>
    )
  }
})

let Item = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false
  },
  render: function() {
    return (
      <View style={styles.button}>
        <Text style={styles.text}>
          {this.props.text}
        </Text>
      </View>
    )
  }
})

let createItemRow = (item, i) => <Item key={i} text={item.name} />

let requestLocked = false

let index = React.createClass({
  title: '<ScrollView>',
  description: 'To make content scrollable, wrap it within a <ScrollView> component',

  getInitialState: function() {console.log('begin')
    return {
      Items: [],
      viewHeight: 0,
      scrollViewHeight: 0
    }
  },

  componentWillMount: function() {
    this.getData('', (data) => {
      this.setState({Items: data.Items})
      this.refs.loadingImg.setState({show: false})
    })
  },

  getData: function(url, callback) {
    setTimeout(() => {callback(require('./mockdata/index.json'))}, 2000)
  },

  isReachedBottom: function(scrollOffset) {
    if(!requestLocked) {
      if(this.state.scrollViewHeight <= this.state.viewHeight + scrollOffset.y) {
        this.refs.loadingImg.setState({show: true})
        requestLocked = true
        this.getData('', (data) => {
          let Items = this.state.Items.concat(data.Items)
          this.setState({Items:Items})
          requestLocked = false
          this.refs.loadingImg.setState({show: false})
        })
      }
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
        onLayout={(evt) => {
          this.setState({viewHeight: evt.nativeEvent.layout.height})
          RCTUIManager.measure(this._scrollView.getInnerViewNode(), (...data) => { this.setState({scrollViewHeight: data[3]})})
        }}
        >
        {this.state.Items.map(createItemRow)}
        <LoadingImg ref="loadingImg"></LoadingImg>
      </ScrollView>
    )
  }
})

AppRegistry.registerComponent('weekly', () => index)
