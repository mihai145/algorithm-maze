import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

/*
 *  Redux imports
 */
import { useSelector, useDispatch } from "react-redux";
import {
  clearMaze,
  modifyDimensions,
  setEnd,
  setExpanded,
  setStart,
  toggleObstacle,
} from "../store/actions/mazeSettings";

/*
 *  Algorithms imports
 */
import { run_bfs } from "../algorithms/bfs";
import { run_dfs } from "../algorithms/dfs";
import { run_a_star } from "../algorithms/a_star";

import {
  DISTANCE_ADDITIVE_CT,
  DESTINATION_ADDITIVE_CT,
} from "../constants/constants";
import { SLOW, NORMAL, FAST } from "../store/actions/speedSettings";

/*
 *  Interaction Flow Constants
 */
const TOGGLE_OBSTACLES_MODE = 0;
const SET_START_MODE = 1;
const SET_END_MODE = 2;
const RUNNING_MODE = 3;
const SUMMARY_MODE = 4;

/*
 *  Algorithm Selector Constants
 */
const ALGORITHM_BFS = 0;
const ALGORITHM_DFS = 1;
const ALGORITHM_A_STAR = 2;

const colors = ["white", "#D3D3D3", "#7AA0CB", "#FFD700"];
const getColor = (cell) => {
  if (cell > DESTINATION_ADDITIVE_CT) {
    //final cell
    return "#FFD700";
  } else if (cell == DISTANCE_ADDITIVE_CT) {
    //start cell
    return "#7DF9FF";
  } else if (cell < DISTANCE_ADDITIVE_CT) {
    //non-expanded cell
    return colors[cell];
  } else {
    //path cell
    return "#228B22";
  }
};

