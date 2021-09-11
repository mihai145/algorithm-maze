import { generateEmptyMatrix } from "../store/reducers/mazeReducer";

class NaivePriorityQueue {
  constructor() {
    this.queue = [];
  }
  empty() {
    return this.queue.length === 0;
  }
  push(item) {
    this.queue.push(item);
  }
  pop() {
    let minF = 200,
      indexMinF = -1;
    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i][2] + this.queue[i][3] <= minF) {
        minF = this.queue[i][2] + this.queue[i][3];
        indexMinF = i;
      }
    }

    let item = this.queue[indexMinF];
    this.queue.splice(indexMinF, 1);
    return item;
  }
}

let dx = [-1, 0, 1, 0];
let dy = [0, 1, 0, -1];

const abs = (x) => {
  return Math.max(x, -x);
};

export const run_a_star = (maze) => {
  const n = maze.length,
    m = maze[0].length;

  let startX = -1,
    startY = -1,
    endX = -1,
    endY = -1;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (maze[i][j] === 2) {
        (startX = i), (startY = j);
      } else if (maze[i][j] === 3) {
        (endX = i), (endY = j);
      }
    }
  }

  let seen = generateEmptyMatrix(n, m);
  seen[startX][startY] = 1;
  let queue = new NaivePriorityQueue();
  queue.push([startX, startY, 0, abs(endX - startX) + abs(endY - startY)]);

  let expandedCells = [];

  while (!queue.empty()) {
    const current = queue.pop();
    const x = current[0],
      y = current[1],
      d = current[2];

    expandedCells.push([x, y, d]);

    if (x === endX && y === endY) {
      break;
    }

    for (let k = 0; k < 4; k++) {
      const nx = x + dx[k],
        ny = y + dy[k];

      if (
        0 <= nx &&
        nx < n &&
        0 <= ny &&
        ny < m &&
        seen[nx][ny] === 0 &&
        maze[nx][ny] !== 1
      ) {
        seen[nx][ny] = 1;
        queue.push([nx, ny, d + 1, abs(endX - nx) + abs(endY - ny)]);
      }
    }
  }

  return expandedCells;
};
