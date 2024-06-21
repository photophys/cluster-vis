import React, { useState } from "react"

import { App, Button, Form, Layout, Pagination, Switch, theme } from "antd"
const { Content } = Layout

import { FileOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons"

import Header from "./components/Header"
import Uploader from "./components/Uploader"
import Graph from "./components/Graph"
import Geometry from "./components/Geometry"

import styles from "./App.module.scss"

const ZoomSwitch = ({
  isGeomInteractionDisabled,
  setGeomInteractionDisabled,
}) => (
  <Form.Item label="Enable zooming/panning">
    <Switch
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
      checked={!isGeomInteractionDisabled}
      onChange={(checked) => setGeomInteractionDisabled(!checked)}
    />
  </Form.Item>
)

function ClusterVisApp() {
  const [filename, setFilename] = useState(null)
  const [geometries, setGeometries] = useState([])
  const [graphVertices, setGraphVertices] = useState([])
  const [graphEdges, setGraphEdges] = useState([])
  const [groups, setGroups] = useState([])
  const [uniques, setUniques] = useState([])

  const loaderProps = {
    setFilename,
    setGeometries,
    setGraphVertices,
    setGraphEdges,
    setGroups,
    setUniques,
  }

  const [currentGroup, setCurrentGroup] = useState(0)

  const [mode, setMode] = useState(1)
  const [isGeomInteractionDisabled, setGeomInteractionDisabled] = useState(true)
  const [numShow, setNumShow] = useState(5)

  const zoomSwitchProps = {
    isGeomInteractionDisabled,
    setGeomInteractionDisabled,
  }

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const currentIdx = () => groups[currentGroup][0]

  return (
    <App>
      <Layout>
        <Layout>
          <Header setMode={setMode} />
          <Content>
            <div
              style={{
                background: colorBgContainer,
                minHeight: 280,
                padding: 24,
                borderRadius: borderRadiusLG,
              }}
            >
              {filename === null ? (
                <Uploader {...loaderProps} />
              ) : (
                <>
                  <div className={styles.fileInfo}>
                    <FileOutlined />
                    <code>{filename}</code>
                    <Button onClick={() => window.location.reload()}>
                      close
                    </Button>
                  </div>

                  {mode === 1 && (
                    <>
                      <Pagination
                        defaultCurrent={1}
                        current={currentGroup + 1}
                        total={groups.length}
                        defaultPageSize={1}
                        onChange={(page) => {
                          setCurrentGroup(page - 1)
                          setNumShow(5)
                        }}
                      />

                      <div
                        style={{
                          margin: "15px 0",
                          display: "flex",
                          gap: "15px",
                        }}
                      >
                        <Button
                          onClick={() => setNumShow((prev) => prev + 5)}
                          disabled={numShow >= groups[currentGroup].length}
                        >
                          show more
                        </Button>
                        <ZoomSwitch {...zoomSwitchProps} />
                      </div>

                      <div className={styles.grid}>
                        <Graph
                          vertices={
                            graphVertices.find(
                              (obj) => obj.idx === currentIdx()
                            ).v
                          }
                          edges={
                            graphEdges.find((obj) => obj.idx === currentIdx())
                              .graph
                          }
                        />

                        {groups[currentGroup]
                          .map((i) => geometries.find((g) => g.idx === i))
                          .slice(0, numShow)
                          .map((data, j) => (
                            <div key={j}>
                              <Geometry
                                xyzData={data.xyz}
                                disableInteraction={isGeomInteractionDisabled}
                              />
                              <p>structure {data.idx}</p>
                            </div>
                          ))}
                      </div>
                    </>
                  )}

                  {mode === 2 && (
                    <>
                      <div
                        style={{
                          margin: "15px 0",
                          display: "flex",
                          gap: "15px",
                        }}
                      >
                        <ZoomSwitch {...zoomSwitchProps} />
                      </div>
                      {uniques.map((u) => (
                        <div className={styles.grid} key={u}>
                          <Graph
                            vertices={
                              graphVertices.find((obj) => obj.idx === u).v
                            }
                            edges={
                              graphEdges.find((obj) => obj.idx === u).graph
                            }
                          />
                          <Geometry
                            xyzData={
                              geometries.find((obj) => obj.idx === u).xyz
                            }
                            disableInteraction={isGeomInteractionDisabled}
                          />
                          <p>structure {u}</p>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </App>
  )
}

export default ClusterVisApp
