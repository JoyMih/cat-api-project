import "./App.css"
import MainContent from "./Components/MainContent"
import Navbar from "./Components/Navbar"

function App() {
  const data = "Look at how many cool cats there are!"; // Practicing using props object in React: to pass data to a child component

  return (
    <>
      <Navbar />
      <div>
        <MainContent message={data} />
      </div>
      <div className="card">
      </div>
    </>
  )
}

export default App
