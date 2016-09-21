import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import classes from './MarkerList.scss'

const spec = {
  endDrag(props, monitor) {
    console.log(monitor.getDropResult())
  },
  beginDrag(props) {
    return { id: props.id }
  }
}

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource()
}) 

// in ideal world where I have more time, those should be moved to separate component
class Marker extends Component {
  render() {
    return this.props.connectDragSource(
      <li className={this.props.isDropped ? classes.dropped : null}>
        {this.props.name} ({this.props.coordinates.x}, {this.props.coordinates.y})
      </li>
    )
  }
}
const ConnectedMarker = DragSource('MARKER', spec, collect)(Marker)

const isDropped = (marker, droppedMarkers) =>
  droppedMarkers.filter(droppedMarker => droppedMarker.id === marker.id).length > 0

const MarkerList = ({ markers, droppedMarkers }) => 
  <ul>
    {markers.map(marker => <ConnectedMarker isDropped={isDropped(marker, droppedMarkers)} key={marker.id} {...marker} />)}
  </ul>

export default MarkerList
