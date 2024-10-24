import App from "./app";
import {createRoot} from "react-dom/client";

// ReactDOM.render(<App />, document.getElementById("root"))

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);