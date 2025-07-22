import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyle from "@/styles/GlobalStyle";
import Router from "@/shared/Router";

function App() {
  return (
    <>
      <GlobalStyle />
      <Router />
      <ToastContainer position="bottom-center" autoClose={2000} />
    </>
  );
}

export default App;
