import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import * as Contacts from "expo-contacts";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const sendAllContactsToDB = async () => {
    setIsLoading(true);
    const { data } = await Contacts.getContactsAsync({});
    const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);

    axios
      .post(
        "https://us-central1-swap-contacts-server.cloudfunctions.net/addContactsList",
        {
          userHandle: randomSixDigitNumber,
          contacts: data,
        }
      )
      .then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );

    axios
      .post(
        "https://us-central1-swap-contacts-server.cloudfunctions.net/addToSecretNums",
        {
          num: randomSixDigitNumber,
        }
      )
      .then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );

    console.log(`Adding ${data.length} contacts to DB...`);
    setIsLoading(false);
    setIsDone(true);
  };

  const loadContactsToDevice = async () => {
    setIsLoading(true);
    console.log("FETCHING...");
    const res = await axios.get(
      "https://us-central1-swap-contacts-server.cloudfunctions.net/getContacts"
    );

    const contactsFromDB = res.data[0].contacts;

    contactsFromDB.map(async (contact) => {
      const { contactType, firstName, name, phoneNumbers } = contact;

      const contactToAdd = {
        name: name,
        phoneNumbers: phoneNumbers,
        firstName: firstName,
        contactType: contactType,
      };

      await Contacts.addContactAsync(contactToAdd);

      console.log(`Success! ${firstName} was added to contacts.`);
    });

    console.log("Successfully added all contacts.");
    setIsLoading(false);
    setIsDone(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Shift Contacts</Text>
      {!isLoading && !isDone ? (
        <View style={styles.buttonContainer}>
          <Button title="Send" onPress={sendAllContactsToDB}></Button>
          <Button title="Get" onPress={loadContactsToDevice}></Button>
        </View>
      ) : !isDone ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <Text
          style={styles.success}
          onPress={() => {
            setIsDone(false);
          }}
        >
          Success! Click to go back.
        </Text>
      )}
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
  success: {
    color: "green",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 30,
  },
  loader: {
    marginTop: 30,
  },
});

export default App;
