import { VerificacaoDaLetraEnum } from "./verificacao-letra-enum.js";
import { Termo } from "./termo.js";

interface HTMLComponents 
{
  pnlTeclado: HTMLDivElement;
  btnEnter: HTMLButtonElement;
  btnReiniciar: HTMLButtonElement;
  btnApagar: HTMLButtonElement;
  divMensagemFinal: HTMLDivElement;
  lblMensagemFinal: HTMLLabelElement;
}

export class TelaTermo 
{
  private jogo: Termo;
  private divLinhasTermo: HTMLDivElement[] = [];
  private indiceColunaSelecionada: number = -1;
  private termo: Termo[];

  constructor() 
  {
    this.jogo = new Termo();

    this.termo = [this.jogo];

    const htmlComponents = this.getHTMLComponents();

    this.registerEvents(htmlComponents);

    this.hideMessageDiv();
  }

  private getHTMLComponents(): HTMLComponents 
  {
    return {
      pnlTeclado: document.getElementById("pnlTeclado") as HTMLDivElement,
      btnEnter: document.getElementById("btnEnter") as HTMLButtonElement,
      btnReiniciar: document.getElementById("btnReiniciar") as HTMLButtonElement,
      btnApagar: document.getElementById("btnApagar") as HTMLButtonElement,
      divMensagemFinal: document.getElementById("divMensagemFinal") as HTMLDivElement,
      lblMensagemFinal: document.getElementById("lblMensagemFinal") as HTMLLabelElement,
    };
  }

  private registerEvents(htmlComponents: HTMLComponents): void 
  {
    htmlComponents.btnEnter.addEventListener("click", this.avaliarPalavra.bind(this));
    htmlComponents.btnReiniciar.addEventListener("click", this.reiniciarJogo.bind(this));
    htmlComponents.btnApagar.addEventListener("click", this.apagarLetra.bind(this));

    for (const botao of htmlComponents.pnlTeclado.children) 
    {
      if (botao.textContent === "Enter" || botao.textContent === "Reiniciar" || botao.textContent === "<") 
        continue;
      
      botao.addEventListener("click", this.digitarLetra.bind(this));
    }
  }

  private hideMessageDiv(): void 
  {
    this.getMessageDiv().classList.add("display-none");
  }

  private getMessageDiv(): HTMLDivElement 
  {
    return document.getElementById("divMensagemFinal") as HTMLDivElement;
  }

  public reiniciarJogo(): void 
  {
    this.jogo = new Termo();

    for (const linha of this.divLinhasTermo) 
    {
      for (const coluna of linha.children) 
      {
        coluna.textContent = "";

        coluna.classList.remove("letra-correta", "letra-posicao-incorreta", "letra-nao-existente");
      }
    }

    this.enableKeyboardButtons();

   // this.lblMensagemFinal.textContent = '';

    this.hideMessageDiv();

    this.indiceColunaSelecionada = -1;
  }

  public apagarLetra(): void {
    if (this.indiceColunaSelecionada >= 0) {
      const coluna = this.getCurrentLine().children[this.indiceColunaSelecionada] as HTMLDivElement;

      if (coluna) {
        coluna.textContent = "";
        this.indiceColunaSelecionada--;
      }
    }
  }

  public avaliarPalavra(): void {
    const linha = this.jogo.tentativas;
    const palavraCompleta = this.obterPalavra();

    const avaliacoes: VerificacaoDaLetraEnum[] | null = this.jogo.avaliar(palavraCompleta);

    if (avaliacoes === null) {
      return;
    }

    const jogadorAcertou = this.jogo.jogadorAcertou(palavraCompleta);
    const jogadorPerdeu = this.jogo.jogadorPerdeu();

    this.colorirColunas(linha, avaliacoes);

    if (jogadorPerdeu) {
      this.setMessageLabelClass("cor-erro");
    } else {
      this.setMessageLabelClass("cor-acertou");
    }

    if (jogadorAcertou || jogadorPerdeu) {
    //  this.lblMensagemFinal.textContent = this.jogo.mensagemFinal;
      this.disableKeyboardButtons();
      this.showMessageDiv();
    }

    this.indiceColunaSelecionada = -1;
  }

  private getCurrentLine(): HTMLDivElement {
    return this.divLinhasTermo[this.jogo.tentativas];
  }

  private obterPalavra(): string {
    let palavra = '';
    for (let coluna = 0; coluna < 5; coluna++) {
      palavra += (this.getCurrentLine().children[coluna] as HTMLDivElement).innerText;
    }
    return palavra;
  }

  private colorirColunas(indiceLinha: number, avaliacoes: VerificacaoDaLetraEnum[]): void {
    const linha = this.divLinhasTermo[indiceLinha];

    for (let indiceColuna = 0; indiceColuna < avaliacoes.length; indiceColuna++) {
      const colunaSelecionada = linha.children[indiceColuna] as HTMLDivElement;

      switch (avaliacoes[indiceColuna]) {
        case VerificacaoDaLetraEnum.Correta:
          colunaSelecionada.classList.add("letra-correta");
          break;

        case VerificacaoDaLetraEnum.PosicaoErrada:
          colunaSelecionada.classList.add("letra-posicao-incorreta");
          break;

        case VerificacaoDaLetraEnum.NaoExiste:
          colunaSelecionada.classList.add("letra-nao-existente");
          break;
      }
    }
  }

  private setMessageLabelClass(className: string): void {
   // this.lblMensagemFinal.classList.add(className);
  }

  private disableKeyboardButtons(): void {
    for (const botao of this.getHTMLComponents().pnlTeclado.children) {
      if (botao.textContent === "Reiniciar") {
        continue;
      }

      (botao as HTMLButtonElement).disabled = true;
    }
  }

  private enableKeyboardButtons(): void {
    for (const botao of this.getHTMLComponents().pnlTeclado.children) {
      if (botao.textContent === "Reiniciar") {
        continue;
      }

      (botao as HTMLButtonElement).disabled = false;
    }
  }

  private showMessageDiv(): void {
    this.getMessageDiv().classList.remove("display-none");
  }

  private digitarLetra(event: Event): void {
    if (this.indiceColunaSelecionada > 3 || this.indiceColunaSelecionada < -1) {
      return;
    }

    const letra = (event.target as HTMLButtonElement).textContent;

    this.indiceColunaSelecionada++;

    const coluna = this.getCurrentLine().children[this.indiceColunaSelecionada] as HTMLDivElement;

    coluna.textContent = letra;
  }
}
