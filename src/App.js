import React, { useState } from 'react';
import api from './api.js';
import './App.css';
import sqlite3 from 'sqlite3';

function consultar_operacoes() {
  const db = new sqlite3.Database('calculadora_das_trevas.db');

  db.all('SELECT * FROM operacoes ORDER BY id DESC LIMIT 10', (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }

    rows.forEach(row => {
      console.log(`${row.operacao} = ${row.resultado}`);
    });

    db.close();
  });
}

function App() {
  const [resultado, setResultado] = useState('');
  const [numerosDigitados, setNumerosDigitados] = useState('');
  const [ultimaOperacao, setUltimaOperacao] = useState('');
  const sqlite3 = require('sqlite3').verbose();

  async function getCalculo() {
    try {
      const resultCalc = await api.get('/api/calculo', {
        params: { numerosDigitados: numerosDigitados }
      });
      console.log('resultCalc', resultCalc);
      setResultado(resultCalc.data);
      setUltimaOperacao(numerosDigitados);
    } catch (error) {
      console.error(error);
    }
  }

  function handleClick(event) {
    const value = event.target.name;
    console.log('Valor do botão clicado:', value);

    if (numerosDigitados === '' && (value === '*' || value === '/' || value === '+' || value === ')')) {
      return;
    }

    const isOperator = ['+', '-', '*', '/'].includes(value);
    const hasNumbers = /[0-9]/.test(numerosDigitados);

    if (isOperator && !hasNumbers) {
      return;
    }

    const lastCharacterIsOperator = ultimoCaractereOperador();
    const nextCharacterIsOperator = proximoCaractereOperador(value);

    if (lastCharacterIsOperator && nextCharacterIsOperator) {
      setNumerosDigitados(numerosDigitados.slice(0, -1) + value);
    } else {
      setNumerosDigitados(numerosDigitados + value);
    }
  }

  function ultimoCaractereOperador() {
    return ['+', '-', '*', '/'].includes(numerosDigitados.slice(-1));
  }

  function proximoCaractereOperador(value) {
    return ['+', '-', '*', '/'].includes(value);
  }

  function apagatudo() {
    setNumerosDigitados('');
    setResultado('');
    setUltimaOperacao('');
  }

  function apagarUltimo() {
    setNumerosDigitados(numerosDigitados.slice(0, -1));
  }

  function mostrarOperacoes() {
    const operacoesContainer = document.getElementById('operacoesContainer');

    fetch('/api/operacoes')
      .then(response => response.json())
      .then(data => {
        operacoesContainer.innerHTML = '';
        data.forEach(operacao => {
          const divOperacao = document.createElement('div');
          divOperacao.textContent = `${operacao.operacao} = ${operacao.resultado}`;
          operacoesContainer.appendChild(divOperacao);
        });
      })
      .catch(error => {
        console.error(error);
        operacoesContainer.textContent = 'Erro ao recuperar as operações.';
      });
  }

  return (
    <div className="App" >
      <h1 className="calculator-title">CALCULADORA DAS TREVAS</h1>
     
      <div className="result-window">{resultado}</div>

      <p>Números Digitados: {numerosDigitados}</p>
      <div> 
        <button className="highlight calculator-button" onClick={apagatudo}>C</button>

        <button name="M" onClick={mostrarOperacoes}className="calculator-button">M</button>
        <button name="CE" onClick={apagarUltimo}className="calculator-button">←</button>
        <button name="H" onClick={consultar_operacoes} className="calculator-button">H</button>

        </div>   
      <div>
          <button name="7" onClick={handleClick}className="calculator-button">7</button>
          <button name="8" onClick={handleClick}className="calculator-button">8</button>
          <button name="9" onClick={handleClick}className="calculator-button">9</button>
          <button name="/" onClick={handleClick}className="calculator-button">/</button>
          <button name="**.5" onClick={handleClick}className="calculator-button">√</button>
        </div>
        <div>
          <button name="4" onClick={handleClick}className="calculator-button">4</button>
          <button name="5" onClick={handleClick}className="calculator-button">5</button>
          <button name="6" onClick={handleClick}className="calculator-button">6</button>
          <button name="*" onClick={handleClick}className="calculator-button">*</button>
          <button name="**2" onClick={handleClick}className="calculator-button">x²</button> 
        </div>
        <div>
          <button name="1" onClick={handleClick}className="calculator-button">1</button>
          <button name="2" onClick={handleClick}className="calculator-button">2</button>
          <button name="3" onClick={handleClick}className="calculator-button">3</button>
          <button name="-" onClick={handleClick}className="calculator-button">-</button>
          <button name="(" onClick={handleClick}className="calculator-button">(</button>
        </div>

        <button name="." onClick={handleClick}className="calculator-button">.</button>
        <button name="0" onClick={handleClick}className="calculator-button">0</button>
        <button name="+" onClick={handleClick}className="calculator-button">+</button>
        <button className="highlightequal-button" onClick={getCalculo}>=</button>
        <button name=")" onClick={handleClick}className="calculator-button">)</button>
        <div>        

          <div id="operacoesContainer">
            Última Operação: {ultimaOperacao}
          </div>
        </div>
      </div>
  );
}

export default App;
