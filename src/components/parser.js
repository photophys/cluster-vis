const extractParts = (fileContent) => {
  const parts = {
    groups: "",
    uniques: "",
    graphs: [],
    structures: [],
  }

  // @GROUPS
  const groupsMatch = fileContent.match(/@GROUPS\s([\s\S]*?)(?=@|$)/)
  if (groupsMatch) {
    parts.groups = groupsMatch[0].trim()
  }

  // @UNIQUES
  const uniquesMatch = fileContent.match(/@UNIQUES\s([\s\S]*?)(?=@|$)/)
  if (uniquesMatch) {
    parts.uniques = uniquesMatch[0].trim()
  }

  // all @GRAPH-*
  const graphMatches = fileContent.match(/@GRAPH-\d+([\s\S]*?)(?=@|$)/g)
  if (graphMatches) {
    parts.graphs = graphMatches.map((graph) => graph.trim())
  }

  // all @STRUCTURE-*
  const structureMatches = fileContent.match(/@STRUCTURE-\d+([\s\S]*?)(?=@|$)/g)
  if (structureMatches) {
    parts.structures = structureMatches.map((structure) => structure.trim())
  }

  return parts
}

const parseGroups = (raw) =>
  raw
    .split(/\r?\n/)
    .slice(1)
    .map((g) =>
      g
        .trim()
        .split(" ")
        .map((str) => parseInt(str))
    )

const parseUniques = (raw) =>
  raw
    .split(/\r?\n/)[1]
    .split(" ")
    .map((str) => parseInt(str))

const parseGraphs = (raw) =>
  raw.map((g) => ({
    idx: parseInt(g.match(/@GRAPH-(\d+)/)[1]),
    graph: g
      .split(/\r?\n/)
      .slice(1)
      .map((l) => l.split(" ").map((str) => parseInt(str))),
  }))

const parseGeometries = (raw) =>
  raw.map((g) => ({
    idx: parseInt(g.match(/@STRUCTURE-(\d+)/)[1]),
    geometry: g
      .split(/\r?\n/)
      .slice(1)
      .map((a) => [
        a.split(" ")[0],
        a
          .split(" ")
          .slice(1)
          .map((str) => parseFloat(str)),
      ]),
  }))

const formatGeometries = (arr) =>
  arr.map((g) => {
    let temp = g.geometry.length.toString() + "\n\n"
    g.geometry.forEach((a) => {
      temp += a[0] + "   " + a[1].join("   ") + " \n"
    })
    return { idx: g.idx, xyz: temp }
  })

const parse = (content) => {
  const parts = extractParts(content)

  const geometries = parseGeometries(parts.structures)

  const result = {
    groups: parseGroups(parts.groups),
    uniques: parseUniques(parts.uniques),
    graphs: parseGraphs(parts.graphs),
    geometries: formatGeometries(geometries),
    vertices: geometries.map((g) => ({
      idx: g.idx,
      v: g.geometry.map((a) => a[0]),
    })),
  }

  console.log(result)
  return result
}

export default parse
