class CalcController {

	constructor() {
		//querySelector obtem o primeiro id ou a classe com o nome especificado
		// El de elemento

		// atributos
		
		/*atributos para armazenar o ultimo operador e numero*/
		this._audio = new Audio('click.mp3');
		this._audioOnOff = false;
		this.getLastOperator = '';
		this._lastNumber = '';

		this._operation = [];
		this._locale = "pt-BR"
		this._displayCalcEl = document.querySelector("#display");
		this._dateEl = document.querySelector("#data");
		this._timeEl = document.querySelector("#hora");

		// underline representa  atributo privado
		// obs no js pode ser acessado o atributo privado
		this._currentDate;
		this.initialize();
		this.initButtonsEvents();
		this.initKeyboard();
	}	


	// metodo para copiar numero da calculadora
	copyToClipboard() {
		// criando a caixinha de text html
		let input = document.createElement('input');
		// displayCalc é o display da calculadora
		input.value = this.displayCalc;
		// adicionando ao corpo do html
		document.body.appendChild(input);
		// seleciona o input (caixinha de texto)
		input.select();
		// comando de copiar
		document.execCommand("Copy");
		// removendo a aparencia do input
		input.remove();
	}

	// metodo para colar um valor 
	pasteFromClipboard() {

		document.addEventListener('paste', e=> {
			let text = e.clipboardData.getData('Text');
			this.displayCalc = parseFloat(text);
			console.log(text);
		});

	}


	// inicializa a hora
	initialize() {
		// exibe a hora estaticamente
		this.setDisplayDateTime();
		
		// 1000 ms equivale 1 segundo
		// exibe a hora dinamicamente ou seja atualiza a hora
		setInterval(() => {
			this.setDisplayDateTime();
		}, 1000);
		// exibe o ultimo numero
		this.setLastNumberToDisplay();
		this.pasteFromClipboard();

		document.querySelectorAll('.btn-ac').forEach(btn =>  {
			btn.addEventListener('dblclick', e=> {
				this.tooggleAudio();
			});
		});
	}

	// metodo para ver se o audio esta ativado
    tooggleAudio() {
    	this._audioOnOff = !this._audioOnOff;
    }


    // metodo para tocar audio
    playAudio() {
    	if(this._audioOnOff) {
    		/* esse trecho permite que cada clique no botão
			* permita tocar o som desde o inicio*/
    		this._audio.currentTime = 0;
    		this._audio.play();
    	}
    }


	// metodo para detectar teclado
	initKeyboard() {

		document.addEventListener('keyup', e=> {
		

		this.playAudio();

		
		switch(e.key) {
			case 'Escape':
	                this.clearAll();
	                break;
	        case 'Backspace':
	                this.clearEntry();
	                break;
	        case '+':
	        case '-':
	        case '*':
	        case '/':
	        case '%':
	        	this.addOperation(e.key);
	            break;
	        case 'Enter':
	        case '=':
	        	this.calc();
	        	break;
	        case '.':
	        case ',':
	        	this.addDot();
	        	break;	    
	        case '0':
	        case '1':
	        case '2':
	        case '3':
	        case '4':
	        case '5':
	        case '6':
	        case '7':
	        case '8':
	        case '9':
	            // string para int
	            this.addOperation(parseInt(e.key));
	            break;
	        case 'c':
	        	if (e.ctrlKey) this.copyToClipboard();
	        	break;    
	        case 'a':
	        	alert("a pressionado");
	        	break;    
	        }
		});

	}


	/* a ideia deste metodo e inserir multiplos eventos em cada botao	
	element = btn | "click drag"  | fn = e a funcao */				

	// evento de multiplos botoes
	addEventListenerAll(element, events, fn) {
		/* explicacao do split ele separa ou seja o resultado
		* deve ficar algo como assim "click", "drag" */
		events.split(' ').forEach(event => {
			/* explicação do false
			*  para o documento não dispara mais de 1 vez o evento */ 
			element.addEventListener(event, fn, false);
		});
	}

