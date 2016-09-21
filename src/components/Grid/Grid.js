import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'
import { DropTarget } from 'react-dnd'

function gridData(size) {
  // hardcoding size of 10 for now
  return [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
}

function gridCoordinate(position, gridSize) {
  return {
    x: Math.floor(position.x * gridSize),
    y: Math.floor(position.y * gridSize)
  }
}

function draggablePosition(monitor, component) {
  const { top, left, width, height } = findDOMNode(component).getBoundingClientRect()
  const offset = monitor.getClientOffset()
  const x = (offset.x - left) / width
  const y = (offset.y - top) / height
  return { x, y }
}

class Grid extends Component {
  state = {
    position: null
  }

  static defaultProps = {
    gridSize: 10,
  }

  render () {
    const el = ReactFauxDOM.createElement('svg')
    const enterLines = d3.select(el)
      // this one should be in CSS and more responsive than just 400x400
      .attr('width', '400px')
      .attr('height', '400px')
      .selectAll('line')
      .data(gridData())
      .enter()

    // render grid
    enterLines.append('line')
      .attr('stroke', 'black')
      .attr('x1', 0)
      .attr('y1', d => `${d}%`)
      .attr('x2', '100%')
      .attr('y2', d => `${d}%`)
    enterLines.insert('line')
      .attr('stroke', 'black')
      .attr('x1', d => `${d}%`)
      .attr('y1', 0)
      .attr('x2', d => `${d}%`)
      .attr('y2', '100%')
    
    // render dropped markers
    d3.select(el)
      .selectAll('circle')
      .data(this.props.droppedMarkers)
      .enter()
        .append('circle')
        .attr('cx', d => `${d.coordinates.x}5%`)
        .attr('cy', d => `${d.coordinates.y}5%`)
        .attr('r', '1%')
        .style('fill', 'red')

    // render marker hover indicator
    if (this.props.isOver) {
      const markerCoordinate = gridCoordinate(this.state.position, this.props.gridSize)

      d3.select(el).append('circle')
        .attr('cx', `${markerCoordinate.x}5%`)
        .attr('cy', `${markerCoordinate.y}5%`)
        .attr('r', '1%')
        .style('fill', '#ccc')
    }

    return this.props.connectDropTarget(el.toReact())
  }
}

const target = {
  drop(props, monitor, component) {
    props.onMarkerDrop({
      coordinates: gridCoordinate(draggablePosition(monitor, component), props.gridSize || Grid.defaultProps.gridSize),
      id: monitor.getItem().id
    })
  },

  hover(props, monitor, component) {
    const { x, y } = draggablePosition(monitor, component)
    if (component) {
      component.setState({ position: { x, y } })
    }
  }
}
const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  offset: monitor.getSourceClientOffset()
})
export default DropTarget('MARKER', target, collect)(Grid)
