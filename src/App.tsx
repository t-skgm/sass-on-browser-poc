import React from "react";
import { useState } from "react";
import sass from "sass";

// @ts-expect-error: 雑に process.stdout を mock
process.stdout = {
  get isTTY() {
    return false;
  },
};

const sassExample = `
/* Variables */
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}

/* Nesting */
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }
}

/* Mixins */
@mixin theme($theme: DarkGray) {
  background: $theme;
  box-shadow: 0 0 1px rgba($theme, .25);
  color: #fff;
}

.alert {
  @include theme($theme: DarkRed);
}
`.trim();

const compile = (input: string) => {
  // see: https://sass-lang.com/documentation/js-api/modules#compileString
  const result = sass.compileString(input, {
    // see: https://sass-lang.com/documentation/js-api/interfaces/StringOptionsWithImporter
    style: "expanded",
    // importer: {
    //   findFileUrl(url, options) {
    //     console.log("IMPORTER", url, options);
    //     return null;
    //   },
    // },
  });
  return result.css;
};

function App() {
  const [input, setInput] = useState(sassExample);
  const [output, setOutput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    setErrorMessage("");

    try {
      const resultCSS = compile(input);
      setOutput(resultCSS);
    } catch (err) {
      console.warn(err);
      setErrorMessage((err as Error).message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sass on Browser</h1>

        {errorMessage.length != 0 && <p>Error! {errorMessage}</p>}

        <div style={{ display: "flex" }}>
          <textarea
            placeholder="SASS Code"
            style={{
              height: "40rem",
              width: "30rem",
            }}
            defaultValue={sassExample}
            onChange={(ev) => setInput(ev.target.value)}
          />
          <div
            style={{
              height: "40rem",
              padding: 10,
            }}
          >
            <button type="submit" onClick={handleSubmit}>
              Compile!
            </button>
          </div>
          <pre
            id="result"
            style={{
              margin: 0,
              height: "40rem",
              width: "30rem",
              border: "1px solid #ddd",
            }}
          >
            {output}
          </pre>
        </div>
      </header>
    </div>
  );
}

export default App;
