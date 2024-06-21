import { message, Upload } from "antd"
const { Dragger } = Upload
import { InboxOutlined } from "@ant-design/icons"

import parse from "./parser"

const Uploader = ({
  setGeometries,
  setFilename,
  setGraphVertices,
  setGraphEdges,
  setGroups,
  setUniques,
}) => {
  const handleFileRead = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      setFilename(file.name)

      const { geometries, graphs, groups, uniques, vertices } = parse(content)
      setGeometries(geometries)
      setGraphEdges(graphs)
      setGroups(groups)
      setUniques(uniques)
      setGraphVertices(vertices)
    }
    reader.readAsText(file)
  }

  return (
    <Dragger
      name="file"
      multiple={false}
      accept=".dat"
      beforeUpload={(file) => {
        handleFileRead(file)
        return false // do not "upload" file automatically
      }}
      onChange={(info) => {
        const { status } = info.file
        if (status !== "uploading") {
          console.log(info.file, info.fileList)
        }
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`)
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`)
        }
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Please select your structure clustering result file in <code>.dat</code>{" "}
        format. This file will be processed and analyzed only within your local
        browser.
      </p>
    </Dragger>
  )
}

export default Uploader
