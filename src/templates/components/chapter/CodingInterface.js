import React, { useEffect, useState, useMemo } from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { checkCode } from '../../../utils/compiler';
import DisplayResult from './DisplayResult';

import { ControlledEditor, monaco, DiffEditor } from '@monaco-editor/react';

const CodingInterface = ({
  code,
  answer,
  updateValidation,
  module,
  isCode,
}) => {
  const [editorValue, setEditorValue] = useState(code);
  const [showAnswer, setShowAnswer] = useState(false);
  const [checkAnswer, setCheckAnswer] = useState(false);
  const [result, setResult] = useState({});

  const displayMichelsonBtn = useMemo(
    () =>
      result.success &&
      isCode &&
      (module.indexOf('2') !== -1 || module.indexOf('3') !== -1),
    [checkAnswer],
  );

  useEffect(() => {
    monaco.init().then(monacoInstance => {
      monacoInstance.editor.defineTheme('cryptoverse-theme', {
        base: 'vs-dark',
        inherit: true,
        automaticLayout: true,
        rules: [
          { token: 'comment', foreground: '989898', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'EA4192' },
          { token: 'number', foreground: '00FF47' },
          { token: 'string', foreground: 'AA00FA' },
        ],
        colors: {
          'editor.foreground': '#F8F8F8',
          'editor.background': '#030D18',
          'editor.selectionBackground': '#DDF0FF33',
          'editor.lineHighlightBackground': '#FFFFFF08',
          'editorCursor.foreground': '#A7A7A7',
          'editorWhitespace.foreground': '#FFFFFF40',
        },
      });
    });
  }, []);

  const resetEditorCode = () => setEditorValue(code);

  return (
    <main className={`flex flex-col`}>
      <header
        className={`flex flex-shrink-0 justify-between items-center text-white space-x-6 h-12 bg-base-800 w-auto`}
      >
        <div
          className={`bg-editor-console p-4 flex items-center justify-center h-full font-mono text-lg font-bold`}
        >
          filename.py
        </div>
        <div className={`mr-12`}>
          <button className={`mr-6`} onClick={resetEditorCode}>
            <RefreshIcon />
          </button>
          <button className={`mr-9`}>
            <HelpOutlineIcon />
          </button>
        </div>
      </header>
      <div className={`flex-1`}>
        <ControlledEditor
          value={editorValue}
          onChange={(_, value) => setEditorValue(value)}
          height={`${
            showAnswer || checkAnswer
              ? 'calc(100vh - 8.5rem - 6rem - 15rem)'
              : 'calc(100vh - 8.5rem - 6rem)'
          } `}
          language={`python`}
          theme={`cryptoverse-theme`}
          options={{
            lineNumbers: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            scrollbar: { vertical: 'hidden', verticalScrollbarSize: 0 },
            folding: true,
            readOnly: false,
            fontSize: 15.75,
            fontFamily: "'Ubuntu Mono', monospace",
            wordWrap: true,
            wordBasedSuggestions: false,
          }}
        />
        <div
          className={`flex justify-between flex-shrink-0 bg-base-800 text-white text-lg h-12 space-x-4`}
        >
          <div className={`flex space-x-4`}>
            <button
              className={`bg-primary-600 hover:bg-primary-700 flex items-center  pl-2 pr-4 focus:outline-none`}
              onClick={() => {
                setCheckAnswer(true);
                setShowAnswer(false);
                let res = checkCode(editorValue, answer, module);
                setResult(res);
              }}
            >
              <DoneIcon />
              Check
            </button>
            <button
              className={`bg-base-500 hover:bg-base-600 flex items-center pl-2 pr-4 focus:outline-none`}
              onClick={() => setShowAnswer(true)}
            >
              <HelpOutlineIcon />
              Show Answer
            </button>
          </div>
          {displayMichelsonBtn && (
            <button
              className={`text-base-50 py-2 px-4 mr-8 flex items-center focus:outline-none`}
            >
              <AddCircleOutlineIcon />
              <span className={`mx-2 block`}>Show compiled code</span>
            </button>
          )}
        </div>
        {(showAnswer || checkAnswer) && (
          <div
            className={`h-12 bg-editor-console flex justify-between items-center`}
          >
            <button
              onClick={() => {
                setShowAnswer(false);
                setCheckAnswer(false);
              }}
              className={`text-white font-mono text-lg p-4 pr-3 flex items-center space-x-3 focus:outline-none`}
            >
              <span>Console</span>
              <CloseIcon />
            </button>
          </div>
        )}
        {showAnswer ? (
          <DiffEditor
            height={`12rem`}
            original={showAnswer ? answer : 'MODIFIED'}
            modified={showAnswer ? editorValue : 'MODIFIED'}
            language="python"
            theme={`cryptoverse-theme`}
            options={{
              lineNumbers: false,
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
              scrollbar: { vertical: 'hidden', verticalScrollbarSize: 0 },
              folding: false,
              readOnly: true,
              fontSize: 15.75,
              fontFamily: "'Ubuntu Mono', monospace",
              renderSideBySide: false,
              wordWrap: true,
              ignoreTrimWhitespace: false,
              renderWhitespace: 'all',
              lineHeight: 26,
            }}
          />
        ) : checkAnswer ? (
          <DisplayResult result={result} />
        ) : null}

        {/* <ControlledEditor
          // height={`${
          //   buttonClicked
          //     ? `calc(100vh - (${HeaderHeight} + ${FooterHeight} + ${ContractFileHeight} + ${OptionHeight} + ${OutputHeaderHeight} + ${OutputContentHeight}))`
          //     : `calc(100vh - (${HeaderHeight} + ${FooterHeight} + ${ContractFileHeight} + ${OptionHeight}))`
          // }`}
          // width={`calc(100vw - (100vw / 2.4))`}
          value={editorInputValue}
          onChange={(_, value) => {
            setEditorInputValue(value);
          }}
          language="python"
          options={{
            lineNumbers: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            scrollbar: { vertical: 'hidden', verticalScrollbarSize: 0 },
            folding: true,
            readOnly: false,
            fontSize: 14,
            fontFamily: "'Ubuntu Mono', monospace",
            wordWrap: true,
            wordBasedSuggestions: false,
          }}
        /> */}
      </div>
    </main>
  );
};

export default CodingInterface;