const maze = (props) => {
  const maze = useSelector((state) => state.maze.maze);
  const speed = useSelector((state) => state.speed.speed);
  const dispatch = useDispatch();

  const [mode, setMode] = useState(TOGGLE_OBSTACLES_MODE);
  const [algorithm, setAlgorithm] = useState(ALGORITHM_BFS);
  const [feedback, setFeedback] = useState("");

  const timer = useRef();

  useEffect(() => {
    if (mode === RUNNING_MODE) {
      let expandedCells = [];
      if (algorithm === ALGORITHM_BFS) {
        expandedCells = run_bfs(maze);
      } else if (algorithm === ALGORITHM_DFS) {
        expandedCells = run_dfs(maze);
      } else if (algorithm === ALGORITHM_A_STAR) {
        expandedCells = run_a_star(maze);
      }

      let intervalDuration = 50;
      if (speed === SLOW) {
        intervalDuration = 300;
      } else if (speed === NORMAL) {
        intervalDuration = 150;
      } else if (speed === FAST) {
        intervalDuration = 10;
      }

      timer.current = setInterval(() => {
        if (expandedCells.length === 0) {
          clearInterval(timer.current);
          setMode(SUMMARY_MODE);

          let destinationReachedIn = -1,
            ctExpanded = 0;
          for (let i = 0; i < maze.length; i++) {
            for (let j = 0; j < maze[0].length; j++) {
              if (maze[i][j] > DESTINATION_ADDITIVE_CT) {
                destinationReachedIn = maze[i][j] - DESTINATION_ADDITIVE_CT;
              }
              if (maze[i][j] >= DISTANCE_ADDITIVE_CT) {
                ctExpanded++;
              }
            }
          }

          if (destinationReachedIn === -1) {
            setFeedback("Destination cannot be reached");
          } else {
            setFeedback(
              `Distance to destination is ${destinationReachedIn}. The algorithm expanded ${ctExpanded} cells`
            );
          }
        } else {
          const cell = expandedCells[0];
          if (expandedCells.length > 1) {
            dispatch(
              setExpanded(cell[0], cell[1], cell[2] + DISTANCE_ADDITIVE_CT)
            );
          } else {
            if (maze[cell[0]][cell[1]] === 3) {
              dispatch(
                setExpanded(cell[0], cell[1], cell[2] + DESTINATION_ADDITIVE_CT)
              );
            } else {
              dispatch(
                setExpanded(cell[0], cell[1], cell[2] + DISTANCE_ADDITIVE_CT)
              );
            }
          }
          expandedCells.shift();
        }
      }, intervalDuration);
    }
  }, [mode, algorithm, setMode, dispatch]);

  const { navigation } = props;
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
      setMode(TOGGLE_OBSTACLES_MODE);
      dispatch(clearMaze());
    });

    return unsubscribe;
  }, [timer, navigation, setMode, dispatch]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.feedback}>
        <Text style={styles.feedbackMessage}>{feedback}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="BFS"
            color={algorithm === ALGORITHM_BFS ? "#228B22" : "grey"}
            disabled={mode >= RUNNING_MODE}
            onPress={() => setAlgorithm(ALGORITHM_BFS)}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="DFS"
            color={algorithm === ALGORITHM_DFS ? "#228B22" : "grey"}
            disabled={mode >= RUNNING_MODE}
            onPress={() => setAlgorithm(ALGORITHM_DFS)}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="A*"
            color={algorithm === ALGORITHM_A_STAR ? "#228B22" : "grey"}
            disabled={mode >= RUNNING_MODE}
            onPress={() => setAlgorithm(ALGORITHM_A_STAR)}
          />
        </View>
      </View>
      <View style={styles.maze}>
        {maze.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, columnIndex) => (
              <TouchableWithoutFeedback
                key={columnIndex}
                onPress={() => {
                  if (mode === TOGGLE_OBSTACLES_MODE) {
                    dispatch(toggleObstacle(rowIndex, columnIndex));
                  } else if (mode === SET_START_MODE) {
                    dispatch(setStart(rowIndex, columnIndex));
                  } else if (mode === SET_END_MODE) {
                    dispatch(setEnd(rowIndex, columnIndex));
                  }
                }}
              >
                <View
                  style={{
                    ...styles.cell,
                    backgroundColor: getColor(cell),
                  }}
                >
                  <Text>
                    {cell >= DESTINATION_ADDITIVE_CT
                      ? cell - DESTINATION_ADDITIVE_CT
                      : cell >= DISTANCE_ADDITIVE_CT
                      ? cell - DISTANCE_ADDITIVE_CT
                      : ""}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="OBSTACLES"
            color={mode === TOGGLE_OBSTACLES_MODE ? "#228B22" : "grey"}
            disabled={mode >= RUNNING_MODE}
            onPress={() => setMode(TOGGLE_OBSTACLES_MODE)}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="START CELL"
            color={mode === SET_START_MODE ? "#228B22" : "grey"}
            disabled={mode >= RUNNING_MODE}
            onPress={() => setMode(SET_START_MODE)}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="FINISH CELL"
            color={mode === SET_END_MODE ? "#228B22" : "grey"}
            disabled={mode >= RUNNING_MODE}
            onPress={() => setMode(SET_END_MODE)}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View style={{ width: "40%", borderRadius: 10, overflow: "hidden" }}>
          <Button
            title={mode <= RUNNING_MODE ? "RUN ALGORITHM" : "CLEAR MAZE"}
            disabled={mode === RUNNING_MODE}
            color="#7DF9FF"
            onPress={() => {
              if (mode < RUNNING_MODE) {
                //Check if the maze is valid before the algorithm starts
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

                if (startX === -1 || startY === -1) {
                  setFeedback("You have to select a starting cell!");
                } else if (endX === -1 || endY === -1) {
                  setFeedback("You have to select a finish cell!");
                } else {
                  setFeedback("");
                  setMode(RUNNING_MODE);
                }
              } else {
                dispatch(clearMaze());
                setFeedback("");
                setMode(TOGGLE_OBSTACLES_MODE);
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  maze: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    width: 35,
    height: 35,
    padding: 1,
    margin: 1,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 2,
  },
  buttonContainer: {
    width: "100%",
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  feedback: {
    margin: 20,
  },
  feedbackMessage: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    width: "30%",
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default maze;
