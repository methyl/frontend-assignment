import React, { Component } from 'react'
import DuckImage from '../assets/Duck.jpg'
import classes from './HomeView.scss'
import Grid from 'components/Grid'
import Sidebar from 'components/Sidebar'
import MarkerList from 'components/MarkerList'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { connect } from 'react-redux'
import { dropMarker } from '../modules/markers'
import { every } from 'lodash'

function checkResult(markers, droppedMarkers) {
  return every(markers, (marker) => {
    const droppedMarker = droppedMarkers.filter(droppedMarker => droppedMarker.id === marker.id)[0]
    return droppedMarker.coordinates.x === marker.coordinates.x &&
           droppedMarker.coordinates.y === marker.coordinates.y
  })
}

class HomeView extends Component {
  state = {
    displayResult: false,
  }

  handleCheckButtonClick = () =>
    this.setState({ displayResult: true })

  renderResult() {
    return <h4>You are {checkResult(this.props.markers, this.props.droppedMarkers) ? 'correct' : 'incorrect'}</h4>
  }

  render () {
    return (
      <div>
        {this.state.displayResult ? this.renderResult() : null}
        <div className={classes.root}>
          <Sidebar>
            {this.props.markers ? <MarkerList droppedMarkers={this.props.droppedMarkers} markers={this.props.markers} /> : null}
          </Sidebar>
          <div className={classes.grid}>
            <Grid onMarkerDrop={this.props.dropMarker} droppedMarkers={this.props.droppedMarkers} />
          </div>
        </div>
        <button 
          onClick={this.handleCheckButtonClick} 
          disabled={this.props.markers.length != this.props.droppedMarkers.length}
        >
          Check
        </button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    markers: state.markers,
    droppedMarkers: state.droppedMarkers,
  }
}

// leaving connect here for now, should be moved to separate container
export default connect(mapStateToProps, { dropMarker })(DragDropContext(HTML5Backend)(HomeView))
