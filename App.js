import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import * as Contacts from "expo-contacts";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInputEnabled, setIsInputEnabled] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [uniqueNumber, setUniqueNumber] = useState("");

  console.log(uniqueNumber);

  const onUniqueNumberChange = (newNumber) => {
    setUniqueNumber(newNumber);
  };

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

    setUniqueNumber(randomSixDigitNumber);
    setIsInputEnabled(false);

    Alert.alert(
      `Your code is: ${randomSixDigitNumber}`,
      "Please write down or memorize your code, you will need to enter it on the other device.",
      [
        {
          text: "OK",
          onPress: () => console.log("Ask me later pressed"),
        },
      ],
      { cancelable: true }
    );
  };

  const loadContactsToDevice = async () => {
    if (uniqueNumber.length !== 6) {
      Alert.alert(
        `Please enter valid code!`,
        "The code you entered does not hold reference to any contacts list in the database.",
        [
          {
            text: "OK",
            onPress: () => console.log("OK pressed"),
          },
        ],
        { cancelable: true }
      );
      setUniqueNumber("");
      return;
    }

    setIsLoading(true);
    console.log("FETCHING...");
    const res = await axios.get(
      "https://us-central1-swap-contacts-server.cloudfunctions.net/getContacts"
    );

    const contactsFromDB = res.data.filter((o) => {
      console.log(
        o.userHandle,
        " is equal ",
        uniqueNumber,
        " ",
        o.userHandle == uniqueNumber
      );
      return o.userHandle == uniqueNumber;
    });

    if (contactsFromDB.length === 0) {
      Alert.alert(
        `Please enter valid code!`,
        "The code you entered does not hold reference to any contacts list in the database.",
        [
          {
            text: "OK",
            onPress: () => console.log("OK pressed"),
          },
        ],
        { cancelable: true }
      );
      setIsLoading(false);
      setUniqueNumber("");
      return;
    }

    contactsFromDB[0].contacts.map(async (contact) => {
      const { name, phoneNumbers, firstName, contactType } = contact;

      const contactToAdd = {
        name: name,
        phoneNumbers: phoneNumbers,
        firstName: firstName,
        contactType: contactType,
      };

      // await Contacts.addContactAsync(contactToAdd);
      // console.log(contactToAdd);

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
            setUniqueNumber("");
            setIsInputEnabled(true);
            setIsDone(false);
          }}
        >
          Success! Click to go back.
        </Text>
      )}

      <TextInput
        style={styles.input}
        blurOnSubmit
        autoCorrect={false}
        keyboardType="number-pad"
        maxLength={6}
        onChangeText={(newNumber) => onUniqueNumberChange(newNumber)}
        value={uniqueNumber}
        placeholder={uniqueNumber.toString() || "Your code"}
        editable={isInputEnabled}
      />
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
    marginVertical: 30,
  },
  loader: {
    marginVertical: 30,
  },
  input: {
    width: 70,
    textAlign: "center",
    height: 30,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default App;
