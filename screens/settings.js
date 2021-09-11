import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

/*
 *  Redux imports
 */
import { useDispatch, useSelector } from "react-redux";
import { modifyDimensions } from "../store/actions/mazeSettings";
import { SLOW, NORMAL, FAST, setSpeed } from "../store/actions/speedSettings";

const settings = () => {
  const speed = useSelector((state) => state.speed.speed);
  const dispatch = useDispatch();

  const [lines, setLines] = useState();
  const [columns, setColumns] = useState();

  const handleChangeDimensions = () => {
    let noLines = 8,
      noColumns = 8;

    if (!isNaN(lines)) {
      if (lines < 4) {
        noLines = 4;
      } else if (lines > 9) {
        noLines = 9;
      } else {
        noLines = lines;
      }
    }

    if (!isNaN(columns)) {
      if (columns < 4) {
        noColumns = 4;
      } else if (columns > 9) {
        noColumns = 9;
      } else {
        noColumns = columns;
      }
    }

    dispatch(modifyDimensions(noLines, noColumns));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Lines</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={lines}
            onChangeText={(text) => setLines(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Columns</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={columns}
            onChangeText={(text) => setColumns(text)}
          />
        </View>
        <View
          style={{
            width: "80%",
            marginVertical: 2,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <Button
            title="APPLY DIMENSIONS"
            color="#7DF9FF"
            onPress={() => handleChangeDimensions()}
          />
        </View>
      </View>
      <View style={{ width: "100%", marginVertical: 20 }}>
        <Text style={styles.label}>Set algorithm spped</Text>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              title="SLOW"
              color={speed === SLOW ? "#228B22" : "grey"}
              onPress={() => {
                dispatch(setSpeed(SLOW));
              }}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="NORMAL"
              color={speed === NORMAL ? "#228B22" : "grey"}
              onPress={() => {
                dispatch(setSpeed(NORMAL));
              }}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="FAST"
              color={speed === FAST ? "#228B22" : "grey"}
              onPress={() => {
                dispatch(setSpeed(FAST));
              }}
            />
          </View>
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
  form: {
    width: "80%",
    margin: 20,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "grey",
  },
  inputContainer: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  input: {
    width: "20%",
    height: 20,
    padding: 2,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    textAlign: "center",
  },
  label: {
    fontSize: 12,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  button: {
    width: "30%",
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default settings;
