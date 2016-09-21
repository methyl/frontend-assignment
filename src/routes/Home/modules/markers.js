export const DROP_MARKER = 'DROP_MARKER'

export function dropMarker({ id, coordinates }) {
  return {
    type: DROP_MARKER,
    payload: { id, coordinates }
  }
}

const markers = [
  { id: 1, name: "A marker", coordinates: { x: 0, y: 1 }},
  { id: 2, name: "Another marker", coordinates: { x: 1, y: 2 }},
  { id: 3, name: "One more marker", coordinates: { x: 4, y: 5 }},
  { id: 4, name: "Marker!", coordinates: { x: 4, y: 6 }}
]

export function markersReducer(state = markers) {
  return state
}

const ACTION_HANDLERS = {
  [DROP_MARKER]: (state, action) => [].concat(state, action.payload)
}

export function droppedMarkersReducer(state = [], action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}