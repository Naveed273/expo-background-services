import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
//This variable is used as task name.
const BACKGROUND_LOCATION = "background-location-tracing";
//This function is used to ask the user for background permissions.
const requestPermissions = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  // To check whether background permission is granted or not.
  if (status === "granted") {
    console.log("permission granted");
    //It registers for receiving location updates that can also come when the app is in the background.
    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION, {
      accuracy: Location.Accuracy.Balanced,
    });
  }
};

export default function App() {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={requestPermissions}>
        <Text>Enable background location</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
//This methods checks whether TaskManager feature is availabe on the running device or not
TaskManager.isAvailableAsync()
  .then(() => {
    console.log("TaskManager feature is availabe with this device");
    /* 
    It Defines task function. It must be called in the global scope 
    of the JavaScript bundle. In particular, it cannot be called in any 
    of React lifecycle methods like componentDidMount or hook like
     useEffect/useLayoutEffect. This limitation is due to the fact 
     that when the application is launched in the background, 
     we need to spin up your JavaScript app,run your task and then 
     shut down — no views are mounted in this scenario.
    */
    TaskManager.defineTask(BACKGROUND_LOCATION, ({ data, error }) => {
      if (error) {
        console.log({ TaskManagerError: error });
        return;
      }
      if (data) {
        const { locations } = data;
        // do something with the locations captured in the background
        console.log({ naveedLocations: locations });
      }
    });
  })
  .catch((error) => {
    console.log("Sorry! TaskManager feature is not availabe for this device");
  });
