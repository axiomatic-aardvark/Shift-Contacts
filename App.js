import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Shift Contacts!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Send"></Button>
        <Button title="Get"></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: 200,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 30,
  },
  title: {
    fontWeight: "bold",
    fontSize:20
  },
});

export default App;
