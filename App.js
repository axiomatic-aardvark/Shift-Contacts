import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import axios from "axios";
import * as Contacts from "expo-contacts";

const App = () => {
  const sendAllContactsToDB = async () => {
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
  };

  const loadContactsToDevice = async () => {
    console.log("FETCHING...");
    const res = await axios.get(
      "https://us-central1-swap-contacts-server.cloudfunctions.net/getContacts"
    );

    const contactsFromDB = res.data[0].contacts;

    contactsFromDB.map((contact) => {
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

    // const testFirstContact = res.data[0].contacts[0];
    // console.log(testFirstContact);
    // const { contactType, firstName, name, phoneNumbers } = testFirstContact;

    console.log("Successfully added all contacts.")

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Shift Contacts!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Send" onPress={sendAllContactsToDB}></Button>
        <Button title="Get" onPress={loadContactsToDevice}></Button>
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
