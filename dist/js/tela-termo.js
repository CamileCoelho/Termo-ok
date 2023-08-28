"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelaTermo = void 0;
const avaliacao_letra_enum_js_1 = require("./avaliacao-letra.enum.js");
const termo_js_1 = require("./termo.js");
class TelaTermo {
    constructor() {
        this.divLinhasTermo = [];
        this.indiceColunaSelecionada = -1;
        this.jogo = new termo_js_1.Termo();
        this.termo = [this.jogo];
        const htmlComponents = this.getHTMLComponents();
        this.registerEvents(htmlComponents);
        this.hideMessageDiv();
    }
    getHTMLComponents() {
        return {
            pnlTeclado: document.getElementById("pnlTeclado"),
            btnEnter: document.getElementById("btnEnter"),
            btnReiniciar: document.getElementById("btnReiniciar"),
            btnApagar: document.getElementById("btnApagar"),
            divMensagemFinal: document.getElementById("divMensagemFinal"),
            lblMensagemFinal: document.getElementById("lblMensagemFinal"),
        };
    }
    registerEvents(htmlComponents) {
        htmlComponents.btnEnter.addEventListener("click", this.avaliarPalavra.bind(this));
        htmlComponents.btnReiniciar.addEventListener("click", this.reiniciarJogo.bind(this));
        htmlComponents.btnApagar.addEventListener("click", this.apagarLetra.bind(this));
        for (const botao of htmlComponents.pnlTeclado.children) {
            if (botao.textContent === "Enter" || botao.textContent === "Reiniciar" || botao.textContent === "<")
                continue;
            botao.addEventListener("click", this.digitarLetra.bind(this));
        }
    }
    hideMessageDiv() {
        this.getMessageDiv().classList.add("display-none");
    }
    getMessageDiv() {
        return document.getElementById("divMensagemFinal");
    }
    reiniciarJogo() {
        this.jogo = new termo_js_1.Termo();
        for (const linha of this.divLinhasTermo) {
            for (const coluna of linha.children) {
                coluna.textContent = "";
                coluna.classList.remove("letra-correta", "letra-posicao-incorreta", "letra-nao-existente");
            }
        }
        this.enableKeyboardButtons();
        // this.lblMensagemFinal.textContent = '';
        this.hideMessageDiv();
        this.indiceColunaSelecionada = -1;
    }
    apagarLetra() {
        if (this.indiceColunaSelecionada >= 0) {
            const coluna = this.getCurrentLine().children[this.indiceColunaSelecionada];
            if (coluna) {
                coluna.textContent = "";
                this.indiceColunaSelecionada--;
            }
        }
    }
    avaliarPalavra() {
        const linha = this.jogo.tentativas;
        const palavraCompleta = this.obterPalavra();
        const avaliacoes = this.jogo.avaliar(palavraCompleta);
        if (avaliacoes === null) {
            return;
        }
        const jogadorAcertou = this.jogo.jogadorAcertou(palavraCompleta);
        const jogadorPerdeu = this.jogo.jogadorPerdeu();
        this.colorirColunas(linha, avaliacoes);
        if (jogadorPerdeu) {
            this.setMessageLabelClass("cor-erro");
        }
        else {
            this.setMessageLabelClass("cor-acertou");
        }
        if (jogadorAcertou || jogadorPerdeu) {
            //  this.lblMensagemFinal.textContent = this.jogo.mensagemFinal;
            this.disableKeyboardButtons();
            this.showMessageDiv();
        }
        this.indiceColunaSelecionada = -1;
    }
    getCurrentLine() {
        return this.divLinhasTermo[this.jogo.tentativas];
    }
    obterPalavra() {
        let palavra = '';
        for (let coluna = 0; coluna < 5; coluna++) {
            palavra += this.getCurrentLine().children[coluna].innerText;
        }
        return palavra;
    }
    colorirColunas(indiceLinha, avaliacoes) {
        const linha = this.divLinhasTermo[indiceLinha];
        for (let indiceColuna = 0; indiceColuna < avaliacoes.length; indiceColuna++) {
            const colunaSelecionada = linha.children[indiceColuna];
            switch (avaliacoes[indiceColuna]) {
                case avaliacao_letra_enum_js_1.AvaliacaoLetraEnum.Correta:
                    colunaSelecionada.classList.add("letra-correta");
                    break;
                case avaliacao_letra_enum_js_1.AvaliacaoLetraEnum.PosicaoIncorreta:
                    colunaSelecionada.classList.add("letra-posicao-incorreta");
                    break;
                case avaliacao_letra_enum_js_1.AvaliacaoLetraEnum.NaoExistente:
                    colunaSelecionada.classList.add("letra-nao-existente");
                    break;
            }
        }
    }
    setMessageLabelClass(className) {
        // this.lblMensagemFinal.classList.add(className);
    }
    disableKeyboardButtons() {
        for (const botao of this.getHTMLComponents().pnlTeclado.children) {
            if (botao.textContent === "Reiniciar") {
                continue;
            }
            botao.disabled = true;
        }
    }
    enableKeyboardButtons() {
        for (const botao of this.getHTMLComponents().pnlTeclado.children) {
            if (botao.textContent === "Reiniciar") {
                continue;
            }
            botao.disabled = false;
        }
    }
    showMessageDiv() {
        this.getMessageDiv().classList.remove("display-none");
    }
    digitarLetra(event) {
        if (this.indiceColunaSelecionada > 3 || this.indiceColunaSelecionada < -1) {
            return;
        }
        const letra = event.target.textContent;
        this.indiceColunaSelecionada++;
        const coluna = this.getCurrentLine().children[this.indiceColunaSelecionada];
        coluna.textContent = letra;
    }
}
exports.TelaTermo = TelaTermo;
//# sourceMappingURL=tela-termo.js.map