import { useEffect } from "react";

function App() {
  const redirectUrl = "https://qrqrpardemo.nakanishi.dev/";

  useEffect(() => {
    window.location.href = redirectUrl;
  }, []);

  return <div></div>;
}

export default App;