	/*limpa tudo*/
	clearAll() {
		// limpando o conteudo do array
		this._operation = [];
		this._lastNumber = '';
		this._lastOperator = '';
		this.setLastNumberToDisplay();
	}

	/*limpa apenas o ultimo numero digitado*/
	clearEntry() {
		// pop elimina o ultimo array
		this._operation.pop();
		console.log(this._operation);
		this.setLastNumberToDisplay();

	}

	/*Exibe erro*/
	setError() {
		this.displayCalc = "Error";
	}

	// metodo que obtem o ultimo valor do array
	getLastOperation() {
		/*obtem o ultima elemento do array
		* lembrando neste caso pegamos os elementos da array da direita para esquerda
		* neste caso se no array a = [1,2,'+'] ira retornar '+'
		*/
		return this._operation[this._operation.length - 1];
	}


	// metodo para sobrescrever o array
	/* explicacao 
	*  antes de implementar este metodo o problema era o array
	*  quando digitava sempre um valor o array era acrescentado 
	*  agora a ideia e que quando digitar o valor deve concatenar
	*/
	setLastOperation(value) {
		// obtem o ultimo valor do array e atribuiu um valor ou seja substitui		 	
		return this._operation[this._operation.length - 1] = value;
	}


	// metodo para verificar se e um operador
	isOperator(value) {
		// -1 representa caso nao encotre nenhum dos operadores 
		return (['+','-','*','%','/'].indexOf(value)) > -1;
	}


	// metodo para inserir valor no array
	pushOperation(value) {
		this._operation.push(value);
		// validando a largura do array
		if(this._operation.length > 3) { 
			this.calc(); 
		}
	}

	getResult() {

		try {
			return eval(this._operation.join(""));
		} catch(e) {
			setTimeout(() => {
				this.setError();
			}, 1);
		}

	}



	// metodo de calculo
	calc() {

		let last = '';

		this._lastOperator = this.getLastItem();

		if(this._operation.length < 3) {

			let firstItem = this._operation[0];
			this._operation = [firstItem, this._lastOperator, this._lastNumber];
		}

		if(this._operation.length > 3) {
			/*remove o ultimo valor do array*/
			last = this._operation.pop();
			this._lastNumber = this.getResult();

		} else if(this._operation.length == 3) {
			
			this._lastNumber = this.getLastItem(false);
		}

		console.log('_lastOperator', this._lastOperator);
		console.log('_lastNumber', this._lastNumber);


		/* a ideia do join é juntar strings
		*  na matematica existe uma regra de prioridade na hora de calcular
		*  Com o eval para calcular os valores dentro de uma string 
		*  mais o join para unir as strings [10, "+", 90].join("")
		*  o resultado deve ficar algo assim "10+90" ao inves de "10,+,90"
		*/
		let result = this.getResult();

		if(last == '%') {
			/* /= significa um encurtamento de result = result /100*/
			result /= 100;
			this._operation = [result];

		} else {

			/* a ideia desse array e que armazene o calculo feito */
			this._operation = [result];
			console.log("caiu na linha do else do metodo calc");

			// verificando se existir a variavel last
			//if(last) this._operation.push(last);
		}

		this.setLastNumberToDisplay();
	}



	// metodo para obter o ultimo operador e valor
	getLastItem(isOperator = true) {

		let lastItem;

		/*a ideia deste for e encontrar o ultimo numero digitado*/
		for(let i = this._operation.length - 1; i >= 0; i--) {
			
			if(this.isOperator(this._operation[i]) == isOperator) {
				lastItem = this._operation[i];
				break;
			}
		
		}
		if(!lastItem) {
			lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
		}

		return lastItem;
	}
	

	// exibindo  o numero no display
	setLastNumberToDisplay() {

		let lastNumber = this.getLastItem(false);

		
		if(!lastNumber) lastNumber = 0;

		this.displayCalc = lastNumber;

 	}



