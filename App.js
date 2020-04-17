import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as Contacts from "expo-contacts";

const App = () => {
  const [contacts, setContacts] = useState([]);

  const getAllContacts = async () => {
    const { data } = await Contacts.getContactsAsync({});
    setContacts(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Shift Contacts!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Send" onPress={getAllContacts}></Button>
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
    fontSize: 20,
  },
});

export default App;
