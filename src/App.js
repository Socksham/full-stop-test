import logo from './logo.svg';
import './App.css';

// npm i @xenova/transformers
// import { pipeline } from '@xenova/transformers';
import { useEffect, useState } from 'react';

import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0";

env.allowLocalModels = false;


function App() {

  const [inputValue, setInputValue] = useState("")
  const [outputText, setOutputText] = useState("")
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState(0)

  useEffect(() => {
    console.log("using effect")
    async function blah() {
      console.log("in blah")
      const pipe = await pipeline('token-classification', 'ldenoue/fullstop-punctuation-multilang-large');

      let out = await pipe('hi my name is john this is a test lets see how you do')

      console.log("bro")

      console.log(prediction_to_text(out))
      console.log(out)
    }
    // blah();
  }, [])

  const onClick = async () => {

    setLoading(true)

    let pipe;

    if (model == 0) {
      pipe = await pipeline('token-classification', 'ldenoue/fullstop-punctuation-multilang-large');
    } else {
      pipe = await pipeline('token-classification', 'ldenoue/distilbert-base-re-punctuate');
    }

    let out = await pipe(inputValue)

    // console.log(out)

    setOutputText(prediction_to_text(out));

    setLoading(false)
  }

  // hi my name is john this is a test lets see how you do

  function prediction_to_text(prediction) {

    let result = "";

    if (model == 0) {
      console.log("in prediction")
      for (let i = 0; i < prediction.length; i++) {
        let label = prediction[i].entity;
        let word = prediction[i].word;
        result += word;

        if (label == "0") {
          result += " "
        } else if (".,?-:".includes(label)) {
          result += label + " "
        }
      }
      return result.trim();
    } else {
      for (let i = 0; i < prediction.length; i++) {
        console.log(prediction[i])
        let toAdd = prediction[i].word
        if (prediction[i].entity.includes('UPPER')) {
          toAdd = prediction[i].word.toUpperCase();
        } else if (prediction[i].entity.includes('Upper')) {
          toAdd = prediction[i].word.charAt(0).toUpperCase() + prediction[i].word.slice(1);
        }
        if (prediction[i].entity.slice(-1) !== '_' && prediction[i].entity.slice(-1) !== prediction[i].word.slice(-1)) {
          toAdd += prediction[i].entity.slice(-1);
        }
        if (i != prediction.length - 1) {
          result += toAdd + " ";
        } else {
          result += toAdd;
        }
      }

      return result
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-slate-100">
      <div className='w-full flex flex-col items-center px-72'>
        <p className='text-4xl font-extrabold text-slate-700'>ScribeAR Demo</p>
        <div className='h-4' />
        <div className='w-full flex space-x-4 items-center justify-center'>

          {
            model == 0 ?
              <div className='w-full flex items-center justify-end'>
                <div className='transition-all cursor-pointer bg-slate-700 border-2 border-slate-700 px-5 py-2 rounded-lg' onClick={() => { setModel(0) }}>
                  <p className='text-center text-slate-100 text-md font-semibold'>fullstop-punctuation-multilang-large</p>
                </div>
              </div>
              :
              <div className='w-full flex items-center justify-end'>
                <div className='transition-all cursor-pointer hover:bg-slate-200 bg-slate-100 border-2 border-slate-700 px-5 py-2 rounded-lg' onClick={() => { setModel(0) }}>
                  <p className='text-center text-slate-700 text-md font-semibold'>fullstop-punctuation-multilang-large</p>
                </div>
              </div>
          }

          {
            model == 1 ?
              <div className='w-full flex items-center justify-start'>
                <div className='transition-all cursor-pointer bg-slate-700 border-2 border-slate-700 px-5 py-2 rounded-lg' onClick={() => { setModel(1) }}>
                  <p className='text-center text-slate-100 text-md font-semibold'>distilbert-base-re-punctuate</p>
                </div>
              </div>
              :
              <div className='w-full flex items-center justify-start'>
                <div className='transition-all cursor-pointer hover:bg-slate-200 bg-slate-100 border-2 border-slate-700 px-5 py-2 rounded-lg' onClick={() => { setModel(1) }}>
                  <p className='text-center text-slate-700 text-md font-semibold'>distilbert-base-re-punctuate</p>
                </div>
              </div>
          }
        </div>
        <div className='h-4' />
        <div className='w-full flex space-x-4'>
          <div className='w-full'>
            <textarea className='transition-all h-48 w-full p-2 rounded-lg focus:outline focus:outline-4 focus:outline-slate-600 bg-slate-200 text-lg text-slate-700' value={inputValue} onChange={(e) => { setInputValue(e.target.value) }} />
          </div>
          {/* <div className='w-10' /> */}
          <div className='w-full'>
            <textarea readOnly className='transition-all h-48 w-full p-2 rounded-lg focus:outline focus:outline-4 focus:outline-slate-600 bg-slate-200 text-lg text-slate-700' placeholder='Punctuated text appears here!' value={outputText} />
          </div>
        </div>
        <div className='h-4' />
        <button class="transition-all bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded flex space-x-4 items-center w-36 h-12 justify-center" onClick={onClick}>
          {
            loading ?
              <div class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
              </div>
              :
              <p className='text-lg font-semibold'>Punctuate</p>
          }
        </button>
      </div>


    </div>
  );
}

export default App;
