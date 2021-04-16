import * as mathlive from "mathlive";
import "mathlive/dist/mathlive-fonts.css";
import React, { useCallback, useState, useRef } from "react";
import { bus, deleteMathInput, selectionChanged } from "./bus";

const addStyles = (mfe: mathlive.MathfieldElement) => {
  var style = document.createElement("style");
  style.innerHTML = `
      .ML__fieldcontainer {
        background-color: white;
        border: 1px #ccc solid;
        color: black;
      }
      .ML__selection{
        background-color: #F9FAFB !important;
      }
      /* do not show border on focus!! */
      :host(:focus), :host(:focus-within) {
        outline: Highlight auto 0px;    /* For Firefox */
        outline: -webkit-focus-ring-color auto 0px;
      }
      `;
  mfe.shadowRoot?.appendChild(style);
};

const configureMathElement = (mfe: mathlive.MathfieldElement) => {
  mfe.setOptions({
    smartFence: true,
    virtualKeyboardMode: "off", // "manual"
    virtualKeyboards: "numeric symbols",
  });

  mfe.addEventListener("focus", (ev: Event) => {
    // console.log("Got focus", ev);
  });

  mfe.addEventListener("focus-out", (ev: Event) => {
    // @ts-ignore
    // console.log("Lost focus", ev.detail.direction);
  });

  mfe.addEventListener("mount", (ev: Event) => {
    // console.log("Mounted", ev);
  });

  // https://cortexjs.io/docs/mathlive/?q=selection-change
  mfe.addEventListener("selection-change", (ev: Event) => {
    let mfe = ev.target as mathlive.MathfieldElement;
    const sel = mfe.selection;
    console.log(sel, "SELECTION");
    if (sel) {
      const s1 = sel.ranges[0];
      console.log(`${s1[0]} -> ${s1[1]}`);
      console.log("RANGE", s1);
      console.log(mfe.getValue(s1));
      bus.publish(
        selectionChanged({
          latex: mfe.getValue(s1),
          start: s1[0],
          end: s1[1],
        })
      );
    }
  });
};

interface MathInputProps {
  value: string;
  onChange?: Function;
  position: number;
}
export const MathInput = ({ value, onChange, position }: MathInputProps) => {
  const [curval, setCurVal] = useState(value);
  const [mfe, setMfe] = useState(new mathlive.MathfieldElement());
  const [configured, setConfigured] = useState(false);
  const [selectionParam, setSelectionParam] = useState("");

  const selInput = useRef<HTMLInputElement>(null);

  const elRef = useCallback((node) => {
    if (node !== null) {
      if (!configured) {
        configureMathElement(mfe);
        addStyles(mfe);
        setConfigured(true);
      }
      mfe.setValue(curval);
      node.appendChild(mfe);
    }
  }, []);

  const onDelete = () => {
    bus.publish(deleteMathInput({ position: position! }));
  };

  const doSelect = () => {
    let parts = selectionParam.split("-");
    const selection = parts.map((a) => parseInt(a));
    if (selection.length == 2) {
      const sel = {
        direction: "none",
        ranges: [[selection[0], selection[1]]],
      };
      console.log("SETTING SELECTION", sel);
      // @ts-ignore
      mfe.selection = sel;
      mfe.focus();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", marginBottom: "10px" }}>
        <div ref={elRef}></div>
        <button onClick={onDelete}>DELETE</button>
        <button onClick={doSelect}>SELECT</button>
        <input
          type="text"
          className="selection"
          ref={selInput}
          width="100px"
          onChange={(e) => setSelectionParam(e.target.value)}
        />
      </div>
    </div>
  );
};
