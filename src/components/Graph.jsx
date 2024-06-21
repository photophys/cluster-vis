import React, { useEffect, useRef } from "react"
import CytoscapeComponent from "react-cytoscapejs"

const createGraphElements = (vertices, edges) => [
  ...vertices.map((v, i) => ({ data: { id: i.toString(), label: v } })),
  ...edges.map((e, i) => ({
    data: { source: (e[0] - 1).toString(), target: (e[1] - 1).toString() },
  })),
]

const Graph = ({ vertices, edges }) => {
  const cyRef = useRef(null)

  const style = [
    {
      selector: "node",
      style: {
        width: "60px",
        height: "60px",
        "background-color": "#1677ff",
        label: "data(label)",
        color: "#fff",
        "text-valign": "center",
        "text-halign": "center",
        events: "no",
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "#1677ff",
        "target-arrow-color": "#1677ff",
        "curve-style": "bezier",
      },
    },
  ]

  const elements = createGraphElements(vertices, edges)

  const layout = {
    name: "cose", // layout algorithm
    idealEdgeLength: 25, // edge length factor
    nodeOverlap: 20, // prevents node overlap, may overflow boundingBox if not enough space
    refresh: 5, // number of ticks before it redraws the graph (=> higher is faster)
    fit: true, // whether to fit to viewport
    padding: 5, // padding on fit
    randomize: false, // randomize the initial positions of the nodes
    componentSpacing: 50, // extra spacing between components
    nodeRepulsion: 1000000, // node repulsion (non overlapping) multiplier
    edgeElasticity: 100, // elastic edge constraints
    nestingFactor: 5, // factor to multiply the ideal edge length by before running the spring algorithm
    gravity: 80, // the gravity force (constant)
    numIter: 30000, // maximum number of iterations to perform
    initialTemp: 200, // initial temperature (=> maximum node displacement)
    coolingFactor: 0.95,
    minTemp: 1.0, // minimum temperature threshold
  }

  useEffect(() => {
    if (cyRef.current && vertices && edges) {
      // disable zooming
      cyRef.current.userZoomingEnabled(false)

      // disable panning
      cyRef.current.userPanningEnabled(false)

      // disable box selection
      cyRef.current.boxSelectionEnabled(false)

      // disable clicking on nodes and edges
      cyRef.current.on("tap", "node", (event) => {
        event.preventDefault()
      })
      cyRef.current.on("tap", "edge", (event) => {
        event.preventDefault()
      })

      // disable drag-and-drop
      cyRef.current.nodes().grabify(false)

      // adjust font size
      cyRef.current.nodes().style({ "font-size": "3em" })

      cyRef.current.layout(layout).run()
    }

    return () => (cyRef.current.innerHTML = "")
  }, [edges, vertices])

  return (
    <CytoscapeComponent
      cy={(cy) => {
        cyRef.current = cy
      }}
      elements={elements}
      style={{ width: "400px", height: "300px", pointerEvents: "none" }}
      stylesheet={style}
      layout={layout}
    />
  )
}

export default Graph
