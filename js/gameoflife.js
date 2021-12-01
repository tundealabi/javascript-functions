function seed() {
  return Array.call(null, ...arguments);
}

function same([x, y], [j, k]) {
  return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some(same.bind(null, cell));
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? '\u25A3' : '\u25A2';
};

const corners = (state = []) => {
  if (state.length === 0) {
    return { topRight: [0, 0], bottomLeft: [0, 0] };
  }
  return {
    topRight: [
      Math.max(...state.map(([x, _]) => x)),
      Math.max(...state.map(([_, y]) => y)),
    ],
    bottomLeft: [
      Math.min(...state.map(([x, _]) => x)),
      Math.min(...state.map(([_, y]) => y)),
    ],
  };
};

const printCells = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let acc = '';
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }
    acc += row.join(' ') + '\n';
  }
  return acc;
};

const getNeighborsOf = ([x, y]) => {
  return [
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
  ];
};

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter((n) => contains.bind(state)(n));
};

const willBeAlive = (cell, state) => {
  const livingNeighbors = getLivingNeighbors(cell, state);

  return (
    livingNeighbors.length === 3 ||
    (contains.call(state, cell) && livingNeighbors.length === 2)
  );
};

const calculateNext = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let result = [];
  for (let b = topRight[1] + 1; b >= bottomLeft[1] - 1; b--) {
    for (let a = bottomLeft[0] - 1; a <= topRight[1] + 1; a++) {
      result = result.concat(willBeAlive([a, b], state) ? [[a, b]] : []);
    }
  }
  return result;
};

const iterate = (state, iterations) => {
  let count = 0;
  let result = [];
  while (count <= iterations) {
    result.push(state);
    state = calculateNext(state);
    count++;
  }
  return result;
};

const main = (pattern, iterations) => {
  iterate(startPatterns[pattern], iterations).forEach((r) =>
    console.log(printCells(r))
  );
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4],
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3],
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ],
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log('Usage: node js/gameoflife.js rpentomino 50');
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;
