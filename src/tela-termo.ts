import { VerificacaoDaLetraEnum } from "./verificacao-letra-enum.js";
import { Termo } from "./termo.js";

export class TelaTermo {
  private jogo: Termo;  
  private jogos : Termo[];
  private pnlTeclado: HTMLDivElement;   
  private pnlConteudo: HTMLDivElement;   
  private btnEnter: HTMLButtonElement; 
  private indiceColunaAtual: number = -1;
  private divLinhas: HTMLDivElement[] = [];
  private btnReiniciar : HTMLButtonElement;
  private btnBackspace : HTMLButtonElement;
  private divMensagemFinal : HTMLDivElement;
  private lblMensagemFinal: HTMLLabelElement;
  private get linhaAtual() : HTMLDivElement {return this.divLinhas[this.jogo.tentativas];}
  
  constructor() {
    this.jogo = new Termo();    
    this.jogos = new Array<Termo>();
    this.btnEnter = document.getElementById("btnEnter") as HTMLButtonElement; 
    this.pnlTeclado = document.getElementById("pnlTeclado") as HTMLDivElement;    
    this.pnlConteudo = document.getElementById("pnlConteudo") as HTMLDivElement;    
    this.btnReiniciar = document.getElementById("btnReiniciar") as HTMLButtonElement; 
    this.btnBackspace = document.getElementById("btnBackspace") as HTMLButtonElement; 
    this.divMensagemFinal = document.getElementById("divMensagemFinal") as HTMLDivElement; 
    this.lblMensagemFinal = document.getElementById("lblMensagemFinal") as HTMLLabelElement; 

    this.jogos.push(this.jogo);

    document.querySelectorAll(".linha").forEach( div => {
      this.divLinhas.push(div as HTMLDivElement);
    });

    this.registrarEventos();

    this.divMensagemFinal.classList.add("display-none"); 
  }

  private registrarEventos(): void 
  {
    for (const botao of this.pnlConteudo.children) 
    {
      if (botao.id === "btnEnter" || botao.id === "btnReiniciar" || botao.id === "btnBackspace") 
      {
        continue;
      }

      botao.addEventListener("click", this.inserirLetra.bind(this));
    }

    this.btnEnter.addEventListener("click", this.verificarPalavra.bind(this));

    this.btnReiniciar.addEventListener("click", this.reiniciarJogo.bind(this));

    this.btnBackspace.addEventListener("click", this.removerLetra.bind(this));
  }

  public reiniciarJogo(): void 
  {
    this.jogo = new Termo();

    for (const linha of this.divLinhas) 
    {
      for (const letra of linha.children) 
      {
        letra.textContent = "";
        letra.classList.remove("letra-correta", "letra-posicao-errada", "letra-nao-existe");
      }
    }

    for (const botao of this.pnlConteudo.children) 
    {
      (botao as HTMLButtonElement).disabled = false;
    }
       
    this.lblMensagemFinal.textContent = "";
    this.divMensagemFinal.classList.add("display-none"); 
    this.indiceColunaAtual = -1;
  }

  public removerLetra(): void 
  {
    if (this.indiceColunaAtual >= 0) 
    {
      const letra = this.linhaAtual.children[this.indiceColunaAtual] as HTMLDivElement;

      if (letra) 
      {
        letra.textContent = "";
        this.indiceColunaAtual--;
      }
    }
  }

  public verificarPalavra(): void 
  {
    const linha = this.jogo.tentativas;
    const palavraCompleta = this.receberPalavra();
    const avaliacoes: VerificacaoDaLetraEnum[] | null = this.jogo.avaliar(palavraCompleta);

    if (avaliacoes === null) 
    {
      return;
    }

    const jogadorAcertou = this.jogo.jogadorAcertou(palavraCompleta);
    const jogadorPerdeu = this.jogo.jogadorPerdeu();
    this.pintarColunas(linha, avaliacoes);

    if (jogadorPerdeu) 
    {
      this.setMessageLabelClass("cor-erro");
    } 
    else 
    {
      this.setMessageLabelClass("cor-acerto");
    }

    if (jogadorAcertou || jogadorPerdeu) 
    {
      this.lblMensagemFinal.textContent = this.jogo.mensagemFinal;
      
      for (const botao of this.pnlConteudo.children) 
      {
        if (botao.id === "btnReiniciar")
        {
          continue;
        }

        (botao as HTMLButtonElement).disabled = true;
      }
      
      this.divMensagemFinal.classList.remove("display-none"); 
    }

    this.indiceColunaAtual = -1;
  }

  private receberPalavra(): string 
  {
    let palavra = "";

    for (let coluna = 0; coluna < 5; coluna++) 
    {
      palavra += (this.linhaAtual.children[coluna] as HTMLDivElement).innerText;
    }

    return palavra;
  }

  private pintarColunas(indiceLinha: number, avaliacoes: VerificacaoDaLetraEnum[]): void 
  {
    for (let indiceColuna = 0; indiceColuna < avaliacoes.length; indiceColuna++) 
    {
      const colunaSelecionada = this.divLinhas[indiceLinha].children[indiceColuna] as HTMLDivElement;

      switch (avaliacoes[indiceColuna]) 
      {
        case VerificacaoDaLetraEnum.Correta:
          colunaSelecionada.classList.add("letra-correta");

          break;

        case VerificacaoDaLetraEnum.PosicaoErrada:
          colunaSelecionada.classList.add("letra-posicao-errada");
          
          break;

        case VerificacaoDaLetraEnum.NaoExiste:
          colunaSelecionada.classList.add("letra-nao-existe");

          break;
      }
    }
  }
  
  private inserirLetra(event: Event): void 
  {
    if (this.indiceColunaAtual > 3 || this.indiceColunaAtual < -1) 
    {
      return;
    }
    
    const letra = (event.target as HTMLButtonElement).textContent;

    if(letra != null){
      if (letra.length === 1) 
      {
        this.indiceColunaAtual++;
    
        const coluna = this.linhaAtual.children[this.indiceColunaAtual] as HTMLDivElement;
    
        coluna.textContent = letra;
      }
    }
  }

  private setMessageLabelClass(className: string): void 
  {
    this.lblMensagemFinal.classList.add(className);
  }
}
