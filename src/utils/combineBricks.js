export function combineBricks(grid) {
  const visited = new Set()
  const bricks = []
  const height = grid.length
  const width = grid[0].length

  for (let y=0; y<height; y++) {
    for (let x=0; x<width; x++) {
      const key = `${x},${y}`
      if (visited.has(key)) continue
      const color = grid[y][x]

      let w=1, h=1

      // Expand horizontally
      while (x + w < width &&
             grid[y][x+w].r===color.r &&
             grid[y][x+w].g===color.g &&
             grid[y][x+w].b===color.b) w++

      // Expand vertically
      let canExpand = true
      while (canExpand && y+h < height) {
        for (let i=0;i<w;i++){
          const p = grid[y+h][x+i]
          if(p.r!==color.r || p.g!==color.g || p.b!==color.b){
            canExpand=false; break
          }
        }
        if(canExpand) h++
      }

      // Mark visited
      for(let dy=0; dy<h; dy++)
        for(let dx=0; dx<w; dx++)
          visited.add(`${x+dx},${y+dy}`)

      bricks.push({x, y, width:w, height:h, color})
    }
  }

  return bricks
}