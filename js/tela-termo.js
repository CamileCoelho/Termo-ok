import { VerificacaoDaLetraEnum } from "./verificacao-letra-enum.js";
import { Termo } from "./termo.js";
export class TelaTermo {
    get linhaAtual() { return this.divLinhas[this.jogo.tentativas]; }
    constructor() {
        this.indiceColunaAtual = -1;
        this.divLinhas = [];
        this.jogo = new Termo();
        this.jogos = new Array();
        this.btnEnter = document.getElementById("btnEnter");
        this.pnlTeclado = document.getElementById("pnlTeclado");
        this.pnlConteudo = document.getElementById("pnlConteudo");
        this.btnReiniciar = document.getElementById("btnReiniciar");
        this.btnBackspace = document.getElementById("btnBackspace");
        this.divMensagemFinal = document.getElementById("divMensagemFinal");
        this.lblMensagemFinal = document.getElementById("lblMensagemFinal");
        this.jogos.push(this.jogo);
        document.querySelectorAll(".linha").forEach(div => {
            this.divLinhas.push(div);
        });
        this.registrarEventos();
        this.divMensagemFinal.classList.add("display-none");
    }
    registrarEventos() {
        for (const botao of this.pnlConteudo.children) {
            if (botao.id === "btnEnter" || botao.id === "btnReiniciar" || botao.id === "btnBackspace") {
                continue;
            }
            botao.addEventListener("click", this.inserirLetra.bind(this));
        }
        this.btnEnter.addEventListener("click", this.verificarPalavra.bind(this));
        this.btnReiniciar.addEventListener("click", this.reiniciarJogo.bind(this));
        this.btnBackspace.addEventListener("click", this.removerLetra.bind(this));
    }
    reiniciarJogo() {
        this.jogo = new Termo();
        for (const linha of this.divLinhas) {
            for (const letra of linha.children) {
                letra.textContent = "";
                letra.classList.remove("letra-correta", "letra-posicao-errada", "letra-nao-existe");
            }
        }
        for (const botao of this.pnlConteudo.children) {
            botao.disabled = false;
        }
        this.lblMensagemFinal.textContent = "";
        this.divMensagemFinal.classList.add("display-none");
        this.indiceColunaAtual = -1;
    }
    removerLetra() {
        if (this.indiceColunaAtual >= 0) {
            const letra = this.linhaAtual.children[this.indiceColunaAtual];
            if (letra) {
                letra.textContent = "";
                this.indiceColunaAtual--;
            }
        }
    }
    verificarPalavra() {
        const linha = this.jogo.tentativas;
        const palavraCompleta = this.receberPalavra();
        const avaliacoes = this.jogo.avaliar(palavraCompleta);
        if (avaliacoes === null) {
            return;
        }
        const jogadorAcertou = this.jogo.jogadorAcertou(palavraCompleta);
        const jogadorPerdeu = this.jogo.jogadorPerdeu();
        this.pintarColunas(linha, avaliacoes);
        if (jogadorPerdeu) {
            this.setMessageLabelClass("cor-erro");
        }
        else {
            this.setMessageLabelClass("cor-acerto");
        }
        if (jogadorAcertou || jogadorPerdeu) {
            this.lblMensagemFinal.textContent = this.jogo.mensagemFinal;
            for (const botao of this.pnlConteudo.children) {
                if (botao.id === "btnReiniciar") {
                    continue;
                }
                botao.disabled = true;
            }
            this.divMensagemFinal.classList.remove("display-none");
        }
        this.indiceColunaAtual = -1;
    }
    receberPalavra() {
        let palavra = "";
        for (let coluna = 0; coluna < 5; coluna++) {
            palavra += this.linhaAtual.children[coluna].innerText;
        }
        return palavra;
    }
    pintarColunas(indiceLinha, avaliacoes) {
        for (let indiceColuna = 0; indiceColuna < avaliacoes.length; indiceColuna++) {
            const colunaSelecionada = this.divLinhas[indiceLinha].children[indiceColuna];
            switch (avaliacoes[indiceColuna]) {
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
    inserirLetra(event) {
        if (this.indiceColunaAtual > 3 || this.indiceColunaAtual < -1) {
            return;
        }
        const letra = event.target.textContent;
        if (letra != null) {
            if (letra.length === 1) {
                this.indiceColunaAtual++;
                const coluna = this.linhaAtual.children[this.indiceColunaAtual];
                coluna.textContent = letra;
            }
        }
    }
    setMessageLabelClass(className) {
        this.lblMensagemFinal.classList.add(className);
    }
}
//# sourceMappingURL=tela-termo.js.map