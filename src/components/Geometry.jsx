import React, { useEffect, useRef } from "react"
import * as $3Dmol from "3dmol/build/3Dmol.js"
import styles from "./Geometry.module.scss"

const Geometry = ({ xyzData, disableInteraction = false }) => {
  const viewerRef = useRef(null)

  useEffect(() => {
    const viewer = $3Dmol.createViewer(viewerRef.current, {
      backgroundColor: "white",
    })

    viewer.addModel(xyzData, "xyz")
    viewer.setStyle({}, { sphere: { radius: 0.5 } })
    viewer.zoomTo()
    viewer.render()

    // cleanup on unmount
    return () => {
      if (viewer) viewer.clear()
      if (viewerRef.current) viewerRef.current.innerHTML = ""
    }
  }, [xyzData])

  return (
    <div
      ref={viewerRef}
      className={styles.container}
      style={{ pointerEvents: disableInteraction ? "none" : undefined }}
    />
  )
}

export default Geometry
