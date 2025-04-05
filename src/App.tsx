import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import "./App.css";
import { EnApp } from "./components/EnApp";

function App() {
  return <MantineProvider>{<EnApp />}</MantineProvider>;
}

export default App;
