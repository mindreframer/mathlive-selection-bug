import React, { useEffect, useState } from "react";
import "./App.css";
import { bus, deleteMathInput, selectionChanged } from "./bus";
import { MathInput } from "./MathInput";

function App() {
  const [counter, setCounter] = useState(1);
  const [values, setValues] = useState([
    {
      id: counter,
      val: "\\sqrt[{8}]{3^4+ 2^4-3+{\\frac{1}{2+({\\frac{2}{3}})^2}}}",
    },
  ]);
  const [changedLatex, setChangedLatex] = useState("");

  const addMath = () => {
    setCounter((v) => v + 1);
    setValues([
      ...values,
      {
        id: counter + 1,
        val: `\\sqrt[{8}]{3^4+ 2^4-3+{\\frac{1}{2+({\\frac{2}{3}})^2}}}`,
      },
    ]);
  };

  useEffect(() => {
    if (values.length < 2) {
      bus.subscribe(selectionChanged, (event) => {
        setChangedLatex(
          event.payload.latex +
            `  -->> from/to: ( ${event.payload.start} - ${event.payload.end}, depth: ${event.payload.depth} ) `
        );
      });

      bus.subscribe(deleteMathInput, (event) => {
        const pos = event.payload.position;
        setValues((values) => values.filter((a) => a.id != pos));
      });
    }
  }, [values]);

  const mathsEls = () => {
    return values.map((v, i) => {
      return <MathInput key={v.id} position={v.id} value={v.val} />;
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        {mathsEls()}
        <button onClick={addMath}>ADD</button>
      </header>

      <div id="modal-root">
        <div className="modal">== {changedLatex} ==</div>
      </div>
    </div>
  );
}

export default App;