	// metodo para inserir valor dentro do array 
	addOperation(value) {

		//console.log('A', isNaN(this.getLastOperation()));

		if(isNaN(this.getLastOperation())) {
			console.log("passei do primeiro if");
			/*Troca do operador
			* a ideia e quando usuario clicar em + e derrepente mudar
			* de ideia substitua por um novo operador */
			if(this.isOperator(value)) {
				
				this.setLastOperation(value);
				//this._operation[this._operation.length - 1] = value;
			
			}  else {
				console.log("caiu na linha do else");
				this.pushOperation(value);
				this.setLastNumberToDisplay();

			}

		} else {
			/* a ideia dessa validacao e assim que o usuario digita os numeros
			*  ao clicar no botao soma sera adicionado o operador no array */
			if(this.isOperator(value)) {
				this.pushOperation(value);
			} else {
				/* a ideia dessa variavel e concatenar valores
				* para concatenar e preciso converter em string o numero */
				let newValue = this.getLastOperation().toString() + value.toString();
				this.setLastOperation(newValue);

				this.setLastNumberToDisplay();
			}

		}

		console.log(this._operation);

		/* operation é o array criado anteriormente linha 8
		push adiciona um elemento ao ultimo array*/
		//this._operation.push(value);
	}

	// metodo para adicionar o ponto
	addDot() {

		let lastOperation = this.getLastOperation();

		//permitindo apenas 1 ponto                                           // parando a instrucao
		if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1 ) return;


		if(this.isOperator(lastOperation) || !lastOperation) {
			this.pushOperation('0.');
		} else {
			this.setLastOperation(lastOperation.toString() + '.');
		}

		this.setLastNumberToDisplay();

	}


	// validacao do botao
	execBtn(value) {

		this.playAudio();

		switch(value) {
			case 'ac':
				this.clearAll();
				break;
			case 'ce':
				this.clearEntry();
				break;
			case 'soma':
				this.addOperation('+');
				break;	
			case 'subtracao':
				this.addOperation('-');
				break;		
			case 'multiplicacao':
				this.addOperation('*');
				break;		
			case 'divisao':
				this.addOperation('/');
				break;
			case 'porcento':
				this.addOperation('%');
				break;			
			case 'igual':
				this.calc();
				break;	
			case 'ponto':	
				this.addDot();
				break;
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				// string para int
				this.addOperation(parseInt(value));
				break;
			default:
				this.setError();
				break;	
		}
	}

	// metodo dos botoes
	initButtonsEvents() {
		/*Breve explicação
		* o sinal > significa que quero obter todos os elementos filhos do tag G
		* obtem todos os elementos com querySelectorAll
		*/
		let buttons = document.querySelectorAll("#buttons > g, #parts > g");

		/*buttons retornara um array contendo varios valores
		* utilizando foreach para percorrer a array
		* a variavel btn representa os botoes dentro da array buttons
		* cada botao recebera um evento
		* index extrai o nome do botao
		*/

		buttons.forEach((btn, index) => {
			this.addEventListenerAll(btn,"click drag", e => {
				// a ideia da variavel e extrair somente o nome do botao
				let textBtn = btn.className.baseVal.replace("btn-", "");
				this.execBtn(textBtn);
			});

			// setando o ponteiro do mouse em todo botao
			this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
				btn.style.cursor = "pointer";
			});
		});
	}


	// exibe a hora e a data atual
	setDisplayDateTime() {
		// this._locale representa o atributo declarada acima
		// exibindo a data por extenso
		this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
			day: "2-digit",
			month: "long",
			year: "numeric"
		});
		this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
	}


	// metodo getter e setters
 
	get displayTime() {
		return this._timeEl.innerHTML;
	}

	set displayTime(value) {
		return this._timeEl.innerHTML = value;
	}


	get displayDate(){
		return this._dateEl.innerHTML;
	}


	set displayDate(value) {
		return this._dateEl.innerHTML = value;
	}

	get displayCalc() {
		return this._displayCalcEl.innerHTML;
	}

	set displayCalc(value) {
		if(value.toString().length > 10) {
			this.setError();
			return false;
		}
		this._displayCalcEl.innerHTML = value;
	}

	get currentDate() {
		return new Date();
	}

	set currentDate(valor) {
		this._currentDate = value;
	}
}